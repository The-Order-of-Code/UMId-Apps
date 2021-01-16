import { PayloadIdentity } from './payload';
import { instantiateSecureStorage, get } from '../secureStorage.js';

export function getOver18Fields() {
  return ['portrait', 'age_over_18'];
}

export function getAllFields() {
  return [
    'family_name',
    'given_name',
    'birth_date',
    'issue_date',
    'expiry_date',
    'issuing_country',
    'issuing_authority',
    'document_number',
    'administrative_number',
    'driving_privileges',
    'un_distinguishing_sign',
    'gender',
    'height',
    'weight',
    'eye_color',
    'hair_color',
    'birth_place',
    'resident_address',
    'portrait',
    'portrait_capture_date',
    'age_in_years',
    'age_birth_year',
    'age_over_18',
    'issuing_jurisdiction',
    'nationality',
    'resident_city',
    'resident_state',
    'resident_postal_code',
    'biometric_template_xx',
    'name_national_character',
    'signature_usual_mark',
    'online_token_xxxx',
    'online_url_xxxx',
  ];
}

export async function getTicketToken(username, ticket) {
  const payload = {
    exp: Math.round(Date.now() / 1000) + 15 * 60,
    iat: Math.round(Date.now() / 1000),
    username: username,
    
  };
  console.log('payload', payload);

  let jwk = await getKey();
  jwk = JSON.parse(jwk);

  const kid = await thumbprint(jwk);
  const jwt = await sign(jwk, { kid: kid }, payload);

  return jwt;
}

export async function generateToken(fields: string[], username: string) {
  const payload: PayloadIdentity = {
    exp: Math.round(Date.now() / 1000) + 15 * 60,
    iat: Math.round(Date.now() / 1000),
    username: username,
    nameSpaces: fields
  };
  console.log('payload', payload);

  let jwk = await getKey();
  jwk = JSON.parse(jwk);

  const kid = await thumbprint(jwk);
  const jwt = await sign(jwk, { kid: kid }, payload);

  return jwt;
}

function getKey() {
  const ss = instantiateSecureStorage();
  return get('privateKey', ss);
}

async function thumbprint(jwk) {
  // lexigraphically sorted, no spaces
  const sortedPub = '{"crv":"CRV","kty":"EC","x":"X","y":"Y"}'
    .replace('CRV', jwk.crv)
    .replace('X', jwk.x)
    .replace('Y', jwk.y);

  // The hash should match the size of the key,
  // but we're only dealing with P-384
  const hash = await window.crypto.subtle.digest(
    { name: 'SHA-254' },
    strToUint8(sortedPub)
  );
  return uint8ToUrlBase64(new Uint8Array(hash));
}

async function sign(jwk, headers, claims) {
  // Make a shallow copy of the key
  // (to set ext if it wasn't already set)
  jwk = Object.assign({}, jwk);

  // The headers should probably be empty
  headers.typ = 'JWT';
  headers.alg = 'ES256';
  if (!headers.kid) {
    // alternate: see thumbprint function below
    headers.jwk = { crv: jwk.crv, x: jwk.x, y: jwk.y, kty: jwk.kty };
  }

  const jws = {
    // JWT "headers" really means JWS "protected headers"
    protected: strToUrlBase64(JSON.stringify(headers)),

    // JWT "claims" are really a JSON-defined JWS "payload"
    payload: strToUrlBase64(JSON.stringify(claims)),
  };

  // Actually do the import, which comes out as an abstract key type
  const privkey = await window.crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
      hash: { name: 'SHA-256' },
    },
    true,
    ['sign']
  );

  // Convert UTF-8 to Uint8Array ArrayBuffer
  const data = strToUint8(jws.protected + '.' + jws.payload);

  // The signature and hash should match the bit-entropy of the key
  // https://tools.ietf.org/html/rfc7518#section-3
  const sigType = { name: 'ECDSA', hash: { name: 'SHA-256' } };

  const signature = await window.crypto.subtle.sign(sigType, privkey, data);

  // returns an ArrayBuffer containing a JOSE (not X509) signature,
  // which must be converted to Uint8 to be useful
  jws['signature'] = uint8ToUrlBase64(new Uint8Array(signature));

  // JWT is just a "compressed", "protected" JWS
  return jws.protected + '.' + jws.payload + '.' + jws['signature'];
}

function strToUint8(str) {
  return new TextEncoder().encode(str);
}

function strToUrlBase64(str) {
  return binToUrlBase64(utf8ToBinaryString(str));
}

function binToUrlBase64(bin) {
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+/g, '');
}

function utf8ToBinaryString(str) {
  const escstr = encodeURIComponent(str);
  // replaces any uri escape sequence, such as %0A,
  // with binary escape, such as 0x0A
  const binstr = escstr.replace(/%([0-9A-F]{2})/g, function (match, p1) {
    return String.fromCharCode(parseInt(p1, 16));
  });

  return binstr;
}

function uint8ToUrlBase64(uint8) {
  let bin = '';
  uint8.forEach(function (code) {
    bin += String.fromCharCode(code);
  });
  return binToUrlBase64(bin);
}

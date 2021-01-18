import { Payload } from '../../interfaces/holder-mode/payload';
import { instantiateSecureStorage, get } from '../secureStorage.js';
import { encodeJwt, decodeJwt, verifyJwt, RawJwt } from '@borderless/web-jwt';
import * as GeneralMethods from './general';

export async function generateToken(payload){

  let jwk = await getKey();
  jwk = JSON.parse(jwk);
  // Actually do the import, which comes out as an abstract key type
  const privkey = await window.crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    false,
    ['sign']
  );

  const jwt = await encodeJwt(
    {
      alg: "ES256",
    },
    payload,
    privkey
  )

  return jwt;
  
}

function getKey() {
  const ss = instantiateSecureStorage();
  return get('privateKey', ss);
}


  
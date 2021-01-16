import { Buffer } from 'buffer';
import * as iconv from 'iconv-lite';
import * as asn1js from 'asn1js';
import * as pkijs from 'pkijs';
import * as CBOR from './cbor.js';
import * as pvutils from 'pvutils';

export function b2str(buf) {
  const uint8Array = new Uint8Array(buf);
  const data = uint8Array.reduce(
    (acc, i) => (acc += String.fromCharCode.apply(null, [i])),
    ''
  );
  return data;
}

export function str2ab(str) {
  return Uint8Array.from([...str].map((ch) => ch.charCodeAt())).buffer;
}

export function decode_base64(str) {
  console.log(iconv.encodingExists('ISO-8859-1'));
  const i = iconv.encode(str, 'ISO-8859-1');
  const s = atob(i.toString());
  return s;
}

export function decode_urlsafe_base64(str){
  return atob(str.replace(/_/g, '/').replace(/-/g, '+'));
}

export function url_safe_base64_to_base64(str){
  return btoa(decode_urlsafe_base64(str));
}

export function strMapToObj(strMap) {
  const obj = {};
  strMap.forEach(function(value, key){
      obj[key] = value
  });
  return obj;
}

export function objToStrMap(obj) {
  const strMap = new Map();
  for (const k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

/**
 * Decode e processamento de um PEM certificate
 * @param pem str com um pem certificate
 */
export function decodeCert(pem) {
  if(typeof pem !== 'string') {
      throw new Error('Expected PEM as string');
  }

  // Load certificate in PEM encoding (base64 encoded DER)
  const b64 = pem.replace(/(-----(BEGIN|END) CERTIFICATE-----|[\n\r])/g, '');

  // Now that we have decoded the cert it's now in DER-encoding
  // And massage the cert into a BER encoded one
  const ber = pvutils.stringToArrayBuffer(pvutils.fromBase64(b64))

  // And now Asn1js can decode things
  const asn1 = asn1js.fromBER(ber);

  return new pkijs.Certificate({ schema: asn1.result });
}

/**
 * Função responsável de transformar um arraybuffer em string base64
 * @param {*} buffer
 * @return {*} 
 */
export function arrayBufferToBase64( buffer ) {
  var binary = '';
  var bytes = new Uint8Array( buffer );
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}

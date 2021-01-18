import { Buffer } from 'buffer';
import * as iconv from 'iconv-lite';
import * as asn1js from 'asn1js';
import * as pkijs from 'pkijs';
import * as CBOR from './cbor.js';
import * as pvutils from 'pvutils';


/**
 * Método responsável pela conversão de 
 * Buffer para string
 *
 * @export
 * @param {*} buf buffer ao qual deseja se converter
 * @return {*} 
 */
export function b2str(buf) {
  const uint8Array = new Uint8Array(buf);
  const data = uint8Array.reduce(
    (acc, i) => (acc += String.fromCharCode.apply(null, [i])),
    ''
  );
  return data;
}

/**
 * Método responsável pela conversão de string para Buffer Array
 *
 * @export
 * @param {*} str string a qual deseja se converter
 * @return {*} 
 */
export function str2ab(str) {
  return Uint8Array.from([...str].map((ch) => ch.charCodeAt())).buffer;
}

/**
 * Método responsável por realizar o decode de uma string base64
 *
 * @export
 * @param {*} str 
 * @return {*} 
 */
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
 * Decode da estrutura mdl retornada pelo backend na autenticação
 * @param mdl estrutura retornada pelo backend na autenticação
 */
export function decodeIssuerSignedItems(mdl){
  const mdl_map = objToStrMap(mdl);
  const obj = new Map();
  for (const [key, value] of mdl_map.entries()){
    const value_base64_decoded = str2ab(decode_urlsafe_base64(value));
    const value_cbor_decoded = CBOR.decode(value_base64_decoded)
    obj.set(key,value_cbor_decoded);
  }
  return strMapToObj(obj);
}



/**
 * Função responsável de transformar um arraybuffer em string base64
 * @param {*} buffer
 * @return {*} 
 */
export function arrayBufferToBase64( buffer ) {
  let binary = '';
  const bytes = new Uint8Array( buffer );
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
  }
  return window.btoa( binary );
}


export function userBackendToUserResponse(user){
  const mdl_map = objToStrMap(user);
  const obj = new Map();
  for (const [key, value] of mdl_map.entries()){
    if(key == 'user'){
      for (const [key1, value1] of objToStrMap(user['user']).entries()){
        obj.set('user.' + key1,value1);
      }
    } else { 
      if(key == 'course'){
        for (const [key2, value2] of objToStrMap(user['course']).entries()){
          obj.set('course.' + key2,value2);
        }
      } else {
        obj.set(key,value);
      }
    }
  }
  return strMapToObj(obj);
}

export function userResponseToUserBackend(user){
  const mdl_map = objToStrMap(user);
  let userDict = {}, courseDict = {};

  const obj = new Map();
  for (const [key, value] of mdl_map.entries()){
    const splitted = key.split('.');
    console.log(splitted.length)
    if(splitted.length > 1) {
        if(splitted[0] == 'user'){userDict[splitted[1]] = value; obj.set(splitted[0],userDict);}
        else{courseDict[splitted[1]] = value; obj.set(splitted[0],courseDict);}
    } else {
        obj.set(splitted[0],value);
    }
  }
  return strMapToObj(obj);
}
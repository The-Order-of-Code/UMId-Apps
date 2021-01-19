import * as iconv from 'iconv-lite';
import * as asn1js from "asn1js";
import * as pkijs from "pkijs";
import * as CBOR from './cbor.js'
import * as pvutils from 'pvutils';

/**
 * Métodos gerais a todas as aplicações
 *
 */
/**
 * Transformar um ArrayBuffer em String
 * @export
 * @param {*} buf
 * @returns String
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
 * Transformar uma String em ArrayBuffer
 * @param {*} str
 * @returns ArrayBuffer
 */
export function str2ab(str) {
  return Uint8Array.from([...str].map((ch) => ch.charCodeAt())).buffer;
}


export function decode_base64(str) {
  console.log(iconv.encodingExists('ISO-8859-1'));
  const i = iconv.encode(str, 'ISO-8859-1');
  console.log(i.toString())
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
  let obj = {};
  strMap.forEach(function(value, key){
      obj[key] = value
  });
  return obj;
}

export function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

export function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
}

export function jsonToStrMap(jsonStr) {
  return objToStrMap(JSON.parse(jsonStr));
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
 * Decode da estrutura IssuerSignedItemsBytes para Uma estrutura 
 * @param issuerSignedItemsBytes 
 */
export function decode_issuerSignedItemsBytes(issuerSignedItemsBytes){
  var issuerSignedItems = [];
  for(var i = 0; i<issuerSignedItemsBytes.length;i++){
    issuerSignedItems[i] = CBOR.decode(Buffer.from(issuerSignedItemsBytes[i],'base64').buffer);
  }
  return issuerSignedItems;
}

export function decodeIssuerItems(issuer_items_encoded){
  console.log(issuer_items_encoded)
  let issuer_items = jsonToStrMap(JSON.stringify(issuer_items_encoded));
  issuer_items.forEach(
    (attr,value)=>{
      const c = Buffer.from(value).toString();
      console.log("value",c)
      issuer_items.set(attr,c);
    }
  )
  return issuer_items;
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
import * as GeneralMethods from '../../general/holder-mode/general';
import * as CBOR from '../../general/holder-mode/cbor.js';
import * as pkijs from 'pkijs';
import * as EC from 'elliptic';
import * as crypto from 'crypto'; 
import * as consts from '../../general/constants';
import {toBase64, arrayBufferToString } from 'pvutils';
/**
 * Metodo de obtenção do certificado que está inserido na Cose Signature
 * @param signature assinatura onde se encontra o certificado com a chave publica para se fazer a verificação
 */
export function get_Reader_DS_certificate(signature){
    const readable_signature = CBOR.decode(Buffer.from(signature).buffer)
    console.log('readable signature', readable_signature);
    const prefix = '-----BEGIN CERTIFICATE-----\n';
    const postfix = '-----END CERTIFICATE-----';
  
    const pemText = prefix + Buffer.from(readable_signature[1][33]).toString('base64').match(/.{0,64}/g).join('\n') + postfix; 
    console.log('pem certificate', pemText);
    return pemText;
  }


/**
 * Verificar a cadeia do certificado 
 *
 * @export
 * @param {*} signature assinatura onde se encontra o certificado com a chave publica para se fazer a verificação
 * @return {*} 
 */
export async function verifyEntCertificateChain(signature){

    const cert_reader = GeneralMethods.decodeCert(get_Reader_DS_certificate(signature)); 
    console.log(cert_reader);
    //const ocsp_verified = await OCSPService.verifyCertValidityOnOCSP(cert_reader); // ainda n temos OCSP ativo no backend
    let ocsp_verified = 'good';
    if(ocsp_verified != 'revoked'){
      const root_cert = GeneralMethods.decodeCert(consts.root_cert_pem);
      console.log('Root certificate: ', root_cert);
      const trustedCertificates = [];
      const certificates_to_verify = [];
      const crls = [];
    
      trustedCertificates.push(root_cert);
      certificates_to_verify.push(cert_reader);
      // create chain verification engine
      const promise_verify = new pkijs.CertificateChainValidationEngine({
          trustedCerts: trustedCertificates,
          certs: certificates_to_verify,
          crls
      }).verify().then(
          (result) => {console.log(result);return result;},
          error => {console.log(error);return null;}
      );8
      // verify chain
      return promise_verify;
    }
    else {
      return null;
    }
  }

/**
 * Método para verificação da assinatura COSE do reader 
 *
 * @export
 * @param {*} ReaderAuthStruct
 * @param {*} DeviceAuthSignature
 * @return {*} 
 */
export function verifySignature(DeviceAuthStruct,DeviceAuthSignature){
  const reader_cert = get_Reader_DS_certificate(DeviceAuthSignature)
  const cert = GeneralMethods.decodeCert(reader_cert);
  console.log(cert);
  console.log(cert.subjectPublicKeyInfo.parsedKey);
  const AlgFromTags = {};
  AlgFromTags[-7] = { 'sign': 'ES256', 'digest': 'SHA-256' };
  AlgFromTags[-35] = { 'sign': 'ES384', 'digest': 'SHA-384' };
  AlgFromTags[-36] = { 'sign': 'ES512', 'digest': 'SHA-512' };
 
  const COSEAlgToNodeAlg = {
    'ES256': { 'sign': 'p256', 'digest': 'sha256' },
    'ES384': { 'sign': 'p384', 'digest': 'sha384' },
    'ES512': { 'sign': 'p512', 'digest': 'sha512' }
  };  
  const verifier = {
    'key': {
      'x': Buffer.from(cert.subjectPublicKeyInfo.parsedKey.x),
      'y': Buffer.from(cert.subjectPublicKeyInfo.parsedKey.y)
    }
  }
  const readable_signature = CBOR.decode(Buffer.from(DeviceAuthSignature).buffer);
  const algorithm = CBOR.decode(Buffer.from(readable_signature[0]).buffer);
  DeviceAuthSignature = readable_signature[3];
  const hash = crypto.createHash(COSEAlgToNodeAlg[AlgFromTags[algorithm[1]].sign].digest);
  hash.update(DeviceAuthStruct);
  const msgHash = hash.digest();
  const ec = new EC.ec(COSEAlgToNodeAlg[AlgFromTags[algorithm[1]].sign].sign);
  const key = ec.keyFromPublic(verifier.key);
  const sig = { 'r': DeviceAuthSignature.slice(0, DeviceAuthSignature.length / 2), 's': DeviceAuthSignature.slice(DeviceAuthSignature.length / 2) };
  return key.verify(msgHash, sig);
} 

export function formatPEM(pemString)
{
	const PEM_STRING_LENGTH = pemString.length, LINE_LENGTH = 64;
	const wrapNeeded = PEM_STRING_LENGTH > LINE_LENGTH;

	if(wrapNeeded)
	{
		let formattedString = "", wrapIndex = 0;

		for(let i = LINE_LENGTH; i < PEM_STRING_LENGTH; i += LINE_LENGTH)
		{
			formattedString += pemString.substring(wrapIndex, i) + "\r\n";
			wrapIndex = i;
		}

		formattedString += pemString.substring(wrapIndex, PEM_STRING_LENGTH);
		return formattedString;
	}
	else
	{
		return pemString;
	}
}

export async function verifyDigests(mso_str, user_info){
  let mso = JSON.parse(mso_str);
  console.log(mso)
  console.log(user_info);
  const root_cert = GeneralMethods.decodeCert(consts.root_cert_pem);
  console.log(root_cert.subjectPublicKeyInfo)
  console.log(root_cert.subjectPublicKeyInfo.parsedKey.toSchema().toBER())
  const publKey = formatPEM(toBase64(arrayBufferToString(root_cert.subjectPublicKeyInfo.toSchema().toBER(false))));
  const pub2 = '-----BEGIN PUBLIC KEY-----\n' + publKey + '\n-----END PUBLIC KEY-----';
  console.log(pub2);
  //const pub2 = "-----BEGIN PUBLIC KEY-----\n" + "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEAz8EbDwdSq2BCnBkQcIy1i1R+Ngg\n" + "llxkkny6OuK1FFaQIalNvqEAqIyvEaK0EL/YvfEUZ6gztrwhdJ76S/YGAg==\n" + "-----END PUBLIC KEY-----"
  var verifier = crypto.createVerify('sha256');
  verifier.update(user_info["user.username"]);
  var ver = verifier.verify(pub2, mso.valueDigests.user.username,'hex');
  console.log(ver);//<--- always false!
  // {
  //   'key': 
  //     {
  //       x: Buffer.from(root_cert.subjectPublicKeyInfo.parsedKey.x),
  //       y: Buffer.from(root_cert.subjectPublicKeyInfo.parsedKey.y), 
  //     }
  //   }
  
  // const pubkey = await window.crypto.subtle.importKey(
  //     'jwk',
  //     publKey,
  //     {
  //       name: 'ECDSA',
  //       namedCurve: 'P-256',
  //     },
  //     true,
  //     ['verify']
  //   );
  //   console.log(pubkey);
  // // const ec = new EC.ec('p256');
  // // const key = ec.keyFromPublic(publKey.key);
  // // console.log(key.getPublic())
  // const signature = hexStringToArrayBuffer(mso.valueDigests.user.username);
  // const data = new TextEncoder().encode(user_info["user.username"]);
  //     const verified = await window.crypto.subtle.verify(
  //       {
  //         name: "ECDSA",
  //         hash: {name: "SHA-256"},
  //       },
  //       pubkey,
  //       signature,
  //       data
  //     );
  //     console.log(verified)   
}

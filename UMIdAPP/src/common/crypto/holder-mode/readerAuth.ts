
import * as GeneralMethods from '../../general/holder-mode/general';
import * as COSE from 'cose-js';
import * as CBOR from '../../general/holder-mode/cbor.js';
import * as pkijs from 'pkijs';
import * as EC from 'elliptic';
import * as crypto from 'crypto';
import { HTTP } from '@ionic-native/http/ngx';
import * as SecureStorage from '../../general/secureStorage.js';
import * as OCSPService from '../../ocsp/holder-mode/OCSP.js';
import * as consts from '../../general/constants'
/**
 * Metodo de obtenção do certificado que está inserido na Cose Signature
 * @param signature assinatura onde se encontra o certificado com a chave publica para se fazer a verificação
 */
export function get_Reader_DS_certificate(signature){
    let readable_signature = CBOR.decode(Buffer.from(signature).buffer)
    console.log('readable signature', readable_signature);
    var prefix = '-----BEGIN CERTIFICATE-----\n';
    var postfix = '-----END CERTIFICATE-----';
  
    var pemText = prefix + Buffer.from(readable_signature[1][33]).toString('base64').match(/.{0,64}/g).join('\n') + postfix; 
    console.log('pem certificate', pemText);
    return pemText;
  }

export function verifySignature(ReaderAuthStruct,ReaderAuthSignature){
  let reader_cert = get_Reader_DS_certificate(ReaderAuthSignature)
  let cert = GeneralMethods.decodeCert(reader_cert);
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
  let readable_signature = CBOR.decode(Buffer.from(ReaderAuthSignature).buffer);
  let algorithm = CBOR.decode(Buffer.from(readable_signature[0]).buffer);
  ReaderAuthSignature = readable_signature[3];
  const hash = crypto.createHash(COSEAlgToNodeAlg[AlgFromTags[algorithm[1]].sign].digest);
  hash.update(ReaderAuthStruct);
  let msgHash = hash.digest();
  const ec = new EC.ec(COSEAlgToNodeAlg[AlgFromTags[algorithm[1]].sign].sign);
  const key = ec.keyFromPublic(verifier.key);
  let sig = { 'r': ReaderAuthSignature.slice(0, ReaderAuthSignature.length / 2), 's': ReaderAuthSignature.slice(ReaderAuthSignature.length / 2) };
  return key.verify(msgHash, sig);
} 

export async function verifyEntCertificateChain(signature, root_cert_pem){
    let cert_reader = GeneralMethods.decodeCert(get_Reader_DS_certificate(signature)); 
    console.log(cert_reader);
    let ocsp_verified = await OCSPService.verifyCertValidityOnOCSP(cert_reader);
    if(ocsp_verified != "revoked"){
      let root_cert_gnr = GeneralMethods.decodeCert(root_cert_pem);
      let trustedCertificates = [];
      let certificates_to_verify = [];
      let crls = [];
    
      trustedCertificates.push(root_cert_gnr);
      certificates_to_verify.push(cert_reader);
      // create chain verification engine
      const promise_verify = new pkijs.CertificateChainValidationEngine({
          trustedCerts: trustedCertificates,
          certs: certificates_to_verify,
          crls
      }).verify().then(
          (result) => {console.log(result);return result.resultCode;},
          error => {console.log(error);return null;}
      );
      // verify chain
      return promise_verify;
    }
    else {
      return null;
    }
  }

  /**
   * verifica cadeia de certificados do Backend
   * @param user_cert_pem certificado do user em formato PEM
   */
  export async function verifyBackendCertChain(user_cert_pem:string) {
    let cert_user = GeneralMethods.decodeCert(user_cert_pem);
    let root_cert_gnr = GeneralMethods.decodeCert(consts.root_cert_pem);
      let trustedCertificates = [];
      let certificates_to_verify = [];
      let crls = [];
    
      trustedCertificates.push(root_cert_gnr);
      certificates_to_verify.push(cert_user);
      // create chain verification engine
      const promise_verify = new pkijs.CertificateChainValidationEngine({
          trustedCerts: trustedCertificates,
          certs: certificates_to_verify,
          crls
      }).verify().then(
          (result) => {console.log(result); return result.result;},
          error => {console.log(error);return null;}
      );
      // verify chain
      return promise_verify;
  }

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
    const readable_signature = CBOR.decode(Buffer.from(signature).buffer)
    console.log('readable signature', readable_signature);
    const prefix = '-----BEGIN CERTIFICATE-----\n';
    const postfix = '-----END CERTIFICATE-----';
  
    const pemText = prefix + Buffer.from(readable_signature[1][33]).toString('base64').match(/.{0,64}/g).join('\n') + postfix; 
    console.log('pem certificate', pemText);
    return pemText;
  }

/**
 * Método para verificação da assinatura COSE do reader 
 *
 * @export
 * @param {*} ReaderAuthStruct
 * @param {*} ReaderAuthSignature
 * @return {*} 
 */
export function verifySignature(ReaderAuthStruct,ReaderAuthSignature){
  const reader_cert = get_Reader_DS_certificate(ReaderAuthSignature)
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
  const readable_signature = CBOR.decode(Buffer.from(ReaderAuthSignature).buffer);
  const algorithm = CBOR.decode(Buffer.from(readable_signature[0]).buffer);
  ReaderAuthSignature = readable_signature[3];
  const hash = crypto.createHash(COSEAlgToNodeAlg[AlgFromTags[algorithm[1]].sign].digest);
  hash.update(ReaderAuthStruct);
  const msgHash = hash.digest();
  const ec = new EC.ec(COSEAlgToNodeAlg[AlgFromTags[algorithm[1]].sign].sign);
  const key = ec.keyFromPublic(verifier.key);
  const sig = { 'r': ReaderAuthSignature.slice(0, ReaderAuthSignature.length / 2), 's': ReaderAuthSignature.slice(ReaderAuthSignature.length / 2) };
  return key.verify(msgHash, sig);
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
      );
      // verify chain
      return promise_verify;
    }
    else {
      return null;
    }
  }

  /**
   * Método para buscar os certificados raiz dos agentes de autoridade
   * GNR e PSP
   *
   * @export
   * @param {*} url link para fazer a requisição
   * @param {*} entity qual entidade se deseja (GNR ou PSP)
   */
  export async function getEntRootCertificate(url,entity){
    const http = new HTTP();
    const data = await http.sendRequest(url,{method: 'get',responseType: 'arraybuffer'});
    const cert_der = data.data
    console.log(cert_der);
    const ss = SecureStorage.instantiateSecureStorage();
    const pemText = Buffer.from(cert_der).toString('base64').match(/.{0,64}/g).join('\n'); 
    switch(entity){
      case 'gnr': await SecureStorage.set('root_cert_gnr',pemText,ss); break;
      case 'psp': await SecureStorage.set('root_cert_psp',pemText,ss); break;
      default: break;
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
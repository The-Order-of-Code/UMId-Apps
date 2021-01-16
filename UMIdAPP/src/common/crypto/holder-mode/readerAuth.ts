
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

export async function verifyEntCertificateChain(signature){
    var root_cert_gnr_pem, root_cert_psp_pem;
    let ss = SecureStorage.instantiateSecureStorage();
    let root_certs = await Promise.all([SecureStorage.get('root_cert_gnr',ss),SecureStorage.get('root_cert_psp',ss)]);
    root_cert_gnr_pem = root_certs[0];
    root_cert_psp_pem = root_certs[1];
    let cert_reader = GeneralMethods.decodeCert(get_Reader_DS_certificate(signature)); 
    console.log(cert_reader);
    let ocsp_verified = await OCSPService.verifyCertValidityOnOCSP(cert_reader);
    if(ocsp_verified != "revoked"){
      let root_cert_gnr = GeneralMethods.decodeCert(root_cert_gnr_pem);
      console.log(root_cert_gnr);
      let root_cert_psp = GeneralMethods.decodeCert(root_cert_psp_pem);
      console.log(root_cert_psp);
      let trustedCertificates_GNR = [];
      let trustedCertificates_PSP = [];
      let certificates_to_verify = [];
      let crls = [];
    
      trustedCertificates_GNR.push(root_cert_gnr);
      certificates_to_verify.push(cert_reader);
      // create chain verification engine
      const promise_verify_GNR = new pkijs.CertificateChainValidationEngine({
          trustedCerts: trustedCertificates_GNR,
          certs: certificates_to_verify,
          crls
      }).verify().then(
          (result) => {console.log(result);return result.resultCode;},
          error => {console.log(error);return null;}
      );
      trustedCertificates_PSP.push(root_cert_psp);
      const promise_verify_PSP = new pkijs.CertificateChainValidationEngine({
          trustedCerts: trustedCertificates_PSP,
          certs: certificates_to_verify,
          crls
      }).verify().then(
          (result) => {console.log(result);return result.resultCode;},
          error => {console.log(error);return null;}
      );
      // verify chain
      return [promise_verify_GNR,promise_verify_PSP];
    }
    else {
      return null;
    }
  }


  /**
   * Obtenção do certificado root 
   * @param username do funcionario
   * @param password do funcionario
   */
  export async function getEntRootCertificate(username: string, password: string){
    var root_cert;
    const http = new HTTP();
    http.useBasicAuth(username, password);
    http.setDataSerializer('json');
    const data = await http.sendRequest(consts.root_cert_url,{method: 'get',responseType: 'json'});
    root_cert = data.data
    let ss = SecureStorage.instantiateSecureStorage();
    SecureStorage.set('root_cert',root_cert,ss);
  }
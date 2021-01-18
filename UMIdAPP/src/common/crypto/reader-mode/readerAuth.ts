import * as SecureStorage from '../../general/secureStorage.js';
import * as GeneralMethods from '../../general/reader-mode/general';
import * as COSE from 'cose-js';
import * as CBOR from '../../general/reader-mode/cbor.js';
import * as EC from 'elliptic';
import { HTTP } from '@ionic-native/http/ngx'
import * as crypto from 'crypto';

/**
 * criação da estrutura COSE_Sign1 a ser enviada para o Holder
 * @param ReaderAuthentication  
 */
export async function createSignature(ReaderAuthentication){
    const ss = SecureStorage.instantiateSecureStorage()
    const signature_promise = await Promise.all([SecureStorage.get('userCertificate', ss),SecureStorage.get('privateKey', ss)]).then(
        async ([reader_cert,key]) => {
            const priv_key_cert = JSON.parse(key)
            const certificateBinary = Buffer.from(reader_cert.replace(/(-----(BEGIN|END) CERTIFICATE-----|[\n\r])/g, ''),'base64');

            const headers = {
                'p': {'alg': 'ES384'}, // protected header
                'u': {'x5chain': Buffer.from(certificateBinary)}, //unprotected header -> Aqui vai o certificado a ser enviado para o holder (tem de estar sob a forma de ‘x5chain')
                                              // ver página 52 pdf (esta cadeia pode um ou mais certificados)
                'externalAAD': Buffer.from([0x00]) // externalAAD bytestring length 0
             };
             const signer = { 
                'key': {
                     'd': Buffer.from(priv_key_cert.d,'base64') // chave privada da IA
                }
             };
            const options = {
                'excludetag': true // Untagged Cose_Sign1 structure
            }
            const ReaderAuth = await COSE.sign.create(headers, null, signer,options);
            // adapt structure

            console.log('signed message: ', ReaderAuth);
            const readable_signature = CBOR.decode(Buffer.from(ReaderAuth).buffer)
            // substitute signature created by the lib with the one who contains the structure
            readable_signature[3] = createSignatureFromStructure(ReaderAuthentication,signer.key);
            const readerAuth = CBOR.encode(readable_signature)
            //console.log('verified signature', verifySignatureWithStructure(ReaderAuthentication,Buffer.from(readerAuth),reader_cert));
            return Buffer.from(readerAuth);
            
        });
    return signature_promise;
}

/**
 * criação da assinatura a ser incluida na estrutura COSE_Sign1
 * @param ReaderAuthStruct 
 * @param priv_key 
 */
function createSignatureFromStructure(ReaderAuthStruct,priv_key){
  const ec = new EC.ec('p384');
  const key = ec.keyFromPrivate(priv_key.d);

  const hash = crypto.createHash('sha384');
  hash.update(ReaderAuthStruct);
  const to_be_signed = hash.digest();
  const signature = key.sign(to_be_signed);
  const sig = Buffer.concat([signature.r.toArrayLike(Buffer), signature.s.toArrayLike(Buffer)]);
  return sig;
}

/**
 * Envio do CSR criado para o Backend e obtenção do certificado
 * @param csr 
 * @param user 
 */
export async function reqEntCertificate(csr, user) {
  const http = new HTTP();
  http.setServerTrustMode('default');
  http.setHeader('*', 'Access-Control-Allow-Origin', '*');
  http.setHeader(
    '*',
    'Access-Control-Allow-Methods',
    'POST, GET, OPTIONS, PUT'
  );
  http.setHeader('*', 'Accept', 'application/json');
  http.setHeader('*', 'content-type', 'application/json');

  http.setDataSerializer('json');
  const csr_data = window.btoa(csr); 
  return http.post('https://vhaslab04.inesctec.pt/V2/readerAuth',{'email': user.email,'password': user.password,'csr': csr_data},{}).then(
    (response) => {
      if(response.status == 200) {
        const base64_cert = JSON.parse(response.data);
        return base64_cert.certificate;
     }
    },
    error => {
      console.log(error);
      if(error.status == 401) return '-1'; // flag para credenciais inválidas
      if(error.status == 400) return '-2'; // entidade não corresponde à enviada para o backend
    }
  )
}

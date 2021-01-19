import * as GeneralMethods from '../../general/holder-mode/general';
import * as COSE from 'cose-js';
import * as CBOR from '../../general/holder-mode/cbor.js';
import * as pkijs from 'pkijs';
import * as EC from 'elliptic';
import * as crypto from 'crypto';
import * as SecureStorage from '../../general/secureStorage.js';

/**
 * criação da estrutura COSE_Sign1 a ser enviada para o Holder
 * @param ReaderAuthentication  
 */
export async function createSignature(DeviceAuthentication){
    const ss = SecureStorage.instantiateSecureStorage()
    const signature_promise = await Promise.all([SecureStorage.get('userCertificate', ss),SecureStorage.get('privateKey', ss)]).then(
        async ([reader_cert,key]) => {
            const priv_key_cert = JSON.parse(key)
            const certificateBinary = Buffer.from(reader_cert.replace(/(-----(BEGIN|END) CERTIFICATE-----|[\n\r])/g, ''),'base64');

            const headers = {
                'p': {'alg': 'ES256'}, // protected header
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
            const DeviceAuth = await COSE.sign.create(headers, null, signer,options);
            // adapt structure

            console.log('signed message: ', DeviceAuth);
            const readable_signature = CBOR.decode(Buffer.from(DeviceAuth).buffer)
            // substitute signature created by the lib with the one who contains the structure
            readable_signature[3] = createSignatureFromStructure(DeviceAuthentication,signer.key);
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
  const ec = new EC.ec('p256');
  const key = ec.keyFromPrivate(priv_key.d);

  const hash = crypto.createHash('sha256');
  hash.update(ReaderAuthStruct);
  const to_be_signed = hash.digest();
  const signature = key.sign(to_be_signed);
  const sig = Buffer.concat([signature.r.toArrayLike(Buffer), signature.s.toArrayLike(Buffer)]);
  return sig;
}
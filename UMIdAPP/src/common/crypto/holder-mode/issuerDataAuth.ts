import * as GeneralMethods from '../../general/holder-mode/general';
import * as CBOR from '../../general/holder-mode/cbor.js';
import * as COSE from 'cose-js';

/**
 * Metodo que faz a verificação das assinaturas de acordo com a chave publica que vem no DS certificate
 * usado para a autenticação da autoridade emissora
 * @param cert certificado com a chave publica
 * @param mso mensagem assinada (MSO object)
 */
export function verifySignature(cert, mso) {
  const verifier = {
    key: {
      x: Buffer.from(cert.subjectPublicKeyInfo.parsedKey.x),
      y: Buffer.from(cert.subjectPublicKeyInfo.parsedKey.y),
    },
  };
  const options1 = {
    defaultType: 18,
  };

  const mso_data = GeneralMethods.url_safe_base64_to_base64(mso);
  return COSE.sign.verify(Buffer.from(mso_data, 'base64'), verifier, options1);
}

/**
 * Metodo de obtenção do certificado que está inserido na Cose Signature
 * @param signature assinatura onde se encontra o certificado com a chave publica para se fazer a verificação
 */
export function get_DS_certificate(signature) {
  const signature_decoded = GeneralMethods.url_safe_base64_to_base64(signature);
  //console.log('signature_decoded: ', signature_decoded);
  const readable_signature = CBOR.decode(
    Buffer.from(signature_decoded, 'base64').buffer
  );
  //console.log('readable signature', readable_signature);
  const prefix = '-----BEGIN CERTIFICATE-----\n';
  const postfix = '-----END CERTIFICATE-----';
  const pemText =
    prefix +
    Buffer.from(readable_signature[1][33])
      .toString('base64')
      .match(/.{0,64}/g)
      .join('\n') +
    postfix;
  const cert = GeneralMethods.decodeCert(pemText);
  return cert;
}

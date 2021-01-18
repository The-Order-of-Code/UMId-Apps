import * as GeneralMethods from '../../general/reader-mode/general';
import * as CBOR from '../../general/reader-mode/cbor.js';
import * as COSE from 'cose-js';
import * as SecureStorage from '../../general/secureStorage.js';
import * as OCSPService from '../../ocsp/reader-mode/OCSP.js';
import * as pkijs from 'pkijs';
import { promises } from 'dns';

/**
 * Metodo que faz a verificação das assinaturas de acordo com a chave publica que vem no DS certificate
 * usado para a autenticação da autoridade emissora
 * @param cert certificado com a chave publica
 * @param mso mensagem assinada (MSO object) Já no formato byte array
 */
function verifySignature(cert, mso) {
  const verifier = {
    key: {
      x: Buffer.from(cert.subjectPublicKeyInfo.parsedKey.x),
      y: Buffer.from(cert.subjectPublicKeyInfo.parsedKey.y),
    },
  };
  const options1 = {
    defaultType: 18,
  };

  return COSE.sign.verify(Buffer.from(mso), verifier, options1);
}

/**
 * Metodo de obtenção do certificado que está inserido na Cose Signature
 * @param signature assinatura onde se encontra o certificado com a chave publica para se fazer a verificação
 */
export async function get_DS_certificate(signature) {
  console.log('signature', signature);
  const readable_signature = CBOR.decode(Buffer.from(signature).buffer);
  console.log('readable signature', readable_signature);
  const prefix = '-----BEGIN CERTIFICATE-----\n';
  const postfix = '-----END CERTIFICATE-----';

  const pemText =
    prefix +
    Buffer.from(readable_signature[1][33])
      .toString('base64')
      .match(/.{0,64}/g)
      .join('\n') +
    postfix;
  console.log('pem certificate', pemText);
  const cert = GeneralMethods.decodeCert(pemText);
  return cert;
}

/**
 * verifica se os elementos da ‘ValidityInfo’ structure estão validos
 * tendo em conta o current time stamp (alinea f dos issuer auth conditions, p. 41 ISO)
 * @param validityInfo estrutura proveniente da MSO 'ValidityInfo'
 */
function verifyValidityInfoAgainstCurrDate(validityInfo) {
  const curr_timestamp = Date.now();
  const signed = Date.parse(validityInfo.signed.replace(/ /g, 'T'));
  const validFrom = Date.parse(validityInfo.validFrom.replace(/ /g, 'T'));
  const validUntil = Date.parse(validityInfo.validUntil.replace(/ /g, 'T'));
  const expectedUpdate = Date.parse(
    validityInfo.expectedUpdate.replace(/ /g, 'T')
  );
  const dates = [curr_timestamp, signed, validFrom, validUntil, expectedUpdate];
  const sortedDates = dates.slice().sort((a, b) => b - a);
  // check if curr_timestamp is in the middle of sorted list
  if (sortedDates[2] == curr_timestamp) return true;
  else return false;
}

/**
 * Verifica se message digests calculados da mdl recebida são iguais aos message digests guardados na MSO.
 * (alinea c dos issuer auth conditions, p. 41 ISO)
 * @param verify MSO encoded em CBOR
 * @param mdl estrutura recebida
 */
export async function verifyDigests(verify, mdl) {
  let verifiedDigests = true;
  const digests = CBOR.decode(Buffer.from(verify).buffer).valueDigests
    .nameSpaces['org.iso.18013.5.1'];

  const algorithm = CBOR.decode(Buffer.from(verify).buffer).digestAlgorithm;

  const mdl_list = GeneralMethods.decode_issuerSignedItemsBytes(mdl);
  for (let i = 0; i < mdl.length && verifiedDigests; i++) {
    const data = Buffer.from(mdl[i], 'base64');
    const digest = await crypto.subtle.digest(algorithm, data);
    if (Buffer.from(digest).toString('hex') == digests[mdl_list[i].digestId]) {
      console.log('digests match!');
    } else {
      console.log('digests not match!');
      verifiedDigests = false;
    }
  }
  return verifiedDigests;
}

/**
 * Verificação da cadeia de certificados (root CA + DS cert) de acordo com a norma RFC 5280
 * @param cert_holder certificado presente na assinatura
 */
async function verifyCertificateChain(cert_holder) {
  // instantiate secure storage
  const ss = SecureStorage.instantiateSecureStorage();
  const ocsp_verified = await OCSPService.verifyCertValidityOnOCSP(cert_holder);
  console.log('ocsp:', ocsp_verified);
  if (ocsp_verified === 'good') {
    // load root certificate
    const verifyCertChain = SecureStorage.get('root_cert', ss)
      .then((data) => {
        const root_cert = GeneralMethods.decodeCert(data);
        const trustedCertificates = [];
        const certificates_to_verify = [];
        const crls = [];

        trustedCertificates.push(root_cert);
        certificates_to_verify.push(cert_holder);
        // create chain verification engine
        const certChainVerificationEngine = new pkijs.CertificateChainValidationEngine(
          {
            trustedCerts: trustedCertificates,
            certs: certificates_to_verify,
            crls,
          }
        );
        // verify chain

        return [certChainVerificationEngine.verify(), root_cert];
      })
      .catch((error) =>
        console.log('error loading certificate from store:', error)
      );

    const promiseVerifyCertChain = verifyCertChain.then(
      (result) => result,
      () => Promise.resolve(false)
    );
    return promiseVerifyCertChain;
  } else {
    return Promise.resolve(false);
  }
}

/**
 * Check extra steps needed for DS Certificate authentication
 * @param root_cert Root certificate
 * @param ds_cert DS certificate
 */
function checkExtraStepsDSCertificateAuth(root_cert, ds_cert) {
  let result;
  // get countryName from CA root certificate
  const cn_root_cert = root_cert.issuer.typesAndValues.find(
    (element) => element.type == '2.5.4.6'
  ).value.valueBlock.value;

  // get countryName from DS certificate
  const cn_ds_cert = ds_cert.issuer.typesAndValues.find(
    (element) => element.type == '2.5.4.6'
  ).value.valueBlock.value;

  // get extended key usage from DS certificate
  const ext_key_use_ds_cert = ds_cert.extensions
    .find((element) => element.extnID == '2.5.29.37')
    .parsedValue.keyPurposes.find((element) => element == '1.0.18013.5.1.2');

  // 1 - check if countryName CA certificate equals countryName DS certificate
  if (cn_root_cert == cn_ds_cert) {
    // 2 - check if the extended key usage in the DS certificate contains the identifier for use as a DS certificate
    if (ext_key_use_ds_cert != undefined) {
      // after this steps we can assume the certificate is authentic
      result = true;
    } else {
      console.log(
        'the extended key usage in the DS certificate does not contain the identifier for use as a DS certificate'
      );
      result = false;
    }
  } else {
    console.log('countryName CA certificate is diferent from DS certificate');
    result = false;
  }
  return result;
}

/**
 * Verifica os steps a) e b) necessários para a autenticação da Issuing Authority (p. 41 ISO)
 * @param IssuerAuth assinatura da Issuing Authority
 * @param ds_cert DS certificate
 */
export async function checkIssuerAuthConditionsAB(IssuerAuth, ds_cert) {
  // get CA root certificate and verify certificate chain
  const verifyCertChainList = await verifyCertificateChain(ds_cert);
  // result from verify certificate chain
  const verifyCertChain = await verifyCertChainList[0];
  // CA root certificate
  const root_cert = verifyCertChainList[1];
  //console.log('cert:', verifyCertChainList);
  if (verifyCertChain == false)
    console.log('error validating certificate chain');
  else if (verifyCertChain) {
    if (verifyCertChain.result) {
      console.log('certificate chain is valid');
      // verify extra parameters
      const verified_extra_parameters = checkExtraStepsDSCertificateAuth(
        root_cert,
        ds_cert
      );
      // now we can verify digital signature with public key provided in DS certificate
      if (verified_extra_parameters)
        return verifySignature(ds_cert, IssuerAuth);
      else return undefined;
    } else {
      console.log('certificate chain is invalid');
      return undefined;
    }
  } else return undefined;
}

/**
 * Verifica os steps d) e) e f) necessários para a autenticação da Issuing Authority (p. 41 ISO)
 * @param issuing_country
 * @param response_str resposta do holder
 * @param mso MSO
 * @param cn_ds_cert country name do DS certificate
 * @param ds_cert DS certificate
 */
export function checkIssuerAuthConditionsDEF(
  issuing_country,
  response_str,
  mso,
  cn_ds_cert,
  ds_cert
) {
  let verified;
  let data_expired = false;
  if (issuing_country == undefined) {
    console.log('issuing country is not received!');
    if (response_str.documents[0][mso.docType] != undefined) {
      console.log('DocType MSO matches Doctype from holder response!');
      if (verifyValidityInfoAgainstCurrDate(mso.validityInfo)) {
        console.log(
          'Validity Info elements are still valid for the current time stamp!'
        );
        if (Date.parse(ds_cert.notAfter.value) < Date.now())
          data_expired = true;
        verified = true;
      } else {
        console.log(
          'Validity Info elements are not valid for the current time stamp!'
        );
        verified = false;
        data_expired = true;
      }
    } else {
      console.log('DocType MSO not matches Doctype from holder response!');
      verified = false;
    }
  } else {
    if (
      issuing_country.elementValue != undefined &&
      issuing_country.elementValue == cn_ds_cert
    ) {
      console.log(
        'issuing country is received and matches country name from DS certificate!'
      );
      if (response_str.documents[0][mso.docType] != undefined) {
        console.log('DocType MSO matches Doctype from holder response!');
        if (verifyValidityInfoAgainstCurrDate(mso.validityInfo)) {
          console.log(
            'Validity Info elements are still valid for the current time stamp!'
          );
          verified = true;
          if (Date.parse(ds_cert.notAfter.value) < Date.now())
            data_expired = true;
        } else {
          console.log(
            'Validity Info elements are not valid for the current time stamp!'
          );
          verified = false;
          data_expired = true;
        }
      } else {
        console.log('DocType MSO not matches Doctype from holder response!');
        verified = false;
      }
    } else {
      if (issuing_country.elementValue != undefined) {
        console.log(
          'Issuing country from holder and country name from DS certificate not matching!'
        );
        verified = false;
      }
    }
  }
  return [verified, data_expired];
}

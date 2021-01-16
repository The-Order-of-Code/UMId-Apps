'use strict';
const crypto = require('crypto');
var pkijs = require('pkijs');
import * as asn1 from 'asn1js';
import * as GeneralMethods from '../general/holder-mode/general';

/** @type {*} Parametros para criar o CSR do user */
const csr_parameters = {
  'algorithm': 'ECC',
  'keysize': 'secp256r1',
  'country': 'PT',
  'state': 'Braga',
  'city': 'Braga',
  'organization': 'Uminho'
}

async function getAuthorityKeyIdentifier(){
  var url;
  // const http = new HTTP();
  // const data = await http.sendRequest(url,{method: 'get',responseType: 'arraybuffer'});
  // const root_cert_pem = Buffer.from(data.data).toString('base64').match(/.{0,64}/g).join('\n'); 
  // const root_cert = GeneralMethods.decodeCert(root_cert_pem)
  // console.log(root_cert);
  const root_cert_pem = '-----BEGIN CERTIFICATE-----\n' +
    'MIIB5jCCAYygAwIBAgIUHKhkFKcyMxIVhotaQAjj5TCROmUwCgYIKoZIzj0EAwIw\n' +
    'UTELMAkGA1UEBhMCUFQxDjAMBgNVBAgTBUJyYWdhMQ4wDAYDVQQHEwVCcmFnYTEP\n' +
    'MA0GA1UEChMGVW1pbmhvMREwDwYDVQQDEwh1bWluaG9DQTAeFw0yMTAxMTIxNjUx\n' +
    'MDBaFw0yNjAxMTExNjUxMDBaMFExCzAJBgNVBAYTAlBUMQ4wDAYDVQQIEwVCcmFn\n' +
    'YTEOMAwGA1UEBxMFQnJhZ2ExDzANBgNVBAoTBlVtaW5obzERMA8GA1UEAxMIdW1p\n' +
    'bmhvQ0EwWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAR9PqXuEKbgzMA9QPKFA85m\n' +
    'oANhtfyK8kX6PUuKdRLc2N7iFJoRzrr7HrYSOtVNYRzgYtFicAHNEIJr/uUtGptD\n' +
    'o0IwQDAOBgNVHQ8BAf8EBAMCAQYwDwYDVR0TAQH/BAUwAwEB/zAdBgNVHQ4EFgQU\n' +
    'xhEP4MNjKWSbaNEN2fmXZnhg5kowCgYIKoZIzj0EAwIDSAAwRQIgXaH37/IyhwLm\n' +
    'ngJElxNQZ6DQxWpBJSbKx44JiX4k8L0CIQDHwDNrtwZwUJaFoxQd01YHZSjh01h3\n' +
    'IPUuKV4gCY3YLw==\n' +
    '-----END CERTIFICATE-----';
  const root_cert = GeneralMethods.decodeCert(root_cert_pem)
  const authority_key_identifier = root_cert.extensions.find(extension => extension.extnID == '2.5.29.14').parsedValue;
  console.log('authority key identifier:', authority_key_identifier);
  return authority_key_identifier;
}


/**
 * Método gera a requisisção do certificado 
 *
 * @export
 * @param {*} keyPair par de chaves 
 * @param {*} user utilizador
 * @return {*} 
 */
export async function make_csr(keyPair, username) {
  
  var certf, crl_url, root_ca_url;
  // verify wich entity we are creating the CSR
  const ocsp_url = 'https://uminho.pt/ocsp/';
  root_ca_url = 'https://uminho.pt/certs/MobileID_IA_PT.pem'
  certf = csr_parameters;
  crl_url = 'http://uminho.pt/crls/UMID.pem'
  certf.commonName = username;
  
  // #region Prepare P10
  
  var sequence = Promise.resolve();

  var pkcs10_simpl = new pkijs.CertificationRequest();

  var privateKey;
  var publicKey;
  var hash_algorithm;
  hash_algorithm = 'sha-256';


  var signature_algorithm_name, keylength;
  switch (certf.algorithm) {
    case 'RSA': // tirar essa parte 
      signature_algorithm_name = 'RSASSA-PKCS1-V1_5';
      keylength = parseInt(certf.keysize);
      break;
    case 'ECC':
      signature_algorithm_name = 'ECDSA';
      switch (certf.keysize) {
        case 'secp256r1':
          keylength = 'P-256';
          break;
        case 'secp384r1':
          keylength = 'P-384';
          break;
        case 'secp521r1':
          keylength = 'P-521';
          break;
      }
      break;
    default:
  }
  // #endregion

  // #region Put a static values
  pkcs10_simpl.version = 0;

  if (certf.country)
    pkcs10_simpl.subject.typesAndValues.push(new pkijs.AttributeTypeAndValue({
      type: '2.5.4.6',
      value: new asn1.PrintableString({
        value: certf.country
      })
    }));

  if (certf.state)
    pkcs10_simpl.subject.typesAndValues.push(
      new pkijs.AttributeTypeAndValue({
        type: '2.5.4.8',
        value: new asn1.Utf8String({
          value: certf.state,
        }),
      })
    );

  if (certf.city)
    pkcs10_simpl.subject.typesAndValues.push(
      new pkijs.AttributeTypeAndValue({
        type: '2.5.4.7',
        value: new asn1.Utf8String({
          value: certf.city,
        }),
      })
    );

  if (certf.organizationalUnit)
    pkcs10_simpl.subject.typesAndValues.push(
      new pkijs.AttributeTypeAndValue({
        type: '2.5.4.11',
        value: new asn1.Utf8String({
          value: certf.organizationalUnit,
        }),
      })
    );

  if (certf.organization)
    pkcs10_simpl.subject.typesAndValues.push(
      new pkijs.AttributeTypeAndValue({
        type: '2.5.4.10',
        value: new asn1.Utf8String({
          value: certf.organization,
        }),
      })
    );

  pkcs10_simpl.subject.typesAndValues.push(
    new pkijs.AttributeTypeAndValue({
      type: '2.5.4.3',
      value: new asn1.Utf8String({
        value: certf.commonName,
      }),
    })
  );
  pkcs10_simpl.attributes = [];
  // #endregion


  // #region Store new key in an interim variables
  publicKey = keyPair.publicKey;
  privateKey = keyPair.privateKey;
  // #endregion 

  // #region Exporting public key into "subjectPublicKeyInfo" value of PKCS#10
  await pkcs10_simpl.subjectPublicKeyInfo.importKey(publicKey);
  // #endregion/
  
  // #region AuthorityKeyIdentifier
  const authority_key_id = await getAuthorityKeyIdentifier();
  // #endregion/

  // #region SubjectKeyIdentifier
  var digest = await window.crypto.subtle.digest(
        {name: 'SHA-1'},
        pkcs10_simpl.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHex
      );
  
  const basicConstr = new pkijs.BasicConstraints({
      cA: false
  });

  const bitArray = new ArrayBuffer(1);
  const bitView = new Uint8Array(bitArray);

  bitView[0] |= 0x0008; // Key usage "KeyAgreement" flag
  bitView[0] |= 0x0080; // Key usage "DigitalSignature" flag
  bitView[0] |= 0x0020; // Key usage "KeyEncipherment" flag

  const keyUsage = new asn1.BitString({ valueHex: bitArray });

  const extKeyUsage = new pkijs.ExtKeyUsage({
		keyPurposes: [     
			'1.3.6.1.5.5.7.3.2',   // id-kp-clientAuth
		]
  });
  
  const crl_dns = new pkijs.GeneralName({
    type: 2, // dNSName
    value: crl_url
  }); 
  
  const dist_point = new pkijs.DistributionPoint({
    distributionPoint: [
      crl_dns
    ]
  })

  const crl_dist_points = new pkijs.CRLDistributionPoints({
		distributionPoints: [
      dist_point
    ]
  });

  const authority_info_access = new pkijs.InfoAccess({
    accessDescriptions: [
      new pkijs.AccessDescription ({
        accessMethod: '1.3.6.1.5.5.7.48.1',
        accessLocation: new pkijs.GeneralName({
          type: 2, // dNSName
          value: ocsp_url
        })
      }),
      new pkijs.AccessDescription ({
        accessMethod:'1.3.6.1.5.5.7.48.2',
        accessLocation: new pkijs.GeneralName({
          type: 2, // dNSName
          value: root_ca_url
        })
      }),
    ]
  })  

  await pkcs10_simpl.attributes.push(
        new pkijs.Attribute({
          type: '1.2.840.113549.1.9.14', // pkcs-9-at-extensionRequest
          values: [(
            new pkijs.Extensions({
              extensions: [
                new pkijs.Extension({
                  extnID: '2.5.29.35',
                  critical: true,
                  extnValue: new pkijs.AuthorityKeyIdentifier({
                    keyIdentifier: authority_key_id
                  }).toSchema().toBER(false)
                }),
                new pkijs.Extension({
                  extnID: '2.5.29.14',
                  critical: true,
                  extnValue: new asn1.OctetString({
                    value_hex: digest,
                  }).toBER(false),
                  parsedValue: new asn1.OctetString({
                    value_hex: digest,
                  })
                }),
                new pkijs.Extension({
                  extnID: '2.5.29.19',
                  critical: true,
                  extnValue: basicConstr.toSchema().toBER(false),
                  parsedValue: basicConstr // Parsed value for well-known extensions
                  }),
                new pkijs.Extension({
                  extnID: '2.5.29.15',
                  critical: true,
                  extnValue: keyUsage.toBER(false),
                  parsedValue: keyUsage // Parsed value for well-known extensions
                }),
                new pkijs.Extension({
                  extnID: '2.5.29.37',
                  critical: true,
                  extnValue: extKeyUsage.toSchema().toBER(false),
                  parsedValue: extKeyUsage // Parsed value for well-known extensions
                }),
                new pkijs.Extension({
                  extnID: '2.5.29.31',
                  critical: true,
                  extnValue: crl_dist_points.toSchema().toBER(false),
                  parsedValue: crl_dist_points // Parsed value for well-known extensions
                }),
                new pkijs.Extension({
                  extnID: '1.3.6.1.5.5.7.1.1',
                  critical: true,
                  extnValue: authority_info_access.toSchema().toBER(false),
                  parsedValue: authority_info_access // Parsed value for well-known extensions
                }),
                
          ]})).toSchema()]
        })
      );
  // #endregion


  // #region Signing final PKCS#10 request
  await pkcs10_simpl.sign(privateKey, hash_algorithm);
  // #endregion

  const pkcs10Buffer = pkcs10_simpl.toSchema(true).toBER(false);

  var result_string = '-----BEGIN CERTIFICATE REQUEST-----\r\n';
  result_string =
    result_string +(Buffer.from(new Uint8Array(pkcs10Buffer)).toString('base64'));
  result_string =
    result_string + '\r\n-----END CERTIFICATE REQUEST-----\r\n';
  return result_string;
}


function importPrivateKey(private_key){
  return window.crypto.subtle.importKey(
    'jwk', //can be "jwk" (public or private), "raw" (public only), "spki" (public only), or "pkcs8" (private only)
    private_key,
    {
      //these are the algorithm options
      name: 'ECDSA',
      namedCurve: 'P-256', //can be "P-256", "P-384", or "P-521"
    },
    false, //whether the key is extractable (i.e. can be used in exportKey)
    ['sign'] //"deriveKey" and/or "deriveBits" for private keys only (just put an empty list if importing a public key)
  );
}

function importPublicKey(public_key){
  return window.crypto.subtle.importKey(
    'jwk', //can be "jwk" (public or private), "raw" (public only), "spki" (public only), or "pkcs8" (private only)
    public_key,
    {
      //these are the algorithm options
      name: 'ECDSA',
      namedCurve: 'P-256', //can be "P-256", "P-384", or "P-521"
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    [] //"deriveKey" and/or "deriveBits" for private keys only (just put an empty list if importing a public key)
  );
}




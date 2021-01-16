const CBOR = require('./cbor.js');
const GeneralMethods = require('./general.ts');
const COSE = require('cose-js');
const SecureStorage = require('./secureStorage.js');
const ReaderAuthMethods = require('../crypto/readerAuth.ts');
import { getAllFields, getOver18Fields, generateToken } from './jwt';

function jsonToStrMap(jsonStr) {
  return GeneralMethods.objToStrMap(JSON.parse(jsonStr));
}

function matchIndexWithIdentifier(ind) {
  var identifier;
  switch (ind + 1) {
    case 1:
      identifier = 'family_name';
      break;
    case 2:
      identifier = 'given_name';
      break;
    case 3:
      identifier = 'birth_date';
      break;
    case 4:
      identifier = 'issue_date';
      break;
    case 5:
      identifier = 'expiry_date';
      break;
    case 6:
      identifier = 'issuing_country';
      break;
    case 7:
      identifier = 'issuing_authority';
      break;
    case 8:
      identifier = 'document_number';
      break;
    case 9:
      identifier = 'administrative_number';
      break;
    case 10:
      identifier = 'driving_privileges';
      break;
    case 11:
      identifier = 'un_distinguishing_sign';
      break;
    case 12:
      identifier = 'gender';
      break;
    case 13:
      identifier = 'height';
      break;
    case 14:
      identifier = 'weight';
      break;
    case 15:
      identifier = 'eye_color';
      break;
    case 16:
      identifier = 'hair_color';
      break;
    case 17:
      identifier = 'birth_place';
      break;
    case 18:
      identifier = 'resident_address';
      break;
    case 19:
      identifier = 'portrait';
      break;
    case 20:
      identifier = 'portrait_capture_date';
      break;
    case 21:
      identifier = 'age_in_years';
      break;
    case 22:
      identifier = 'age_birth_year';
      break;
    case 23:
      identifier = 'age_over_18';
      break;
    case 24:
      identifier = 'issuing_jurisdiction';
      break;
    case 25:
      identifier = 'nationality';
      break;
    case 26:
      identifier = 'resident_city';
      break;
    case 27:
      identifier = 'resident_state';
      break;
    case 28:
      identifier = 'resident_postal_code';
      break;
    case 29:
      identifier = 'biometric_template_xx';
      break;
    case 30:
      identifier = 'name_national_character';
      break;
    case 31:
      identifier = 'signature_usual_mark';
      break;
    case 32:
      identifier = 'online_token_xxxx';
      break;
    case 33:
      identifier = 'online_url_xxxx';
      break;
    default:
      identifier = null;
      break;
  }
  return identifier;
}

/**
 *
 * transform mdl map into readable list to be used by createIssuerSignedItemsObj function
 */
function map_to_readable_list(mdl, request_accepted_flag, use_case, isOnlineRequest) {
  let mdl_map = jsonToStrMap(JSON.stringify(mdl));
  console.log('mdl map: ', mdl_map);
  var identifier,
    value,
    readable_list = [];
  if (use_case == 'carta de condução' && !isOnlineRequest) {
    for (var i = 0; i < 33; i++) {
      identifier = matchIndexWithIdentifier(i);
      console.log('identifier: ', identifier);

      if (request_accepted_flag == false) {
        value = mdl_map.get(identifier);
        if (value == undefined) readable_list.push('data not found');
        else readable_list.push('data request denied');
      } else {
        value = mdl_map.get(identifier);
        console.log(identifier);
        console.log(value);
        if (value == undefined) readable_list.push('data not found');
        else {
          if (identifier == 'online_token_xxxx') {
            readable_list.push(
              Buffer.from(value, 'base64')
            );
          } else
            readable_list.push(
              Buffer.from(
                GeneralMethods.url_safe_base64_to_base64(value),
                'base64'
              )
            );
        }
        console.log(readable_list);
      }
    }
  }
  if (use_case == 'prova de maioridade' && !isOnlineRequest) {
    if (request_accepted_flag == false) {
      readable_list = ['data request denied', 'data request denied'];
    } else {
      readable_list = [
        Buffer.from(
          GeneralMethods.url_safe_base64_to_base64(mdl_map.get('portrait')),
          'base64'
        ),
        Buffer.from(
          GeneralMethods.url_safe_base64_to_base64(mdl_map.get('age_over_18')),
          'base64'
        ),
      ];
    }
  }

  if(isOnlineRequest) {
    if (request_accepted_flag == false) {
      readable_list = ['data request denied'];
    } else {
      readable_list = [
        Buffer.from(
          mdl_map.get('online_token_xxxx'),
          'base64'
        ),
      ];
    }
  }
  return readable_list;
}

function createIssuerSignedItemsObj(mdl, request_accepted_flag, use_case, isOnlineRequest) {
  var i,
    j = 0,
    k = 0,
    errors = [],
    IssuerSignedItems = [];
  console.log(mdl);
  var indexes = [18, 22]; // para o caso da prova de maioridade
  var onlineIndex = [31];
  var mdl_parameter_values = map_to_readable_list(
    mdl,
    request_accepted_flag,
    use_case,
    isOnlineRequest
  );
  console.log(mdl_parameter_values);
  for (i = 0; i < mdl_parameter_values.length; i++) {
    var identifier;
    if(isOnlineRequest) {
      identifier = matchIndexWithIdentifier(onlineIndex[i]);
    }
    else {
      if (use_case == 'prova de maioridade') {
        identifier = matchIndexWithIdentifier(indexes[i]);
      } else {
        identifier = matchIndexWithIdentifier(i);
      }
    }
    var jsonVariable = {};
    if (mdl_parameter_values[i] == 'data not returned') {
      jsonVariable[identifier] = 0;
      errors[j++] = jsonVariable;
    } else {
      if (mdl_parameter_values[i] == 'data not found') {
        jsonVariable[identifier] = 2;
        errors[j++] = jsonVariable;
      } else {
        if (mdl_parameter_values[i] == 'data request denied') {
          jsonVariable[identifier] = 3;
          errors[j++] = jsonVariable;
        } else {
          // criar estrutura json
          IssuerSignedItems.push(mdl[identifier]);
        }
      }
    }
  }
  return [IssuerSignedItems, errors];
}

export async function createMDLResponse(
  ia_signature,
  mdl,
  status_code,
  request_accepted_flag,
  use_case,
  isOnlineRequest
) {
  if (isOnlineRequest && use_case == 'carta de condução') {
    let mdl_data = GeneralMethods.decodeIssuerSignedItems(JSON.parse(mdl));
    console.log('elementValue', mdl_data['document_number'].elementValue);
    const fields = getAllFields();
    const jwt = await generateToken(fields, mdl_data['document_number'].elementValue);
    console.log('jwt', jwt);
    ia_signature = null;
    mdl = JSON.stringify({
      online_token_xxxx: jwt,
    });
  }

  if (isOnlineRequest && use_case == 'prova de maioridade') {
    let mdl_data = GeneralMethods.decodeIssuerSignedItems(JSON.parse(mdl));
    console.log('elementValue', mdl_data['document_number'].elementValue);
    const fields = getOver18Fields();
    const jwt = await generateToken(fields, mdl_data['document_number'].elementValue);
    console.log('jwt', jwt);
    ia_signature = null;
    mdl = JSON.stringify({
      online_token_xxxx: jwt,
    });
  }

  console.log('mdl: ', mdl);
  console.log('request flag: ', request_accepted_flag);
  console.log('use case: ', use_case);
  let mdl_obj = JSON.parse(mdl);
  console.log('mdl object: ', JSON.parse(mdl));
  let IssuerSignedItems_errors = createIssuerSignedItemsObj(
    mdl_obj,
    request_accepted_flag,
    use_case,
    isOnlineRequest
  );
  console.log('IssuerSignedItems_errors: ', IssuerSignedItems_errors);
  let IssuerSignedItemsBytes = IssuerSignedItems_errors[0];
  console.log('IssuerSignedItems: ', IssuerSignedItemsBytes);
  let errors = IssuerSignedItems_errors[1];
  let Cose_Mac0 = [
    /*
      Headers,
      payload: null,
      tag: ""
      */
  ];
  // verificar melhor o device authentication (neste caso a ISO recomenda o uso da autenticação via MAC)
  let DeviceAuth = {
    deviceMac: Cose_Mac0,
  };
  let DeviceNameSpaces = {};
  let DeviceNameSpacesBytes = GeneralMethods.b2str(
    CBOR.encode(DeviceNameSpaces)
  );
  let DeviceSigned = {
    nameSpaces: DeviceNameSpacesBytes, //,
    //"deviceAuth" : DeviceAuth //Autenticação do Holder (ver melhor)
  };

  let IssuerNameSpaces = {
    'org.iso.18013.5.1': IssuerSignedItemsBytes,
  };

  let IssuerAuth;

  if (!isOnlineRequest) {
    IssuerAuth = Buffer.from(
      GeneralMethods.url_safe_base64_to_base64(ia_signature),
      'base64'
    );
  }

  let IssuerSigned = {
    nameSpaces: IssuerNameSpaces, // opcional
    issuerAuth: IssuerAuth, // Autenticação da Entidade Emissora (ver melhor)
  };

  console.log('IssuerNameSpaces: ', IssuerSigned);

  let Errors = {
    'org.iso.18013.5.1': errors,
  };
  var ResponseData;
  if (errors.length == 0) {
    ResponseData = {
      issuerSigned: IssuerSigned, // Responded data elements signed by the issuer
      deviceSigned: DeviceSigned, // Responded data elements signed by the mDL
    };
  } else {
    ResponseData = {
      issuerSigned: IssuerSigned, // Responded data elements signed by the issuer
      deviceSigned: DeviceSigned, // Responded data elements signed by the mDL
      errors: Errors, // errors
    };
  }
  let Documents = {
    'org.iso.18013.5.1.mDL': ResponseData,
  };
  let OfflineResponse = {
    version: '1.0',
    documents: [Documents],
    status: status_code,
  };
  console.log('OfflineResponse: ', OfflineResponse);
  return CBOR.encode(OfflineResponse);
}

export async function getRequestOption(
  device_engagement,
  EreaderKey,
  reader_request
) {
  console.log('reader private key: ', EreaderKey);
  var reader_auth = reader_request.docRequests[0].readerAuth;
  var entity = null;
  var verify;
  if (reader_auth != undefined) {
    let SessionTranscript = [
      Buffer.from(CBOR.encode(device_engagement)),
      Buffer.from(CBOR.encode(EreaderKey)),
    ];

    let ReaderAuthentication = [
      'ReaderAuthentication',
      SessionTranscript,
      Buffer.from(reader_request.docRequests[0].itemsRequest),
    ];

    verify = ReaderAuthMethods.verifySignature(
      ReaderAuthentication,
      reader_auth
    );
    if (verify) {
      let cert_chain_verify_promises = await ReaderAuthMethods.verifyEntCertificateChain(
        reader_auth
      );
      let isGNR = await cert_chain_verify_promises[0];
      let isPSP = await cert_chain_verify_promises[1];
      if (isPSP == 0) {
        entity = 'psp';
        console.log('agente da psp está a pedir os dados');
      } else {
        if (isGNR == 0) {
          entity = 'gnr';
          console.log('agente da gnr está a pedir os dados');
        }
      }
    }
  } else {
    entity = 'default';
    console.log('entidade comum está a pedir os dados');
  }
  console.log(entity);
  if (entity) {
    var decoded = CBOR.decode(
      Buffer.from(reader_request.docRequests[0].itemsRequest).buffer
    );
    var request = decoded.nameSpaces['org.iso.18013.5.1'];
    var isOnlineRequest = decoded.requestInfo['isOnlineRequest'];
    console.log('request from reader', request);
    var len = Object.keys(request).length;
    console.log(len);
    if (len == 2) {
      return {
        entity: entity,
        request: 1,
        isOnlineRequest: isOnlineRequest,
      };
    }
    if (len == 33) {
      return {
        entity: entity,
        request: 0,
        isOnlineRequest: isOnlineRequest,
      };
    }
  }
}

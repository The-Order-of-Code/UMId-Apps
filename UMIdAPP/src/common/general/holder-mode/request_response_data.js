const CBOR = require('./cbor.js');
const GeneralMethods = require('./general.ts');
const COSE = require('cose-js');
const SecureStorage = require('../secureStorage.js');
const ReaderAuthMethods = require('../../crypto/holder-mode/readerAuth.ts');
import { getAllFields, getOver18Fields, generateToken } from './jwt';

function jsonToStrMap(jsonStr) {
  return GeneralMethods.objToStrMap(JSON.parse(jsonStr));
}

/**
 *
 * transform mdl map into readable list to be used by createIssuerSignedItemsObj function
 */
function map_to_readable_list(
  data,
  request_accepted_flag,
  request_attributes,
  isOnlineRequest
) {
  let mdl_map = jsonToStrMap(JSON.stringify(data));
  console.log('map: ', mdl_map);
  console.log('typeof:', typeof request_attributes, request_attributes);
  let readable_map = {};

  if (request_accepted_flag) {
    if (isOnlineRequest) {
      readable_map['token'] = Buffer.from(
        mdl_map.get('token')
      );
      console.log('MAP:', readable_map);
    } else {
      console.log('typeof:', typeof request_attributes);
      request_attributes.forEach((attr) => {
        let value = mdl_map.get(attr);
        if (value == undefined) {
          readable_map[attr] = 'data not found';
        } else {
          if (attr == 'token') {
            readable_map[attr] = Buffer.from(value, 'base64');
          } else {
            readable_map[attr] = Buffer.from(
              GeneralMethods.url_safe_base64_to_base64(value),
              'base64'
            );
          }
        }
      });
    }
  } else {
    if (isOnlineRequest) {
      readable_map['token'] = 'data request denied';
    } else {
      request_attributes.forEach((attr) => {
        readable_map[attr] = 'data request denied';
      });
    }
  }

  console.log('readable map:', readable_map);
  return readable_map;
}

function createIssuerSignedItemsObj(
  mdl,
  request_accepted_flag,
  request_attributes,
  isOnlineRequest
) {
  let j = 0,
    errors = [],
    IssuerSignedItems = [];
  const mdl_parameter_map = map_to_readable_list(
    GeneralMethods.userBackendToUserResponse(mdl),
    request_accepted_flag,
    request_attributes,
    isOnlineRequest
  );

  console.log('PARAMETERS:', mdl_parameter_map);
  Object.entries(mdl_parameter_map).forEach(([key, value]) => {
    let error_item = {};
    console.log(mdl[key]);
    switch (value) {
      case 'data not returned':
        error_item[key] = 0;
        errors[j++] = error_item;
        break;
      case 'data not found':
        error_item[key] = 2;
        errors[j++] = error_item;
        break;
      case 'data request denied':
        error_item[key] = 3;
        errors[j++] = error_item;
        break;
      default:
        console.log('INTRODUZIR', key, mdl, mdl[key]);
        IssuerSignedItems.push(mdl[key]);
        break;
    }
  });
  // for (i = 0; i < mdl_parameter_values.length; i++) {
  //   var identifier;
  //   if (isOnlineRequest) {
  //     identifier = matchIndexWithIdentifier(onlineIndex[i]);
  //   } else {
  //     if (use_case == 'prova de maioridade') {
  //       identifier = matchIndexWithIdentifier(indexes[i]);
  //     } else {
  //       identifier = matchIndexWithIdentifier(i);
  //     }
  //   }

  //   // TODO - START NEW DAY HERE
  //   var jsonVariable = {};
  //   if (mdl_parameter_values[i] == 'data not returned') {
  //     jsonVariable[identifier] = 0;
  //     errors[j++] = jsonVariable;
  //   } else {
  //     if (mdl_parameter_values[i] == 'data not found') {
  //       jsonVariable[identifier] = 2;
  //       errors[j++] = jsonVariable;
  //     } else {
  //       if (mdl_parameter_values[i] == 'data request denied') {
  //         jsonVariable[identifier] = 3;
  //         errors[j++] = jsonVariable;
  //       } else {
  //         // criar estrutura json
  //         IssuerSignedItems.push(mdl[identifier]);
  //       }
  //     }
  //   }
  // }
  return [IssuerSignedItems, errors];
}

export async function createMDLResponse(
  ia_signature,
  data,
  status_code,
  request_accepted_flag,
  request_attributes,
  isOnlineRequest
) {
  let mdl;
  if (isOnlineRequest) {
    let obj_data = JSON.parse(data);
    var payload;
    if(request_attributes.length > 1){
      console.log('elementValue', obj_data.user.username);
      const username = obj_data.user.username;
      payload = {
        username: username,
        exp: Math.round(Date.now() / 1000) + 15 * 60,
        iat: Math.round(Date.now() / 1000),
        namespaces: request_attributes,
      };
    }
    else {
      payload = obj_data;
      payload['exp'] = Math.round(Date.now() / 1000) + 15 * 60;
      payload['iat'] = Math.round(Date.now() / 1000);
    }
    const jwt = await generateToken(payload);
    console.log('jwt', jwt);
    ia_signature = null;
    mdl = JSON.stringify({
      token: jwt,
    });
  }

  console.log('token: ', mdl);
  console.log('request flag: ', request_accepted_flag);
  let mdl_obj = JSON.parse(mdl);
  console.log('mdl object: ', JSON.parse(mdl));
  let [IssuerSignedItemsBytes, errors] = createIssuerSignedItemsObj(
    mdl_obj,
    request_accepted_flag,
    request_attributes,
    isOnlineRequest
  );
  console.log('IssuerSignedItems:', IssuerSignedItemsBytes);
  console.log('IssuerSignedItems errors:', errors);

  let Cose_Mac0 = [
    /*
      Headers,
      payload: null,
      tag: ""
      */
  ];
  // TODO : verificar melhor o device authentication (neste caso a ISO recomenda o uso da autenticação via MAC)
  let DeviceAuth = {
    deviceMac: Cose_Mac0,
  };
  let DeviceNameSpaces = {};
  let DeviceNameSpacesBytes = GeneralMethods.b2str(
    CBOR.encode(DeviceNameSpaces)
  );
  let DeviceSigned = {
    nameSpaces: DeviceNameSpacesBytes, //,
    //"deviceAuth" : DeviceAuth //Autenticação do Holder (TODO : ver melhor)
  };

  let IssuerNameSpaces = {
    'org.iso.18013.5.1.PT.UminhoID.card': IssuerSignedItemsBytes,
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
    issuerAuth: IssuerAuth, // Autenticação da Entidade Emissora (TODO : ver melhor)
  };

  console.log('IssuerNameSpaces: ', IssuerSigned);

  let Errors = {
    'org.iso.18013.5.1.PT.UminhoID.card': errors,
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
    'org.iso.18013.5.1.PT.UminhoID': ResponseData,
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
      let cert_chain_verified = await ReaderAuthMethods.verifyEntCertificateChain(
        reader_auth
      );

      if(cert_chain_verified.result) entity = 'employee'
      else console.log('not trusted')  
    }
  }
  if (entity) {
    var decoded = CBOR.decode(
      Buffer.from(reader_request.docRequests[0].itemsRequest).buffer
    );
    var request = decoded.nameSpaces['org.iso.18013.5.1.PT.UminhoID.card'];
    var isOnlineRequest = decoded.requestInfo['isOnlineRequest'];
    const request_flag = decoded.requestInfo['request_flag'];
    console.log('Request keys from reader:', Object(request));
    var len = Object.keys(request).length;
    return {
      entity: entity,
      request_attributes: request,
      request_flag, //: len > 2 ? 0 : 1,
      isOnlineRequest: isOnlineRequest,
    };
  }
}

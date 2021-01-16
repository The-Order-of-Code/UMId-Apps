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
 * transforma a estrutura proveniente do backend (formato map) num map chave-valor, reconhecido por este script
 * @param {*} user 
 */
function userFromBackendToKeyValueFormat(user){
  let finalDict = {};
  for (const [key, value] of Object.entries(user.user)) {
    const dictKey = 'user.' + key;
    console.log(dictkey, value);
  }
  for (const [key, value] of Object.entries(user.course)) {
    const dictKey = 'course.' + key;
    console.log(dictkey, value);
  }


} 

/**
 *
 * transform user map into readable list to be used by createIssuerSignedItemsObj function
 */
function map_to_readable_list(
  user,
  request_accepted_flag,
  request_attributes,
  isOnlineRequest
) {
  let user_map = jsonToStrMap(JSON.stringify(user));
  console.log('user map: ', user_map);
  console.log('typeof:', typeof request_attributes, request_attributes);
  let readable_map = {};

  if (request_accepted_flag) {
    if (isOnlineRequest) {
      readable_map['ticket'] = Buffer.from(
        user_map.get('online_token_xxxx'),
        'base64'
      );
      console.log('MAPA:', readable_map);
    } else {
      console.log('typeof:', typeof request_attributes);
      request_attributes.forEach((attr) => {
        let value = user_map.get(attr);
        if (value == undefined) {
          readable_map[attr] = 'data not found';
        } else {
          if (attr == 'online_token_xxxx') {
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
      readable_map['ticket'] = 'data request denied';
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
  user,
  request_accepted_flag,
  request_attributes,
  isOnlineRequest
) {
  let j = 0,
    errors = [],
    IssuerSignedItems = [];  

  const user_parameter_map = map_to_readable_list(
    user,
    request_accepted_flag,
    request_attributes,
    isOnlineRequest
  );

  console.log('PARAMETERS:', user_parameter_map);
  Object.entries(user_parameter_map).forEach(([key, value]) => {
    let error_item = {};

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
        console.log('INTRODUZIR', key, user, user[key]);
        IssuerSignedItems.push(user[key]);
        break;
    }
  });

  return [IssuerSignedItems, errors];
}

export async function createMDLResponse(
  ia_signature,
  user,
  status_code,
  request_accepted_flag,
  request_attributes,
  isOnlineRequest
) {
  if (isOnlineRequest) {
    let user_data = JSON.parse(user);
    const username = user_data['username'];
    let payload = {}
    if(request_attributes[0] == 'ticket') {
      payload = {
        username: username,
        exp: Math.round(Date.now() / 1000) + 15 * 60,
        iat: Math.round(Date.now() / 1000),
        type: user.type,
        date: user.date
      };
      if(user.debugdate) payload['debugdate'] = user.debugdate;
    }
    else {
      payload = {
        username: username,
        exp: Math.round(Date.now() / 1000) + 15 * 60,
        iat: Math.round(Date.now() / 1000),
        nameSpaces: request_attributes
      };
    }
    const jwt = await generateToken(payload);
    console.log('jwt', jwt);
    ia_signature = null;
    user = JSON.stringify({
      token: jwt,
    });
  }
  if(request_attributes[0] != 'ticket') {
    console.log('user: ', user);
    console.log('request flag: ', request_accepted_flag);
    let user_obj = JSON.parse(user);
    console.log('user object: ', JSON.parse(user));
    let [IssuerSignedItemsBytes, errors] = createIssuerSignedItemsObj(
      user_obj,
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
      issuerAuth: IssuerAuth, // Autenticação da Entidade Emissora (TODO : ver melhor)
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
    const request_flag = decoded.requestInfo['request_flag'];
    console.log('Request keys from reader:', Object(request));
    var len = Object.keys(request).length;
    console.log(len);
    return {
      entity: entity,
      request_attributes: request,
      request_flag, //: len > 2 ? 0 : 1,
      isOnlineRequest: isOnlineRequest,
    };
  }
}

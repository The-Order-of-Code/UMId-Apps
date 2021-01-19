

const CBOR = require('./cbor.js');
const GeneralMethods = require('./general.ts');
const IssuerDataAuthMethods = require('../../crypto/reader-mode/issuerDataAuth.ts');
const ReaderAuthMethods = require('../../crypto/reader-mode/readerAuth.ts');
const HolderAuthMethods = require('../../crypto/reader-mode/holderAuth.ts');

function contains_all_identifiers_needed(arr, arr2) {
  return arr.every((i) => arr2.includes(i));
}

/**
 * Método de criação do pedido do mDL-Reader ao mDL-Holder
 * @param {*} DeviceEngagement estrutura lida através do QR-code
 * @param {*} reader_private_key chave privada reader para assinatura da mensagem no ReaderAuth
 * @param {*} reader_cert certificado reader inserido na assinatura
 * @param {*} EreaderKey
 * @param {*} TODO caso de uso do pedido ('prova da maioridade' ou 'carta de condução')
 * @param {*} isOnlineRequest modo de ('prova da maioridade' ou 'carta de condução')
 */
export async function createReaderRequest(
  DeviceEngagement,
  EreaderKey,
  request_flag,
  request_attributes,
  entity,
  isOnlineRequest
) {
  /*
   * tratar da parte da autenticação (faltam os certificados)
   */

  let DeviceEngagementBytes = Buffer.from(CBOR.encode(DeviceEngagement));
  let EreaderKeyBytes = Buffer.from(CBOR.encode(EreaderKey));
  let SessionTranscript = [
    DeviceEngagementBytes, // DeviceEngagement structure formato cbor temos de mudar
    EreaderKeyBytes, // chave de sessão do reader
  ];

  let DocType = 'org.iso.18013.5.1.PT.UminhoID';

  const DataElements = request_attributes;
  // if (use_case == 'prova de maioridade') {
  //   DataElements = {
  //     portrait: false,
  //     age_over_18: false, // para já está tudo a false pq nao queremos guardar nada no reader
  //   };
  // }
  // if (use_case == 'carta de condução') {
  //   DataElements = {
  //     family_name: false,
  //     given_name: false,
  //     birth_date: false,
  //     issue_date: false,
  //     expiry_date: false,
  //     issuing_country: false,
  //     issuing_authority: false,
  //     document_number: false,
  //     administrative_number: false,
  //     driving_privileges: false,
  //     un_distinguishing_sign: false,
  //     gender: false,
  //     height: false,
  //     weight: false,
  //     eye_color: false,
  //     hair_color: false,
  //     birth_place: false,
  //     resident_address: false,
  //     portrait: false,
  //     portrait_capture_date: false,
  //     age_in_years: false,
  //     age_birth_year: false,
  //     age_over_18: false, // para já está tudo a false pq nao queremos guardar nada no reader
  //     issuing_jurisdiction: false,
  //     nationality: false,
  //     resident_city: false,
  //     resident_state: false,
  //     resident_postal_code: false,
  //     biometric_template_xx: false, // este xx temos de substituir por alguma coisa!!! secção 7.4.6 da ISO
  //     name_national_character: false,
  //     signature_usual_mark: false,
  //     online_token_xxxx: false, // este xxxx temos de substituir por alguma coisa!!! secção 7.4.8 da ISO
  //     online_url_xxxx: false, // este xxxx temos de substituir por alguma coisa!!! secção 7.4.8 da ISO
  //   };
  // }

  let NameSpaces = {
    'org.iso.18013.5.1.PT.UminhoID.card': DataElements, // para já temos só o que estão na ISO (podemos acrescentar mais namespaces)
    //  "org.iso.18013.5.1.PT" : { pt_id: false }
  };

  let ItemsRequest = {
    docType: DocType,
    nameSpaces: NameSpaces,
    requestInfo: {
      isOnlineRequest,
      request_flag,
    }, // como nao temos mais nada a adicionar ao pedido do reader para já deixamos assim
  };

  let ItemsRequestBytes = Buffer.from(CBOR.encode(ItemsRequest));

  let ReaderAuthentication = [
    'ReaderAuthentication',
    SessionTranscript,
    ItemsRequestBytes,
  ];

  /* *** COSE *** */
  var ReaderAuth = null;
  console.log(entity);
  if (entity != 'default') {
    let COSE_Sign1 = await ReaderAuthMethods.createSignature(
      ReaderAuthentication
    );
    ReaderAuth = COSE_Sign1;
  }

  var DocRequest;
  if (ReaderAuth != null) {
    DocRequest = {
      itemsRequest: ItemsRequestBytes,
      readerAuth: ReaderAuth, // Autenticação do Reader (ver melhor)
    };
  } else {
    DocRequest = {
      itemsRequest: ItemsRequestBytes,
    };
  }
  console.log('DocRequest:', DocRequest);

  let OfflineRequest = {
    version: '1.0',
    docRequests: [DocRequest],
  };
  return CBOR.encode(OfflineRequest);
}

/**
 * Tratamento da resposta do holder
 * @param {*} response_str resposta do holder
 */
export async function treatOnlineMDLResponse(response_str) {
  console.log(response_str);
  let jwt =
    response_str.documents[0]['org.iso.18013.5.1.PT.UminhoID']['issuerSigned'][
      'nameSpaces'
    ]['org.iso.18013.5.1.PT.UminhoID.card'][0];

  return jwt;
}

/**
 * Tratamento da resposta do holder
 * @param {*} response_str resposta do holder
 * @param {*} request_flag tipo de retorno (resposta à prova de maioridade, resposta à carta de condução)
 */
export async function treatMDLResponse(response_str, request_flag) {
  console.log(response_str);
  let response = response_str.documents[0]['org.iso.18013.5.1.PT.UminhoID'];

  // get DS certificate
  let ds_cert;
  let verifiedCertificateChain;
  let verifiedSignature, mso;
  let issuerSigned = response.issuerSigned.nameSpaces;
  if (response.issuerSigned.issuerAuth) {
    verifiedCertificateChain = await HolderAuthMethods.verifyEntCertificateChain(
      response.issuerSigned.issuerAuth
    );
    console.log('verifiedCertificateChain.result: ', verifiedCertificateChain.result)
    if(verifiedCertificateChain.result) {
      verifiedSignature = await HolderAuthMethods.verifySignature(
        issuerSigned['org.iso.18013.5.1.PT.UminhoID.card'][1],
        response.issuerSigned.issuerAuth
      );
      console.log('verifiedSignature: ', verifiedSignature)
    } 
  }
  var mdl;
  if (verifiedCertificateChain != undefined && verifiedSignature != undefined) {
    // if DS certificate and signature are valid
    console.log('DS certificate is authentic and signature is valid!');
    console.log(
      'verifiedCertificateChain: ',
      verifiedCertificateChain
    );
    //let erros = response.errors["org.iso.18013.5.1"];
    let issuerSignedItems = issuerSigned['org.iso.18013.5.1.PT.UminhoID.card'][0];
    let verifiedDigests = true
    await HolderAuthMethods.verifyDigests(
      issuerSigned['org.iso.18013.5.1.PT.UminhoID.card'][1],
      issuerSigned['org.iso.18013.5.1.PT.UminhoID.card'][0]);
    if (verifiedDigests) {
      mdl = createMDLStructureFromParsedData(
        issuerSignedItems,
        request_flag
      );
      console.log('mdl: ', mdl);
    } else {
      // if DS certificate or signature are not valid
      mdl = null;
      console.log('mdl: ', mdl);
    }
  } else {
    console.log('signature invalid! error: ');
    mdl = null;
    console.log('mdl: ', mdl);
  }

  return mdl;
}

/**
 * Cria estrutura a ser usada para apresentar na interface gráfica
 * @param {*} issuer_items_json
 * @param {*} request_flag
 */
export function createMDLStructureFromParsedData(
  issuer_items_encoded,
  request_flag
) {
  var mdl;
  let identifiers_needed = [];
  const issuer_items = GeneralMethods.jsonToStrMap(JSON.stringify(issuer_items_encoded));
  console.log(GeneralMethods.jsonToStrMap(JSON.stringify(issuer_items_encoded)))
  if (request_flag == '0') {
    // identificação
    // check if there's all the data requested
    let a;
    if(issuer_items.get("user.userType") == 'STUDENT'){
      identifiers_needed = [
        'user.userType',
        'user.username',
        'user.fullName',
        'user.birthdate',
        'user.picture',
        'course.designation',
        'course.teachingResearchUnits',
        'number',
        'academicYear', 
      ];
      a = contains_all_identifiers_needed(identifiers_needed, [
        ...issuer_items.keys(),
      ]);
      console.log(a, [...issuer_items.keys()], identifiers_needed);
    }
    else {
      identifiers_needed = [
        'user.userType',
        'user.username',
        'user.fullName',
        'user.birthdate',
        'user.picture',
      ];
      a = contains_all_identifiers_needed(identifiers_needed, [
        ...issuer_items.keys(),
      ]);
      console.log(a, [...issuer_items.keys()], identifiers_needed);
    }
    // get device signed items
    if (a) {
      mdl = JSON.stringify(GeneralMethods.userResponseToUserBackend(issuer_items_encoded));
    } else {
      // check errors on attributes
      // if it has more than the attributes requested mdl = -2
      if ([...issuer_items.keys()].length == 2) mdl = '-2';
      else mdl = '-1';
    }
  }
  return mdl;
}

import { Buffer } from 'buffer';
// const KeyParameters = {
//   'crv': -1,
//   'k': -1,
//   'x': -2,
//   'y': -3,
//   'd': -4,
//   'kty': 1
// };

// const KeyTypes = {
//   'OKP': 1,
//   'EC2': 2,
//   'RSA': 3,
//   'Symmetric': 4
// };

// const KeyCrv = {
//   'P-256': 1,
//   'P-384': 2,
//   'P-521': 3,
//   'X25519': 4,
//   'X448': 5,
//   'Ed25519': 6,
//   'Ed448': 7
// };

// const KeyTranslators = {
//   'kty': (value) => {
//     if (!(KeyTypes[value])) {
//       throw new Error('Unknown \'kty\' parameter, ' + value);
//     }
//     return KeyTypes[value];
//   },
//   'crv': (value) => {
//     if (!(KeyCrv[value])) {
//       throw new Error('Unknown \'crv\' parameter, ' + value);
//     }
//     return KeyCrv[value];
//   }
// };

// function TranslateKey (key) {
//   const result = new Map();
//   for (const param in key) {
//     if (!KeyParameters[param]) {
//       throw new Error('Unknown parameter, \'' + param + '\'');
//     }
//     let value = key[param];
//     if (KeyTranslators[param]) {
//       value = KeyTranslators[param](value);
//     }
//     result.set(KeyParameters[param], value);
//   }
//   return result;
// };

export class WebApi {
  public _version: any;
  public _url: any;
  public _token: any;

  constructor(version?, url?, token?) {
    if (arguments.length == 0) {
      (this._version = 1.0),
        (this._url = ''), //utf-8 str
        (this._token = ''); //utf-8 str
    } else {
      this._version = version;
      this._url = url;
      this._token = token;
    }
  }

  get version() {
    return this._version;
  }

  get url() {
    return this._url;
  }

  get token() {
    return this._token;
  }
}

export class Oidc {
  public _version: any;
  public _url: any;
  public _token: any;

  constructor(version, url, token) {
    if (arguments.length == 0) {
      (this._version = 1.0), // uint
        (this._url = ''), // utf-8 str
        (this._token = ''); //utf8-str
    } else {
      this._version = version;
      this._url = url;
      this._token = token;
    }
  }

  get version() {
    return this._version;
  }

  get url() {
    return this._url;
  }

  get token() {
    return this._token;
  }
}

export class NfcOptions {
  public _comdata: any;

  constructor(data) {
    if (arguments.length == 0) {
      this._comdata = 0; //uint - maximum length command data field
    } else {
      this._comdata = data;
    }
  }

  get comdata() {
    return this._comdata;
  }
}

export class BleOptions {
  public _perifMode: any;
  public _centralCliMode: any;
  public _pmuuid: any;
  public _cmuuid: any;
  public _uuid: any;

  constructor(perifMode, centralCliMode, pmuuid, cmuuid) {
    if (arguments.length == 0) {
      (this._perifMode = true), // bool
        (this._centralCliMode = true), //bool,
        (this._pmuuid = Buffer.from('cccccc', 'hex')), //uuind encoded as big-endian for Peripheral server mode
        (this._cmuuid = this._uuid = Buffer.from('cccccc', 'hex')); //uuind encoded as big-endian for Client central mode
    } else {
      (this._perifMode = perifMode),
        (this._centralCliMode = centralCliMode),
        (this._pmuuid = pmuuid),
        (this._cmuuid = cmuuid);
    }
  }

  get perifMode() {
    return this._perifMode;
  }
  get centralCliMode() {
    return this._centralCliMode;
  }
  get pmuuid() {
    return this._pmuuid;
  }
  get cmuuid() {
    return this._cmuuid;
  }
}

export class WifiOptions {
  public _password: any;
  public _chanOpeClass: any;
  public _chanNumber: any;

  constructor(password, chanOpeClass, chanNumber) {
    if (arguments.length == 0) {
      (this._password = ''),
        (this._chanOpeClass = 0), //uint
        (this._chanNumber = 0); //uint
    } else {
      (this._password = password),
        (this._chanOpeClass = chanOpeClass), //uint
        (this._chanNumber = chanNumber); //uint
    }
  }

  get password() {
    return this._password;
  }
  get chanOpeClass() {
    return this._chanOpeClass;
  }
  get chanNumber() {
    return this._chanNumber;
  }
}

//TransferOption = WifiOptions | BleOptions | NfcOptions | any

export class TransferMethods {
  public _type: any;
  public _version: any;
  public _TransferOption: any;

  constructor(type?, version?, toption?) {
    if (arguments.length == 1) {
      (this._type = 0), //uint default
        (this._version = 1.0), //uint default
        (this._TransferOption = toption);
    } else {
      (this._type = type), //uint default
        (this._version = version), //uint default
        (this._TransferOption = toption);
    }
  }

  get type() {
    return this._type;
  }
  get version() {
    return this._version;
  }
  get TransferOption() {
    return this._TransferOption;
  }
}

export class Security {
  public _uint: any;
  public _DeviceKeyBytes: any;

  constructor(cipherSuite?, DeviceKeyBytes?) {
    const plaintext = 'Important message!';
    const headers = {
      p: { alg: 'SHA-256_64' },
      u: { kid: 'our-secret' },
    };
    const recipent = {
      key: Buffer.from('231f4c4d4d3051fdc2ec0a3851d5b383', 'hex'),
    };

    if (arguments.length == 0) {
      this._uint = 'Cipher suite identifier';
      this._DeviceKeyBytes = {
        kty: 'Symmetric',
        k: '123456',
      };
    } else {
      this._uint = cipherSuite;
      this._DeviceKeyBytes = DeviceKeyBytes; //EDEVICEKEY = COSE_Key
    }
  }

  get uint() {
    return this._uint;
  }

  get DeviceKeyBytes() {
    return this._DeviceKeyBytes;
  }
}

export class SessionEstablishment {
  public _eReaderKey: any;
  public _data: any;

  constructor(eReaderkey?, data?) {
    if (arguments.length == 0) {
      this._eReaderKey = {
        kty: 'Symmetric',
        k: '123456',
      };
      this._data = '';
    } else {
      this._eReaderKey = eReaderkey;
      this._data = data;
    }
  }

  get eReaderKey() {
    return this._eReaderKey;
  }

  get data() {
    return this._data;
  }
}

export class SessionData {
  public _data: any;
  public _error: any;

  constructor(data?, error?) {
    if (arguments.length == 0) {
      this._data = '';
      this._error = '';
    } else {
      this._data = data;
      this._error = error;
    }
  }

  get data() {
    return this._data;
  }

  get error() {
    return this._error;
  }
}

export class DeviceEngagement {
  public _tstr: any;
  public _Security: any;
  public _TransferMethods: any;
  public _Options: any;
  public _DocTypes: any;
  public _AplicationSpecific: any;

  constructor(
    version,
    security,
    transferMethods,
    webApi,
    docTypes,
    aplicationSpecific
  ) {
    if (arguments.length == 0) {
      // 1st body
      (this._tstr = '1.0'), // version of the device engagement structure
        (this._Security = new Security()), // Security structure
        (this._TransferMethods = new TransferMethods()), // Transfer Methods
        (this._Options = new WebApi()), //Optional elements
        (this._DocTypes = []), // used to indicate supported DocTypes
        (this._AplicationSpecific = []); //array of strings, Application sepcific elements
    } else {
      (this._tstr = version),
        (this._Security = security),
        (this._TransferMethods = transferMethods),
        (this._Options = webApi),
        (this._DocTypes = docTypes),
        (this._AplicationSpecific = aplicationSpecific);
    }
  }

  get tstr() {
    return this._tstr;
  }
  get Security() {
    return this._Security;
  }
  get TransferMethods() {
    return this._TransferMethods;
  }
  get DocTypes() {
    return this._DocTypes;
  }
  get AplicationSpecific() {
    return this._AplicationSpecific;
  }
}

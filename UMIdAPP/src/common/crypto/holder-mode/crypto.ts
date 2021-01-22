import * as ComunicationCrypto from './communicationCrypto.js';
import * as General from '../../general/holder-mode/general';
import * as CBOR from '../../general/holder-mode/cbor.js';
import * as DeviceEngagement from '../../engagement/holder-mode/deviceEngagement'


/**
 * Inicializa as variaveis para inicio da sessão
 * @export generateSessionKeys
 */
export function initializeSecureSessionVariables() {
  const counterIntReader = 0;
  const identifierReader = new Uint8Array([
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
  ]);
  const counterReader = new Uint8Array(
    ComunicationCrypto.toBigEndian(counterIntReader)
  );
  const counterIntHolder = 0;
  const identifierHolder = new Uint8Array([
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x01,
  ]);
  const counterHolder = new Uint8Array(
    ComunicationCrypto.toBigEndian(counterIntHolder)
  );
  return {
    'counterIntReader': counterIntReader, 
    'identifierReader': identifierReader, 
    'counterReader': counterReader, 
    'counterIntHolder': counterIntHolder,
    'identifierHolder': identifierHolder, 
    'counterHolder': counterHolder
  };
}

/**
 *
 * função que gera as chaves de sessão
 * @export async generateSessionKeys
 * @param {CryptoKey} key // key from receiver
 * @param {CryptoKey} public_remote_key // public key from sender (already imported)
 * @returns [skReader, skHolder, additional_data]
 */
export async function generateSessionKeys(key, public_remote_key) {
  const saltReader = new Uint8Array([0x00]);
  const saltHolder = new Uint8Array([0x01]);
  const reader_keys = await ComunicationCrypto.derive_key(
    key.privateKey,
    public_remote_key,
    saltReader
  );
  const holder_keys = await ComunicationCrypto.derive_key(
    key.privateKey,
    public_remote_key,
    saltHolder
  );
  const skReader = await ComunicationCrypto.derive_key_aes(
    reader_keys[0],
    saltReader
  );
  const skHolder = await ComunicationCrypto.derive_key_aes(
    holder_keys[0],
    saltHolder
  );
  const additional_data = await ComunicationCrypto.hmac(reader_keys[1]);

  return [skReader, skHolder, additional_data];
}

/**
   *
   * gerar chaves de sessão e instanciar as variáveis
   * @memberof BleTransferPage
*/
export async function instantiateSessionKeys(reader_keypair, holder_public_key) {
  const imported_key = await ComunicationCrypto.import_key(holder_public_key);
  const sessionData  = await generateSessionKeys(reader_keypair, imported_key);
  holder_public_key = imported_key;
  return sessionData
}

/**
 *
 * função que desencripta a mensagem recebida
 * @export
 * @param {string} data // encripted data
 * @param {ArrayBuffer} additional_data // additional data generateSessionKeys function retrieves
 * @param {number} counter_int // counter from device who sent that encrypted data (holder or reader)
 * @param {Uint8Array} identifier // identifier from device who sent that encrypted data (holder or reader) used for iv
 * @param {CryptoKey} session_key // session key from device who sent that encrypted data (holder or reader)
 * @returns {string} msg // message decrypted
 */
export async function decrypt_msg(
  data,
  additional_data,
  counter_int,
  identifier,
  session_key
) {
  counter_int++;
  console.log('counter reader', counter_int);
  const counter = new Uint8Array(ComunicationCrypto.toBigEndian(counter_int));
  //data = General.str2ab(data);
  const iv = new Uint8Array(identifier.length + counter.length);
  iv.set(identifier);
  iv.set(counter, counter.length);

  const msg = await ComunicationCrypto.decrypt_msg(
    session_key,
    data,
    iv,
    additional_data
  );
  //const holder_response = new TextDecoder().decode(msg); // para a comunicação online
  const reader_request = CBOR.decode(msg); // para a comunicação offine
  console.log(reader_request);
  return reader_request;
}

/**
 *
 * função que encripta a mensagem a ser enviada
 * @export
 * @param {string} data // message to be encrypted
 * @param {ArrayBuffer} additional_data // additional data generateSessionKeys function retrieves
 * @param {number} counter_int // counter from device who will send that encrypted data (holder or reader)
 * @param {Uint8Array} identifier // identifier from device who will send that encrypted data (holder or reader)
 * @param {CryptoKey} session_key // session key from device who will send that encrypted data (holder or reader)
 * @returns {string} encrypted_msg // message encrypted
 */
export async function encrypt_msg(
  data,
  additional_data,
  counter_int,
  identifier,
  session_key
) {
  counter_int++;
  console.log('counter holder', counter_int);
  const counter = new Uint8Array(ComunicationCrypto.toBigEndian(counter_int));

  const iv = new Uint8Array(identifier.length + counter.length);
  iv.set(identifier);
  iv.set(counter, counter.length);

  //const encodeData = new TextEncoder().encode(data); // para a comunicação online
  const msg = await ComunicationCrypto.encrypt_msg(
    session_key,
    data,
    iv,
    additional_data
  );

  const sessionData = new DeviceEngagement.SessionData(General.b2str(msg), '0');
  //const string = JSON.stringify(sessionData); // para a comunicação online
  const string = CBOR.encode(sessionData); // para a comunicação offline
  //const encrypted_msg = General.b2str(msg); // para a comunicação online

  return string;
}

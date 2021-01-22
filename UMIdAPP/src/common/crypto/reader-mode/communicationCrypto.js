/**
 * Geração de chaves efemeras
 *
 * @export
 * @return {*} - par de chaves (publica + privada)
 */
export function generate_key() {
  return crypto.subtle.generateKey(
    {
      name: 'ECDH',
      namedCurve: 'P-384', //can be "P-256", "P-384", or "P-521"
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    ['deriveKey'] //can be any combination of "deriveKey" and "deriveBits"
  );
}

/**
 * Geração de chaves de assinatura (neste caso é usada para a assinatura do CSR a ser enviado ao backend) 
 * 
 * @export
 * @return {*} - par de chaves (publica + privada)
 */
export function generate_signing_key() {
  return crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256', //can be "P-256", "P-384", or "P-521"
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    ['sign','verify'] //can be any combination of "deriveKey" and "deriveBits"
  );
}

/**
 * Exportação da chave para o formato jwk
 * @param {*} key - chave a ser exportada
 */
export function export_key(key) {
  return crypto.subtle.exportKey(
    'jwk', //can be "jwk" (public or private), "raw" (public only), "spki" (public only), or "pkcs8" (private only)
    key //can be a publicKey or privateKey, as long as extractable was true
  );
}

/**
 * Importação da chave do formato jwk para uma CryptoKey (formato conhecido da Web Crypto API)
 * @param {*} key - chave a ser importada
 */
export function import_key(key) {
  return crypto.subtle.importKey(
    'jwk', //can be "jwk" (public or private), "raw" (public only), "spki" (public only), or "pkcs8" (private only)
    key,
    {
      //these are the algorithm options
      name: 'ECDH',
      namedCurve: 'P-384', //can be "P-256", "P-384", or "P-521"
    },
    false, //whether the key is extractable (i.e. can be used in exportKey)
    [] //"deriveKey" and/or "deriveBits" for private keys only (just put an empty list if importing a public key)
  );
}

/**
 * Importação da chave de assinatura do formato jwk para uma CryptoKey (formato conhecido da Web Crypto API)
 * @param {*} key - chave a ser importada
 */
export function import_signing_key(key) {
  return crypto.subtle.importKey(
    'jwk', //can be "jwk" (public or private), "raw" (public only), "spki" (public only), or "pkcs8" (private only)
    key,
    {
      //these are the algorithm options
      name: 'ECDSA',
      namedCurve: 'P-256', //can be "P-256", "P-384", or "P-521"
    },
    false, //whether the key is extractable (i.e. can be used in exportKey)
    [] //"deriveKey" and/or "deriveBits" for private keys only (just put an empty list if importing a public key)
  );
}

/**
 * Derivação da chave intermédia (HKDF) para AES-GCM (página 39 do documento, 45 do pdf)
 * @param {*} hkdf_key - chave intermédia
 * @param {*} salt - salto
 */
export function derive_key_aes(hkdf_key, salt) {
  return crypto.subtle.deriveKey(
    {
      name: 'HKDF',
      hash: 'SHA-256',
      salt: salt,
      info: new Uint8Array(['']),
      length: 256,
    },
    hkdf_key, //your ECDH private key from generateKey or importKey
    {
      //the key type you want to create based on the derived bits
      name: 'AES-GCM', //can be any AES algorithm ("AES-CTR", "AES-CBC", "AES-CMAC", "AES-GCM", "AES-CFB", "AES-KW", "ECDH", "DH", or "HMAC")
      //the generateKey parameters for that type of algorithm
      length: 256, //can be  128, 192, or 256
    },
    true, //whether the derived key is extractable (i.e. can be used in exportKey)
    ['encrypt', 'decrypt'] //limited to the options in that algorithm's importKey
  );
}

/**
 * Processo intermédio de geração das chaves efémeras para a conexão BLE
 * @param {*} privateKey - chave privada local
 * @param {*} publicKeyRemote - chave publica da entidade externa (do outro dispositivo)
 * @param {*} salt - salto
 */
export function derive_key(privateKey, publicKeyRemote, salt) {
  return Promise.all([
    crypto.subtle.deriveKey(
      // HKDF
      {
        name: 'ECDH',
        namedCurve: 'P-384', //can be "P-256", "P-384", or "P-521"
        public: publicKeyRemote, //an ECDH public key from generateKey or importKey
      },
      privateKey, //your ECDH private key from generateKey or importKey
      {
        //the key type you want to create based on the derived bits
        name: 'HKDF',
        hash: 'SHA-256',
        salt: salt,
        info: new Uint8Array(['']),
        length: 256,
      },
      false, //whether the derived key is extractable (i.e. can be used in exportKey)
      ['deriveKey'] //limited to the options in that algorithm's importKey
    ),
    crypto.subtle.deriveKey(
      // HMAC
      {
        name: 'ECDH',
        namedCurve: 'P-384', //can be "P-256", "P-384", or "P-521"
        public: publicKeyRemote, //an ECDH public key from generateKey or importKey
      },
      privateKey, //your ECDH private key from generateKey or importKey
      {
        //the key type you want to create based on the derived bits
        name: 'HMAC',
        hash: { name: 'SHA-256' }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        length: 256,
      },
      false, //whether the derived key is extractable (i.e. can be used in exportKey)
      ['sign', 'verify'] //limited to the options in that algorithm's importKey
    ),
  ]);
}

/**
 * Encriptação da mensagem a ser enviada para outra entidade
 * @param {*} shared_key - chave resultante da derivação  
 * @param {*} data - mensagem a ser encriptada e enviada
 * @param {*} iv - vetor inicial (conhecido por IV)
 * @param {*} additional_data - AAD
 */
export function encrypt_msg(shared_key, data, iv, additional_data) {
  return crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      //Don't re-use initialization vectors!
      //Always generate a new iv every time your encrypt!
      //Recommended to use 12 bytes length
      iv: iv,

      //Additional authentication data (optional)
      additionalData: additional_data,

      //Tag length (optional)
      //tagLength: 32, //can be 32, 64, 96, 104, 112, 120 or 128 (default)
    },
    shared_key, //from generateKey or importKey above
    data //ArrayBuffer of data you want to encrypt
  );
}

/**
 * Desencriptação da mensagem a ser enviada para outra entidade
 * @param {*} shared_key - chave resultante da derivação  
 * @param {*} data - mensagem recebida a ser desencriptada
 * @param {*} iv - vetor inicial (conhecido por IV)
 * @param {*} additional_data - AAD
 */
export function decrypt_msg(shared_key, data, iv, additional_data) {
  return crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv, //The initialization vector you used to encrypt
      additionalData: additional_data, //The addtionalData you used to encrypt (if any)
      //tagLength: 256, //The tagLength you used to encrypt (if any)
    },
    shared_key, //from generateKey or importKey above
    data //ArrayBuffer of the data
  );
}

/**
 * Autenticação da mensagem, para geração da AAD
 * @param {*} shared_key - chave resultante da derivação
 */
export function hmac(shared_key) {
  /**
   * A ISO na página 39 (45 do .pdf) refere que AAD é uma string vazia
   */
  const msg_to_encode = '';
  const data = new TextEncoder().encode(msg_to_encode);
  //console.log(data);
  return crypto.subtle.sign(
    {
      name: 'HMAC',
    },
    shared_key, //from generateKey or importKey above
    data //ArrayBuffer of data you want to sign
  );
}

/**
 * Conversão de base decimal para hexadecimal
 * @param {*} n - valor a ser convertido 
 */
export function dec2hex(n) {
  return n ? [n % 256].concat(dec2hex(~~(n / 256))) : [];
}

/**
 * Conversão do valor decimal para um valor representado por 4 bytes (formato big endian)
 * @param {*} n - valor a ser convertido 
 */
export function toBigEndian(n) {
  var hexar = dec2hex(n);
  return hexar
    .map((h) => (h < 16 ? '0x0' : '0x') + h.toString(16))
    .concat(Array(4 - hexar.length).fill('0x00'));
}

/**
 * Função de teste da encriptação e desencriptação da mensagem (via BLE)
 *
 * @export
 * @return {*} 
 */
export function test() {
  const msg_to_encode = 'Ola Holder!';
  /*
        definir o nonce identifier da ISO (isto aqui temos de definir conforme a
        entity seja um Holder ou um Reader):
        [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00] para o Reader
        [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01] para o Holder
    */
  var identifier = new Uint8Array([
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
    0x00,
  ]);

  /*
        Este counter vai ser incrementado conforme a troca das mensagens (ele já está em 4 byte big-endian)
        Exemplo:
        counter = 1   holder \
                            reader   counter = 1
                            /
        counter = 2   holder \
                            reader   counter = 2
        e continua assim...
        NOTA: o counter começa a 1!
    */
  var counter = new Uint8Array(toBigEndian(10000));

  /*
        como o nonce é formado por identifier|counter apenas temos de juntar as 2 variáveis
        e formar o initial vector, que é o nosso nonce
    */
  var iv = new Uint8Array(identifier.length + counter.length);
  iv.set(identifier);
  iv.set(counter, counter.length);

  // encoding da mensagem num Uint8Array
  const data = new TextEncoder().encode(msg_to_encode);
  console.log('mensagem inicial: ' + msg_to_encode);

  // salto definido na ISO ([0x00] para o Reader e [0x01] para o Holder)
  const salt = new Uint8Array([0x01]); // este está definido para o Holder

  generate_key().then((keyPair) => {
    console.log(keyPair);
    generate_key().then(async (keyRemote) => {
      console.log(keyRemote);
      derive_key(keyPair.privateKey, keyRemote.publicKey, salt).then(
        async ([hkdf_key, hmac_key]) => {
          console.log([hkdf_key, hmac_key]);
          Promise.all([derive_key_aes(hkdf_key, salt), hmac(hmac_key)]).then(
            async ([skHolder, additional_data]) => {
              console.log([skHolder, additional_data]);
              const cipher = await encrypt_msg(
                skHolder,
                data,
                iv,
                additional_data
              );
              console.log(cipher);
              decrypt_msg(skHolder, cipher, iv, additional_data).then((msg) => {
                const message = new TextDecoder().decode(msg);
                console.log('mensagem final: ' + message);
              });
            }
          );
        }
      );
    });
  });
}

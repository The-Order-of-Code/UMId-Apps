export function instantiateSecureStorage() {
    /** @type {*} 
     *  cria-se uma instância do secure storage do dispositivo 
    */
    var ss = new cordova.plugins.SecureStorage(
      function () {
        console.log('Success');
      },
      function (error) {
        console.log('Error ' + error);
      },
      'cardStudent'
    );
    return ss;
  }
  
  /**
   * Método responsável pela busca de 
   * informação armazenado no secure storage  do dispositivo
   *
   * @export
   * @param {*} key chave da informação
   * @param {*} ss  nome da instância do secure storage aonde foi guardada  a informação
   * @return {*} 
   */
  export async function get(key, ss) {
    return new Promise((resolve, reject) =>
      ss.get(
        function (value) {
          console.log('Success, got ' + key + ':', value);
          resolve(value);
        },
        function (error) {
          console.log('Error ' + error);
          reject(error);
        },
        key
      )
    );
  }
  
  /**
   * Método responsável por guardar informação no secure storage do dispositivo
   *
   * @export
   * @param {*} key chave da informação, para identificá-la
   * @param {*} value o valor é a propria informação só pode ser em string
   * @param {*} ss a nome da instância criada do secure storage
   * @return {*} 
   */
  export async function set(key, value, ss) {
    return ss.set(
      function (key) {
        console.log('Set ' + key);
        console.log('value ' + value);
        return key;
      },
      function (error) {
        console.log('Error ' + error);
        return error;
      },
      key,
      value
    );
  }
  
  /**
   * Método responsável pela exclusão da informação do secure storage
   *
   * @export
   * @param {*} key chave da informação a qual quer se deletar
   * @param {*} ss  nome da instáncia que a informação esta.
   * @return {*} 
   */
  export function remove(key, ss) {
    return new Promise((resolve, reject) =>
      ss.remove(
        function (value) {
          console.log('Success, removed ' + value);
          resolve(value);
        },
        function (error) {
          console.log('Error ' + error);
          reject(error);
        },
        key
      )
    );
  }
  
  /**
   * Método responsável por limpar uma instância do secure storage
   *
   * @export
   * @param {*} ss nome da instáncia que se quer limpar
   * @return {*} 
   */
  export function clear(ss) {
    return new Promise((resolve, reject) =>
      ss.clear(
        function () {
          console.log('Cleared');
          resolve(true);
        },
        function (error) {
          console.log('Error, ' + error);
          reject(error);
        }
      )
    );
  }
  
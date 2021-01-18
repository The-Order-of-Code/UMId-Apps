/**
 * funcionalidades de fragmentação, tratamento dos fragmentos recebidos
 *
 */

/**
 *
 * Fragmentação dos pacotes
 * @export splitData
 * @param {ArrayBuffer} arrayBuffer
 * @returns
 */
export function splitData(arrayBuffer: ArrayBuffer) {
  const packetSize = 146;
  const size = Math.floor(arrayBuffer.byteLength / packetSize);
  const array = [];
  let i;

  for (i = 0; i < size; i++) {
    const init = packetSize * i;
    const end = packetSize * (i + 1);

    var packet = arrayBuffer.slice(init, end);
    var unit = new Uint8Array(1);
    unit.set([1]);
    var arrbuffer = appendBuffer(unit.buffer, packet);

    array.push(arrbuffer);
  }

  var unit = new Uint8Array(1);
  unit.set([0]);
  var packet = arrayBuffer.slice(size * packetSize, arrayBuffer.byteLength);
  var arrbuffer = appendBuffer(unit.buffer, packet);

  array.push(arrbuffer);

  return array;
}

/**
 *
 * Construção dos pacotes (append de cada pacote do buffer 1 no buffer 2)
 * @export
 * @param {*} buffer1
 * @param {*} buffer2
 * @returns
 */
export function appendBuffer(buffer1, buffer2) {
  const tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
}

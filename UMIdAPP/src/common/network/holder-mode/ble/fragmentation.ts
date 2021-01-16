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
  let array = [];
  let i, packet, unit, arrbuffer;

  for (i = 0; i < size; i++) {
    const init = packetSize * i;
    const end = packetSize * (i + 1);

    packet = arrayBuffer.slice(init, end);
    unit = new Uint8Array(1);
    unit.set([0]);
    arrbuffer = appendBuffer(unit.buffer, packet);

    array.push(arrbuffer);
  }

  unit = new Uint8Array(1);
  unit.set([1]);
  packet = arrayBuffer.slice(size * packetSize, arrayBuffer.byteLength);
  arrbuffer = appendBuffer(unit.buffer, packet);

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
  let tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
}

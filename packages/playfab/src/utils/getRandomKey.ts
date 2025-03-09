const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('');

export default function getRandomKey(size = 100) {
  const data = new Uint8Array(4 * size);
  window.crypto.getRandomValues(data);
  const result = [];
  for (let i = 0; i < size; i++) {
    // @ts-expect-error - data[i * 4] is always a number
    result.push(chars[data[i * 4] % chars.length]);
  }
  return result.join('');
}

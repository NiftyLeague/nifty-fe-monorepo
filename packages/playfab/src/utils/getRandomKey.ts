const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'.split('')

export function getRandomKey(size = 100) {
  const data = new Uint8Array(4 * size)
  // Resolved off globalThis because this also runs server-side (signup builds
  // its Username here), where `window` does not exist.
  globalThis.crypto.getRandomValues(data)
  const result = []
  for (let i = 0; i < size; i++) {
    result.push(chars[data[i * 4]! % chars.length])
  }
  return result.join('')
}

export default getRandomKey

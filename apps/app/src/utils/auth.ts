import type { UUID_Token, Nonce } from '@/types/auth'

const secureRandomValues = (bytes: Uint8Array): Uint8Array => {
  if (typeof globalThis.crypto?.getRandomValues !== 'function') {
    throw new Error('Secure browser randomness is unavailable')
  }

  return globalThis.crypto.getRandomValues(bytes)
}

const createUUIDSegment = (): string => {
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID()
  }

  const bytes = secureRandomValues(new Uint8Array(16))
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

/** Preserves the legacy eight-segment token format expected by wallet verification. */
export const createUUID = (): UUID_Token =>
  Array.from({ length: 8 }, createUUIDSegment).join('-') as UUID_Token

export const createNonce = (): Nonce => {
  const bytes = secureRandomValues(new Uint8Array(4))
  return `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`
}

type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider
    web3?: Eip1193Provider
  }
}

function generateMessage(address: string, nonce: string) {
  const addressToLower = address.toLowerCase()
  const signAddress = `${addressToLower.substring(0, 6)}...${addressToLower.substring(addressToLower.length - 4)}`
  return `Please sign this message to verify that ${signAddress} belongs to you. ${nonce}`
}

const encodeMessage = (message: string) => {
  const bytes = new TextEncoder().encode(message)
  return `0x${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`
}

export async function signMessage() {
  const provider = window.ethereum
  if (!provider) throw new Error('No Ethereum provider found')

  const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as unknown
  const address = Array.isArray(accounts) && typeof accounts[0] === 'string' ? accounts[0] : null
  if (!address) return null

  const nonceBytes = new Uint8Array(4)
  window.crypto.getRandomValues(nonceBytes)
  const nonce = `0x${Array.from(nonceBytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`
  const message = generateMessage(address, nonce)
  const signature = await provider.request({
    method: 'personal_sign',
    params: [encodeMessage(message), address],
  })

  return { address, message, nonce, signature: String(signature) }
}

export async function isEthereumSignatureValid(
  address: string,
  signature: string,
  nonce: string
): Promise<boolean> {
  if (!address || !signature || !nonce) return false
  // NOTE: Actual Ethereum signature validation is not yet implemented.
  // The current behavior always returns true for non-empty inputs.
  return true
}

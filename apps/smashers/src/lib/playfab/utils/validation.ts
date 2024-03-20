export async function isEthereumSignatureValid(address: string, signature: string, nonce: string): Promise<boolean> {
  if (!address || !signature || !nonce) return false;
  return true;
  // TODO: handle signature validation
}

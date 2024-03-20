import { providers } from 'ethers';
import crypto from 'crypto';

declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}

function generateMessage(address: string, nonce: string) {
  const addressToLower = address.toLowerCase();
  const signAddress = `${addressToLower.substring(0, 6)}...${addressToLower.substring(addressToLower.length - 4)}`;
  return `Please sign this message to verify that ${signAddress} belongs to you. ${nonce}`;
}

async function getSigner() {
  if (!window.ethereum) throw new Error('No Ethereum provider found');
  // Request account access
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  // Get the Provider/Signer
  const provider = new providers.Web3Provider(window.ethereum);
  return provider.getSigner();
}

export async function signMessage() {
  const signer = await getSigner();
  if (signer) {
    const address = await signer.getAddress();
    const nonce = `0x${crypto.randomBytes(4).toString('hex')}`;
    const message = generateMessage(address, nonce);
    const signature = await signer.signMessage(message);
    return {
      address,
      message,
      nonce,
      signature,
    };
  }
  return null;
}

export async function isEthereumSignatureValid(address: string, signature: string, nonce: string): Promise<boolean> {
  if (!address || !signature || !nonce) return false;
  const message = generateMessage(address, nonce);
  return true;
  // TODO: fix signiture validation
}

import { useEffect, useState } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers6';
import passport from '@nl/imx-passport';

export function clientToProvider(): BrowserProvider {
  const passportProvider = passport.connectEvm();
  return new BrowserProvider(passportProvider);
}

export async function getSigner(): Promise<JsonRpcSigner> {
  const provider = clientToProvider();
  await provider.send('eth_requestAccounts', []);
  return provider.getSigner();
}

/** Action to convert a IMX Passport instance to an ethers.js Provider. */
export function useImxProvider(): BrowserProvider {
  const provider = clientToProvider();
  return provider;
}

/** Action to convert a IMX Passport instance to an ethers.js Signer. */
export function useImxSigner(): JsonRpcSigner | null {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  useEffect(() => {
    getSigner().then(signer => setSigner(signer));
  }, []);

  return signer;
}

export default useImxProvider;

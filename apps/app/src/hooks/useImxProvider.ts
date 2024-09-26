import { useEffect, useMemo, useState } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers6';
import { type Chain, immutableZkEvm, immutableZkEvmTestnet } from 'viem/chains';
import passport, { passportEnv } from '@nl/imx-passport';
import { config } from '@nl/imx-passport/types';

function clientToProvider(): BrowserProvider {
  const passportProvider = passport.connectEvm();
  return new BrowserProvider(passportProvider);
}

async function getSigner(): Promise<JsonRpcSigner> {
  const provider = clientToProvider();
  await provider.send('eth_requestAccounts', []);
  return provider.getSigner();
}

export function getNetwork(): Chain {
  return passportEnv === config.Environment.PRODUCTION ? immutableZkEvm : immutableZkEvmTestnet;
}

/** Action to convert a IMX Passport instance to an ethers.js Provider. */
export function useImxProvider(): BrowserProvider {
  return useMemo(clientToProvider, []);
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

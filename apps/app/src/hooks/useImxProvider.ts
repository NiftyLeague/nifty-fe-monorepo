import { useEffect, useState } from 'react';
import { BrowserProvider, JsonRpcSigner } from 'ethers6';
import { type Chain, immutableZkEvm, immutableZkEvmTestnet } from 'viem/chains';
import { useAccount } from 'wagmi';

import useEthersSigner, { type Signer } from '@/hooks/useEthersSigner';
import passport, { passportEnv } from '@nl/imx-passport';
import { config } from '@nl/imx-passport/types';

async function clientToProvider(): Promise<BrowserProvider> {
  const passportProvider = await passport.connectEvm();
  return new BrowserProvider(passportProvider);
}

async function getPassportSigner(): Promise<JsonRpcSigner> {
  const provider = await clientToProvider();
  await provider.send('eth_requestAccounts', []);
  return provider.getSigner();
}

export function getNetwork(): Chain {
  return passportEnv === config.Environment.PRODUCTION ? immutableZkEvm : immutableZkEvmTestnet;
}

export function useConnectedToIMXCheck(): boolean {
  const { chain } = useAccount();
  return chain?.id === immutableZkEvm.id || chain?.id === immutableZkEvmTestnet.id;
}

/** Memoized action to convert an IMX Passport instance to an ethers.js Provider. */
export function useImxProvider(): BrowserProvider | undefined {
  const [provider, setProvider] = useState<BrowserProvider>();

  useEffect(() => {
    clientToProvider().then(setProvider).catch(console.error);
  }, []);

  return provider;
}

/** Memoized action to convert a viem Wallet Client to an ethers.js Signer connected to IMX */
export function useImxSigner(): Signer {
  const passportNetwork = getNetwork();
  const imxChainId = passportNetwork.id;
  const signer = useEthersSigner({ chainId: imxChainId });
  return signer;
}

/** ========== Launches Passport sign-in popup to authenticate user =========== */
/** Memoized action to convert an IMX Passport instance to an ethers.js Signer. */
export function usePassportSigner(): JsonRpcSigner | null {
  const [signer, setSigner] = useState<JsonRpcSigner | null>(null);

  useEffect(() => {
    let mounted = true;
    getPassportSigner()
      .then(signer => {
        if (mounted) setSigner(signer); // Avoid updating state if the component is unmounted
      })
      .catch(error => {
        console.error('Failed to get IMX Signer:', error);
        setSigner(null); // Ensure the state reflects a failed signer fetch
      });

    return () => {
      mounted = false; // Cleanup function to handle component unmounting
    };
  }, []);

  return signer;
}

export default useImxProvider;

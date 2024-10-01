'use client';

import { type PropsWithChildren, createContext, useEffect } from 'react';
import { immutableZkEvm, immutableZkEvmTestnet } from 'viem/chains';
import isEmpty from 'lodash/isEmpty';

import type { BrowserProvider } from 'ethers6';
import type { Contracts } from '@/types/web3';
import { DEBUG } from '@/constants/index';

import useContractLoader from '@/hooks/useContractLoader';
import useImxProvider, { getNetwork, useImxSigner } from '@/hooks/useImxProvider';
import type { Signer } from '@/hooks/useEthersSigner';

export interface Context {
  address?: `0x${string}`;
  imxChainId: number;
  imxContracts: Contracts;
  imxSigner?: Signer;
  passportProvider?: BrowserProvider;
}

const CONTEXT_INITIAL_STATE: Context = {
  address: undefined,
  imxChainId: process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? immutableZkEvm.id : immutableZkEvmTestnet.id,
  imxContracts: {} as Contracts,
  imxSigner: undefined,
  passportProvider: undefined,
};

const IMXContext = createContext(CONTEXT_INITIAL_STATE);

export const IMXProvider = ({ children }: PropsWithChildren): JSX.Element => {
  // IMX Passport instance converted to an ethers.js Provider
  const passportProvider = useImxProvider();
  const passportNetwork = getNetwork();
  const imxChainId = passportNetwork.id;

  // Ethers.js Signer connected to Immutable zkEVM
  const imxSigner = useImxSigner();
  const address = imxSigner?.address as `0x${string}` | undefined;

  // Load Immutable zkEVM contracts with Read access
  const imxContracts = useContractLoader(passportProvider, { chainId: imxChainId });

  useEffect(() => {
    if (DEBUG && passportProvider && passportNetwork && imxSigner && address && !isEmpty(imxContracts)) {
      console.group('_________________ ✅ Nifty League: IMX _________________');
      console.log('🛫 passportProvider', passportProvider);
      console.log('📡 passportNetwork', passportNetwork);
      console.log('📝 imxSigner', imxSigner);
      console.log('👤 address:', address);
      console.log('✖️ imxContracts', imxContracts);
      console.groupEnd();
    } else if (DEBUG && passportProvider && passportNetwork && !isEmpty(imxContracts)) {
      console.group('_________________ 🚫 Offline User: IMX _________________');
      console.log('🛫 passportProvider', passportProvider);
      console.log('📡 passportNetwork', passportNetwork);
      console.log('✖️ imxContracts', imxContracts);
      console.groupEnd();
    }
  }, [address, imxContracts, imxSigner, passportNetwork, passportProvider]);

  return (
    <IMXContext.Provider
      value={{
        address,
        imxChainId,
        imxContracts,
        imxSigner,
        passportProvider,
      }}
    >
      {children}
    </IMXContext.Provider>
  );
};

export default IMXContext;

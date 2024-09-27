'use client';

import { type PropsWithChildren, createContext, useEffect } from 'react';
import { immutableZkEvm, immutableZkEvmTestnet } from 'viem/chains';
import isEmpty from 'lodash/isEmpty';

import type { BrowserProvider } from 'ethers6';
import type { Contracts } from '@/types/web3';
import type { Comic, Item } from '@/types/marketplace';
import { DEBUG } from '@/constants/index';

import useContractLoader from '@/hooks/useContractLoader';
import useComicsBalance from '@/hooks/useComicsBalance';
import useItemsBalance from '@/hooks/useItemsBalance';
import useImxProvider, { getNetwork, useImxSigner } from '@/hooks/useImxProvider';
import type { Signer } from '@/hooks/useEthersSigner';

export interface Context {
  address?: `0x${string}`;
  comicsBalance: Comic[];
  comicsLoading: boolean;
  imxChainId: number;
  imxContracts: Contracts;
  imxSigner?: Signer;
  itemsBalance: Item[];
  itemsLoading: boolean;
  passportProvider?: BrowserProvider;
}

const CONTEXT_INITIAL_STATE: Context = {
  address: undefined,
  comicsBalance: [],
  comicsLoading: true,
  imxChainId: process.env.VERCEL_ENV === 'production' ? immutableZkEvm.id : immutableZkEvmTestnet.id,
  imxContracts: {} as Contracts,
  imxSigner: undefined,
  itemsBalance: [],
  itemsLoading: true,
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

  // Load user NFT balances
  const { comicsBalance, loading: comicsLoading } = useComicsBalance(imxContracts, address);
  const { itemsBalance, loading: itemsLoading } = useItemsBalance(imxContracts, address);

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
        comicsBalance,
        comicsLoading,
        imxChainId,
        imxContracts,
        imxSigner,
        itemsBalance,
        itemsLoading,
        passportProvider,
      }}
    >
      {children}
    </IMXContext.Provider>
  );
};

export default IMXContext;

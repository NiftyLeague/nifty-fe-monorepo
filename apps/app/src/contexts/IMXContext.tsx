'use client';

import { type PropsWithChildren, createContext, useEffect } from 'react';
import isEmpty from 'lodash/isEmpty';

import type { BrowserProvider } from 'ethers6';
import type { Contracts } from '@/types/web3';
import type { Comic, Item } from '@/types/marketplace';
import { DEBUG } from '@/constants/index';

import useNetworkContext from '@/hooks/useNetworkContext';
import useContractLoader from '@/hooks/useContractLoader';
import useComicsBalance from '@/hooks/useComicsBalance';
import useItemsBalance from '@/hooks/useItemsBalance';
import useImxProvider, { getNetwork } from '@/hooks/useImxProvider';

export interface Context {
  address?: `0x${string}`;
  comicsBalance: Comic[];
  comicsLoading: boolean;
  imxContracts: Contracts;
  itemsBalance: Item[];
  itemsLoading: boolean;
  passportProvider?: BrowserProvider;
}

const CONTEXT_INITIAL_STATE: Context = {
  address: undefined,
  comicsBalance: [],
  comicsLoading: true,
  imxContracts: {} as Contracts,
  itemsBalance: [],
  itemsLoading: true,
  passportProvider: undefined,
};

const IMXContext = createContext(CONTEXT_INITIAL_STATE);

export const IMXProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const { address, selectedNetworkId } = useNetworkContext();

  // IMX Passport instance converted to an ethers.js Provider
  const passportProvider = useImxProvider();
  const passportNetwork = getNetwork();

  // Load Immutable zkEVM contracts
  const imxChainId = passportNetwork.id;
  const imxContracts = useContractLoader(passportProvider, { chainId: imxChainId });

  // Load user NFT balances
  const { comicsBalance, loading: comicsLoading } = useComicsBalance(imxContracts, address);
  const { itemsBalance, loading: itemsLoading } = useItemsBalance(imxContracts, address);

  useEffect(() => {
    if (DEBUG && address && passportProvider && selectedNetworkId && !isEmpty(imxContracts)) {
      console.group('_________________ ✅ Nifty League: IMX _________________');
      console.log('🛫 passportProvider', passportProvider);
      console.log('👤 address:', address);
      console.log('✖️ imxContracts', imxContracts);
      console.groupEnd();
    } else if (DEBUG && passportProvider && !isEmpty(imxContracts)) {
      console.group('_________________ 🚫 Offline User: IMX _________________');
      console.log('🛫 passportProvider', passportProvider);
      console.log('✖️ imxContracts', imxContracts);
      console.groupEnd();
    }
  }, [address, imxContracts, passportProvider, selectedNetworkId]);

  return (
    <IMXContext.Provider
      value={{
        address,
        comicsBalance,
        comicsLoading,
        imxContracts,
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

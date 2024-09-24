'use client';

import { type PropsWithChildren, createContext, useEffect } from 'react';
import { useWeb3ModalState } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import isEmpty from 'lodash/isEmpty';

import useContractLoader from '@/hooks/useContractLoader';
import useEthersProvider, { type Provider } from '@/hooks/useEthersProvider';
import useEthersSigner, { type Signer } from '@/hooks/useEthersSigner';
import useNotify from '@/hooks/useNotify';

import type { Tx } from '@/types/notify';
import type { Contracts } from '@/types/web3';
import { DEBUG } from '@/constants/index';
import { TARGET_NETWORK } from '@/constants/networks';

interface NetworkContext {
  address?: `0x${string}`;
  isConnected: boolean;
  publicProvider?: Provider;
  readContracts: Contracts;
  selectedNetworkId?: number;
  signer?: Signer;
  tx: Tx;
  writeContracts: Contracts;
}

const CONTEXT_INITIAL_STATE: NetworkContext = {
  address: undefined,
  isConnected: false,
  publicProvider: undefined,
  readContracts: {} as Contracts,
  selectedNetworkId: undefined,
  signer: undefined,
  tx: async () => new Promise(() => null),
  writeContracts: {} as Contracts,
};

const NetworkContext = createContext<NetworkContext>(CONTEXT_INITIAL_STATE);

export const NetworkProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const chainId = TARGET_NETWORK?.chainId || 1;
  const { address, isConnected } = useAccount();
  const { selectedNetworkId } = useWeb3ModalState() as {
    open: boolean;
    selectedNetworkId?: number;
  };

  const publicProvider = useEthersProvider({ chainId });
  const signer = useEthersSigner({ chainId });

  // The Notifier wraps transactions and provides notificiations
  const tx = useNotify(signer);

  // Load in your local 📝 Ethereum contracts and read a value from it:
  const readContracts = useContractLoader(publicProvider, { chainId });

  // If you want to make 🔐 write transactions to your Ethereum contracts, use the signer:
  const writeContracts = useContractLoader(signer, { chainId });

  useEffect(() => {
    if (
      DEBUG &&
      isConnected &&
      address &&
      publicProvider &&
      selectedNetworkId &&
      signer &&
      signer.address === address &&
      !isEmpty(readContracts) &&
      !isEmpty(writeContracts)
    ) {
      console.group('_________________ ✅ Nifty League: Ethereum _________________');
      console.log('🌐 publicProvider', publicProvider);
      console.log('📝 signer', signer);
      console.log('👤 address:', address);
      console.log('⛓️ selectedNetworkId:', selectedNetworkId);
      console.log('📍 targetNetwork:', TARGET_NETWORK);
      console.log('🔓 readContracts', readContracts);
      console.log('🔏 writeContracts', writeContracts);
      console.groupEnd();
    } else if (DEBUG && publicProvider && !isEmpty(readContracts)) {
      console.group('_________________ 🚫 Offline User: Ethereum _________________');
      console.log('🌐 publicProvider', publicProvider);
      console.log('⛓️ selectedNetworkId:', selectedNetworkId);
      console.log('📍 targetNetwork:', TARGET_NETWORK);
      console.log('🔓 readContracts', readContracts);
      console.groupEnd();
    }
  }, [address, isConnected, publicProvider, readContracts, selectedNetworkId, signer, writeContracts]);

  const context = {
    address,
    isConnected,
    publicProvider,
    readContracts,
    selectedNetworkId,
    signer,
    tx,
    writeContracts,
  };

  return <NetworkContext.Provider value={context}>{children}</NetworkContext.Provider>;
};

export default NetworkContext;

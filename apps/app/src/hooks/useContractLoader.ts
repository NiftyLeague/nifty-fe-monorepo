'use client';

import { useMemo } from 'react';
import { Contract, JsonRpcSigner, type InterfaceAbi } from 'ethers6';
import type { Contracts, Provider } from '@/types/web3';
import CONTRACTS from '@/constants/contracts/deployments';
import EXTERNAL_CONTRACTS from '@/constants/contracts/externalContracts';

/*
  ~ What it does? ~

  Loads your local contracts and gives options to read values from contracts
  or write transactions into them

  ~ How can I use? ~

  const readContracts = useContractLoader(publicProvider, { chainId }) // or
  const writeContracts = useContractLoader(signer, { chainId })

  ~ Features ~

  - publicProvider enables reading values from contracts
  - signers enable writing transactions into contracts
  - Example of using setPurpose function from our contract and writing transactions by Transactor.js helper:
    await tx( writeContracts.YourContract.setPurpose(newPurpose) )

  config should include:
  - chainId - to hardcode the chainId, irrespective of the providerOrSigner chainId
*/

type Config = { chainId: number };
type ProviderOrSigner = Provider | JsonRpcSigner | undefined;

function loadContracts(providerOrSigner: ProviderOrSigner, chainId: Config['chainId']): Contracts {
  if (providerOrSigner && typeof providerOrSigner !== 'undefined') {
    try {
      const deployedContractList = CONTRACTS[chainId];
      const hardhatContracts: { [key: string]: Contract } = deployedContractList
        ? Object.keys(deployedContractList).reduce(
            (accumulator, contractName) => {
              accumulator[contractName] = new Contract(
                deployedContractList[contractName]?.address ?? '',
                deployedContractList[contractName]?.abi as InterfaceAbi,
                providerOrSigner,
              );
              return accumulator;
            },
            {} as { [key: string]: Contract },
          )
        : {};

      const externalContractList = EXTERNAL_CONTRACTS[chainId];
      const externalContracts: { [key: string]: Contract } = externalContractList
        ? Object.keys(externalContractList).reduce(
            (accumulator, contractName) => {
              accumulator[contractName] = new Contract(
                externalContractList[contractName]?.address ?? '',
                externalContractList[contractName]?.abi as InterfaceAbi,
                providerOrSigner,
              );
              return accumulator;
            },
            {} as { [key: string]: Contract },
          )
        : {};

      return { ...hardhatContracts, ...externalContracts } as unknown as Contracts;
    } catch (e) {
      console.error('ERROR LOADING CONTRACTS!!', e);
    }
  }
  return {} as Contracts;
}

/** Action to load all necessary Nifty League or external contracts */
export default function useContractLoader(providerOrSigner: ProviderOrSigner, { chainId }: Config): Contracts {
  return useMemo(() => loadContracts(providerOrSigner, chainId), [providerOrSigner, chainId]);
}

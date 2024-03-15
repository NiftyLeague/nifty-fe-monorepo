'use client';

import { type PropsWithChildren, createContext, useCallback, useEffect, useMemo, useState } from 'react';
import isEmpty from 'lodash/isEmpty';
import { Link, ImmutableXClient, ImmutableMethodResults } from '@imtbl/imx-sdk';

import useNetworkContext from '@/hooks/useNetworkContext';
import { IMX_NL_ITEMS } from '@/constants/contracts';
import useItemsBalance from '@/hooks/useItemsBalance';
import type { Item } from '@/types/comic';

export interface Context {
  balance?: ImmutableMethodResults.ImmutableGetBalanceResult;
  client?: ImmutableXClient;
  inventory?: ImmutableMethodResults.ImmutableGetAssetsResult;
  itemsBalance: Item[];
  link: Link;
  linkSetup: () => Promise<void>;
  loading: boolean;
  registeredUser: boolean;
  setIMXRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  wallet: string;
}

const CONTEXT_INITIAL_STATE: Context = {
  balance: undefined,
  client: undefined,
  inventory: undefined,
  itemsBalance: [],
  link: new Link(process.env.NEXT_PUBLIC_SANDBOX_LINK_URL),
  linkSetup: async () => new Promise(() => null),
  loading: true,
  registeredUser: false,
  setIMXRefreshKey: () => {},
  wallet: 'undefined',
};

const IMXContext = createContext(CONTEXT_INITIAL_STATE);

export const IMXProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const { address, selectedNetworkId } = useNetworkContext();
  // initialise Immutable X Link SDK
  const link = useMemo(() => new Link(process.env.NEXT_PUBLIC_SANDBOX_LINK_URL), []);

  const [wallet, setWallet] = useState('undefined');
  const [balance, setBalance] = useState<ImmutableMethodResults.ImmutableGetBalanceResult>(Object);
  const [inventory, setInventory] = useState<ImmutableMethodResults.ImmutableGetAssetsResult>(Object);
  const [client, setClient] = useState<ImmutableXClient>(Object);
  const [loading, setLoading] = useState(true);
  const { itemsBalance } = useItemsBalance(inventory);
  const [imxRefreshKey, setIMXRefreshKey] = useState(0);
  const [registeredUser, setRegisteredUser] = useState(false);

  // set user wallet and balance from IMX or ETH network context
  const updateUser = useCallback(
    async (user: `0x${string}`) => {
      setWallet(user);
      setBalance(await client.getBalance({ user, tokenAddress: 'eth' }));
      if (selectedNetworkId)
        setInventory(
          await client.getAssets({
            user,
            collection: IMX_NL_ITEMS[selectedNetworkId],
            page_size: 200,
          }),
        );
      setLoading(false);
      try {
        const response = await client.getUser({ user });
        if (response) setRegisteredUser(true);
      } catch {
        setRegisteredUser(false);
      }
    },
    [client, selectedNetworkId],
  );

  useEffect(() => {
    buildIMX();
  }, []);

  // initialise an Immutable X Client to interact with apis more easily
  async function buildIMX() {
    const publicApiUrl: string = process.env.NEXT_PUBLIC_SANDBOX_ENV_URL ?? '';
    setClient(await ImmutableXClient.build({ publicApiUrl }));
  }

  useEffect(() => {
    if (address && !isEmpty(client)) {
      updateUser(address);
    }
  }, [address, client, updateUser, imxRefreshKey]);

  // register and/or setup a user
  const linkSetup = useCallback(async () => {
    const res = await link.setup({});
    setRegisteredUser(true);
    updateUser(res.address as `0x${string}`);
  }, [link, updateUser]);

  return (
    <IMXContext.Provider
      value={{
        balance,
        client,
        inventory,
        itemsBalance,
        link,
        linkSetup,
        loading,
        registeredUser,
        setIMXRefreshKey,
        wallet,
      }}
    >
      {children}
    </IMXContext.Provider>
  );
};

export default IMXContext;

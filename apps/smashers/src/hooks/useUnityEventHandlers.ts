import { useCallback, useEffect, useRef } from 'react';

type HookProps = {
  address: string;
  authToken: string;
  addEventListener: (eventName: string, callback: (arg0: any) => void) => void;
  removeEventListener: (eventName: string, callback: (arg0: any) => void) => void;
};

const useUnityEventHandlers = ({ address, authToken, addEventListener, removeEventListener }: HookProps) => {
  const authMsg = `true,${address || '0x0'},Vitalik,${authToken}`;
  const authCallback = useRef<null | ((authMsg: string) => void)>(null);

  useEffect(() => {
    if (address.length && authCallback.current) {
      authCallback.current(authMsg);
    }
  }, [address, authMsg]);

  const startAuthentication = useCallback(
    (e: CustomEvent<{ callback: (auth: string) => void }>) => {
      console.log('Authenticating:', authMsg);
      e.detail.callback(authMsg);
      authCallback.current = e.detail.callback;
    },
    [authMsg],
  );

  const getConfiguration = useCallback((e: CustomEvent<{ callback: (network: string) => void }>) => {
    const networkName = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? 'mainnet' : 'sepolia';
    const version = process.env.NEXT_PUBLIC_SUBGRAPH_VERSION;

    console.log('getConfiguration', `${networkName},${version ?? ''}`);
    setTimeout(() => e.detail.callback(`${networkName},${version ?? ''}`), 1000);
  }, []);

  useEffect(() => {
    addEventListener('StartAuthentication', startAuthentication);
    addEventListener('GetConfiguration', getConfiguration);
    return function cleanup() {
      removeEventListener('StartAuthentication', startAuthentication);
      removeEventListener('GetConfiguration', getConfiguration);
    };
  }, [addEventListener, getConfiguration, removeEventListener, startAuthentication]);
};

export default useUnityEventHandlers;

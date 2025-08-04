'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { isOpera, browserName } from 'react-device-detect';
import Unity, { UnityContext } from 'react-unity-webgl';
import { Box, Button, Stack } from '@mui/material';
import { useAccount } from 'wagmi';

import { gtm, GTM_EVENTS } from '@nl/ui/gtm';
import { Preloader } from '@nl/ui/custom/preloader';
import useTokensBalances from '@/hooks/balances/useTokensBalances';
// import useFetch from '@/hooks/useFetch';
import { NETWORK_NAME, TARGET_NETWORK } from '@/constants/networks';
import { getGameViewedAnalyticsContentId } from '@/constants/games';
// import { ALL_RENTAL_API_URL } from '@/constants/url';
import { DEBUG } from '@/constants/index';
import withVerification from '@/components/wrapper/Authentication';
// import type { Rentals } from '@/types/rentals';
// import EarningCap from '@/app/dashboard/overview/EarningCap';
import ArcadeTokensRequired from '@/components/ArcadeTokensRequired';
import useAuth from '@/hooks/useAuth';

interface GameProps {
  unityContext: UnityContext;
  arcadeTokenRequired?: boolean;
}

interface ExtendedUnityContext extends UnityContext {
  send: (gameObjectName: string, methodName: string, parameter?: string | number | boolean) => void;
  removeAllEventListeners: () => void;
  setFullscreen: (fullscreen: boolean) => void;
}

interface CustomEventWithCallback<T> extends CustomEvent {
  detail: { callback: (data: T) => void };
}

const Game = ({ unityContext, arcadeTokenRequired = false }: GameProps) => {
  const { authToken } = useAuth();
  const pathname = usePathname();
  const { address } = useAccount();
  const { tokensBalances, loadingArcadeBal, refetchArcadeBal } = useTokensBalances();
  const authMsg = `true,${address || '0x0'},Vitalik,${authToken}`;
  const authCallback = useRef<null | ((authMsg: string) => void)>(null);
  const [isLoaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // const headers = { authorizationToken: authToken || '' };
  // const { data: rentals } = useFetch<Rentals[]>(ALL_RENTAL_API_URL, {
  //   headers,
  //   enabled:
  //     !!authToken && unityContext.unityConfig.productName === 'NiftySmashers',
  // });

  useEffect(() => {
    if (address?.length && authCallback.current) {
      authCallback.current(authMsg);
    }
  }, [address, authMsg]);

  useEffect(() => {
    const contentId = getGameViewedAnalyticsContentId(pathname);
    if (contentId) {
      gtm.sendEvent(GTM_EVENTS.SELECT_CONTENT, { content_type: 'game', content_id: contentId });
    }
  }, [pathname]);

  const startAuthentication = useCallback(
    (e: CustomEventWithCallback<string>) => {
      if (DEBUG) console.log('Authenticating:', authMsg);
      e.detail.callback(authMsg);
      authCallback.current = e.detail.callback;
    },
    [authMsg],
  );

  const getConfiguration = useCallback((e: CustomEventWithCallback<string>) => {
    const networkName = NETWORK_NAME[TARGET_NETWORK.chainId];
    const version = process.env.NEXT_PUBLIC_SUBGRAPH_VERSION;
    if (DEBUG) console.log(`${networkName},${version ?? ''}`);
    setTimeout(() => e.detail.callback(`${networkName},${version ?? ''}`), 1000);
  }, []);

  const onMouse = useCallback(() => {
    const content = Array.from(document.getElementsByClassName('game-canvas') as HTMLCollectionOf<HTMLElement>)[0];
    if (content) {
      content.style.pointerEvents = 'auto';
      content.style.cursor = 'pointer';
    }
  }, []);

  useEffect(() => {
    if (unityContext) {
      const extendedContext = unityContext as ExtendedUnityContext;
      window.unityInstance = extendedContext;
      window.unityInstance.SendMessage = extendedContext.send;
      extendedContext.on('loaded', () => setLoaded(true));
      extendedContext.on('error', console.error);
      extendedContext.on('progress', p => setProgress(p * 100));
      window.addEventListener('StartAuthentication', startAuthentication as EventListener);
      window.addEventListener('GetConfiguration', getConfiguration as EventListener);
      document.addEventListener('mousemove', onMouse, false);
    }
    return () => {
      if (window.unityInstance) {
        const extendedContext = window.unityInstance as ExtendedUnityContext;
        extendedContext.removeAllEventListeners();
      }
      window.removeEventListener('StartAuthentication', startAuthentication as EventListener);
      window.removeEventListener('GetConfiguration', getConfiguration as EventListener);
      document.removeEventListener('mousemove', onMouse, false);
    };
  }, [unityContext, onMouse, startAuthentication, getConfiguration]);

  const handleOnClickFullscreen = () => {
    const extendedContext = window.unityInstance as ExtendedUnityContext;
    extendedContext.setFullscreen(true);
  };

  if (arcadeTokenRequired && loadingArcadeBal) {
    return <></>;
  }

  if (arcadeTokenRequired && Number(tokensBalances.AT) === 0) {
    return <ArcadeTokensRequired refetchArcadeBal={refetchArcadeBal} />;
  }

  return (
    <>
      <Preloader ready={isLoaded} progress={progress} />
      <Stack direction="row" sx={{ alignItems: 'flex-start' }}>
        <Stack sx={{ alignItems: 'flex-start' }}>
          <Unity
            key={authToken}
            className="game-canvas"
            unityContext={unityContext}
            style={{ width: 'calc(77vh * 1.33)', height: '77vh', visibility: isLoaded ? 'visible' : 'hidden' }}
          />
          <Button variant="contained" size="large" onClick={handleOnClickFullscreen} sx={{ marginTop: '6px' }}>
            Fullscreen
          </Button>
        </Stack>
        {/* {unityContext.unityConfig.productName === 'NiftySmashers' && (
          <Box ml={2} minWidth={350}>
            <EarningCap rentals={rentals ?? []} hideTitle={true} />
          </Box>
        )} */}
      </Stack>
    </>
  );
};

const GameWithAuth = withVerification((props: GameProps) =>
  isOpera ? (
    <Box component="h2" textAlign="center" mt={8}>
      {browserName} Browser Not Supported
    </Box>
  ) : (
    Game(props)
  ),
);

export default GameWithAuth;

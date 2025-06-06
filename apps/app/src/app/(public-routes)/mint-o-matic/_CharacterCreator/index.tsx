'use client';

import { memo, useCallback, useEffect, useState, useRef } from 'react';
import Unity, { UnityContext } from 'react-unity-webgl';
import { isMobileOnly, withOrientationChange } from 'react-device-detect';

import useRemovedTraits from '@/hooks/useRemovedTraits';
import { submitTxWithGasEstimate } from '@/utils/bnc-notify';
import type { NotifyCallback } from '@/types/notify';
import useNetworkContext from '@/hooks/useNetworkContext';
import { DEGEN_CONTRACT } from '@/constants/contracts';
import { NETWORK_NAME, TARGET_NETWORK } from '@/constants/networks';
import { DEBUG } from '@/constants/index';
import { getMintableTraits, TraitArray } from './helpers';

const baseUrl = isMobileOnly
  ? (process.env.NEXT_PUBLIC_UNITY_MOBILE_CREATOR_BASE_URL as string)
  : (process.env.NEXT_PUBLIC_UNITY_CREATOR_BASE_URL as string);
const buildVersion = isMobileOnly
  ? (process.env.NEXT_PUBLIC_UNITY_MOBILE_CREATOR_BASE_VERSION as string)
  : (process.env.NEXT_PUBLIC_UNITY_CREATOR_BASE_VERSION as string);

const useCompressed = process.env.NEXT_PUBLIC_UNITY_USE_COMPRESSED !== 'false';

const creatorContext = new UnityContext({
  loaderUrl: `${baseUrl}/Build/${buildVersion}.loader.js`,
  dataUrl: `${baseUrl}/Build/${buildVersion}.data${useCompressed ? '.br' : ''}`,
  frameworkUrl: `${baseUrl}/Build/${buildVersion}.framework.js${useCompressed ? '.br' : ''}`,
  codeUrl: `${baseUrl}/Build/${buildVersion}.wasm${useCompressed ? '.br' : ''}`,
  streamingAssetsUrl: `${baseUrl}/StreamingAssets`,
  companyName: 'NiftyLeague',
  productName: 'NiftyCreator',
  productVersion: buildVersion,
});

const WIDTH_SCALE = 280;
const HEIGHT_SCALE = 210;
let DEFAULT_WIDTH = WIDTH_SCALE * 3;
let DEFAULT_HEIGHT = HEIGHT_SCALE * 3;

const getMobileSize = (isPortrait: boolean) => {
  if (typeof window !== 'undefined') {
    const { innerWidth } = window;
    const width = innerWidth > 0 ? innerWidth : window.screen.width;
    let height = width;
    if (!isPortrait) {
      height = width / 1.333333;
    }
    return { width, height };
  }
  return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
};

const getBrowserGameSize = () => {
  if (typeof window !== 'undefined') {
    const { innerWidth, innerHeight } = window;
    const scale = 1.333333;
    const percent = 93;
    let height = Math.floor((innerHeight * percent) / 100);
    let width = height * scale;
    if (width > innerWidth) {
      width = innerWidth;
      height = innerWidth / scale;
    }
    return { width, height };
  }
  return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
};

if (isMobileOnly) {
  const { width, height } = getMobileSize(true);
  DEFAULT_WIDTH = width;
  DEFAULT_HEIGHT = height;
} else {
  const { width, height } = getBrowserGameSize();
  DEFAULT_WIDTH = width;
  DEFAULT_HEIGHT = height;
}

const RemovedTraits = ({ callback, refreshKey }: { callback: (arg0: string) => void; refreshKey: number }) => {
  const { readContracts } = useNetworkContext();
  const removedTraits = useRemovedTraits(readContracts);

  useEffect(() => {
    if (DEBUG) console.log('Removed Traits:', removedTraits);
    callback(JSON.stringify(removedTraits));
  }, [callback, removedTraits, refreshKey]);

  return null;
};

interface CharacterCreatorContainerProps {
  isLoaded: boolean;
  isPortrait?: boolean;
  setLoaded: (loaded: boolean) => void;
  setProgress: (progress: number) => void;
}
interface CharacterCreatorProps extends CharacterCreatorContainerProps {
  onMintCharacter: (e: MintEvent) => Promise<void> | void;
  unityContext: UnityContext;
}

type MintEvent = CustomEvent<{ callback: (reset: string) => void; traits: TraitArray }>;

const CharacterCreator = memo(
  ({ isLoaded, isPortrait, onMintCharacter, setLoaded, setProgress, unityContext }: CharacterCreatorProps) => {
    const removedTraitsCallback = useRef<null | ((removedTraits: string) => void)>(null);
    const [width, setWidth] = useState(DEFAULT_WIDTH);
    const [height, setHeight] = useState(DEFAULT_HEIGHT);
    const [refreshKey, setRefreshKey] = useState(0);
    const [isMinting, setIsMinting] = useState(false);

    const getRemovedTraits = useCallback((e: CustomEvent<{ callback: (removedTraits: string) => void }>) => {
      removedTraitsCallback.current = e.detail.callback;
      setRefreshKey(Math.random() + 1);
    }, []);

    useEffect(() => {
      if (isMobileOnly && isLoaded && unityContext?.send) {
        unityContext.send('CharacterCreatorLevel', 'UI_SetPortrait', isPortrait ? 'true' : 'false');
        const safeIsPortrait = isPortrait ?? true;
        const { width: newWidth, height: newHeight } = getMobileSize(safeIsPortrait);
        setWidth(newWidth);
        setHeight(newHeight);
      }
    }, [isPortrait, isLoaded, unityContext]);

    const reportWindowSize = useCallback(
      (e: UIEvent) => {
        if (isMobileOnly) {
          const safeIsPortrait = isPortrait ?? true;
          const { width: newWidth, height: newHeight } = getMobileSize(safeIsPortrait);
          setWidth(newWidth);
          setHeight(newHeight);
        } else {
          const { width: newWidth, height: newHeight } = getBrowserGameSize();
          setWidth(newWidth);
          setHeight(newHeight);
        }
      },
      [isPortrait],
    );

    const getConfiguration = useCallback((e: CustomEvent<{ callback: (network: string) => void }>) => {
      const networkName = NETWORK_NAME[TARGET_NETWORK.chainId];
      const version = process.env.NEXT_PUBLIC_SUBGRAPH_VERSION ?? '';
      setTimeout(() => e.detail.callback(`${networkName},${version}`), 1000);
    }, []);

    const toggleIsMinting = useCallback((e: CustomEvent<boolean>) => {
      setIsMinting(e.detail);
    }, []);

    const onScroll = useCallback(() => {
      const content = Array.from(
        document.getElementsByClassName('character-canvas') as HTMLCollectionOf<HTMLElement>,
      )[0];
      if (content) content.style.pointerEvents = 'none';
    }, []);

    const onMouse = useCallback(() => {
      const content = Array.from(
        document.getElementsByClassName('character-canvas') as HTMLCollectionOf<HTMLElement>,
      )[0];
      if (content) {
        content.style.pointerEvents = 'auto';
        content.style.cursor = 'pointer';
      }
    }, []);

    useEffect(() => {
      if (unityContext) {
        unityContext.on('canvas', () => {
          setWidth(DEFAULT_WIDTH);
          setHeight(DEFAULT_HEIGHT);
          setTimeout(() => {
            if (isMobileOnly && unityContext?.send)
              unityContext.send('CharacterCreatorLevel', 'UI_SetPortrait', isPortrait ? 'true' : 'false');
          }, 2000);
        });
        unityContext.on('loaded', () => setLoaded(true));
        unityContext.on('error', console.error);
        unityContext.on('progress', p => setProgress(p * 100));
        window.addEventListener('resize', reportWindowSize as EventListener);
        window.addEventListener('GetConfiguration', getConfiguration as EventListener);
        window.addEventListener('GetRemovedTraits', getRemovedTraits as EventListener);
        window.addEventListener('OnMintEffectToggle', toggleIsMinting as EventListener);
        window.addEventListener('SubmitTraits', onMintCharacter as EventListener);
        document.addEventListener('wheel', onScroll, false);
        document.addEventListener('mousemove', onMouse, false);
      }
      return () => {
        if (window.unityInstance) window.unityInstance.removeAllEventListeners();
        if (unityContext) unityContext.removeAllEventListeners();
        window.removeEventListener('resize', reportWindowSize as EventListener);
        window.removeEventListener('GetConfiguration', getConfiguration as EventListener);
        window.removeEventListener('GetRemovedTraits', getRemovedTraits as EventListener);
        window.removeEventListener('OnMintEffectToggle', toggleIsMinting as EventListener);
        window.removeEventListener('SubmitTraits', onMintCharacter as EventListener);
        document.removeEventListener('wheel', onScroll, false);
        document.removeEventListener('mousemove', onMouse, false);
      };
    }, [
      getConfiguration,
      getRemovedTraits,
      isPortrait,
      onMintCharacter,
      onMouse,
      onScroll,
      reportWindowSize,
      setLoaded,
      setProgress,
      toggleIsMinting,
      unityContext,
    ]);

    return (
      <>
        <div
          className="pixelated"
          style={{
            backgroundSize: height / 21,
            backgroundImage: `url('/img/backgrounds/character-creator-repeat.webp')`,
            backgroundRepeat: 'repeat-x',
          }}
        >
          <Unity
            className="character-canvas"
            unityContext={unityContext}
            style={{ width, height, visibility: isLoaded ? 'visible' : 'hidden' }}
          />
        </div>
        {removedTraitsCallback.current && refreshKey ? (
          <RemovedTraits callback={removedTraitsCallback.current} refreshKey={refreshKey} />
        ) : null}
      </>
    );
  },
);

const CharacterCreatorContainer = memo(
  ({ isLoaded, isPortrait, setLoaded, setProgress }: CharacterCreatorContainerProps) => {
    const { address, tx, writeContracts } = useNetworkContext();
    const [saleLocked, setSaleLocked] = useState(false);
    const totalSupply = 9900;

    useEffect(() => {
      const count = totalSupply ?? 0;
      if (count < 3 || count >= 9900) {
        setSaleLocked(true);
      } else {
        setSaleLocked(false);
      }
    }, [totalSupply, address]);

    useEffect(() => {
      window.unityInstance = creatorContext;
      window.unityInstance.SendMessage = creatorContext.send;
    }, []);

    const stashMintState = useCallback((e: MintEvent) => {
      setTimeout(() => e.detail.callback('false'), 1000);
    }, []);

    const mintCharacter = useCallback(
      async (e: MintEvent) => {
        const { character, head, clothing, accessories, items } = getMintableTraits(e.detail);
        const nftContract = writeContracts[DEGEN_CONTRACT];
        const args = [character, head, clothing, accessories, items];
        const value = (await nftContract.getNFTPrice()) as bigint;
        const minimumGas = 250000n;
        const txCallback: NotifyCallback = mintTx => {
          if (mintTx?.status === 'pending') e.detail.callback('true');
        };
        const res = await submitTxWithGasEstimate(tx, nftContract, 'purchase', args, { value }, minimumGas, txCallback);
        if (!res) e.detail.callback('false');
      },
      [writeContracts, tx],
    );

    return (
      <>
        {window.unityInstance && (
          <CharacterCreator
            isLoaded={isLoaded}
            isPortrait={isPortrait}
            onMintCharacter={writeContracts[DEGEN_CONTRACT] && !saleLocked ? mintCharacter : stashMintState}
            setLoaded={setLoaded}
            setProgress={setProgress}
            unityContext={creatorContext}
          />
        )}
      </>
    );
  },
);

CharacterCreator.displayName = 'CharacterCreator';
CharacterCreatorContainer.displayName = 'CharacterCreatorContainer';
export default withOrientationChange(CharacterCreatorContainer);

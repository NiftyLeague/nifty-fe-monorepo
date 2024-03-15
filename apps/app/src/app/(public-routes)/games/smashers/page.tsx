'use client';

import dynamic from 'next/dynamic';
import { UnityContext } from 'react-unity-webgl';
const GameWithAuth = dynamic(() => import('@/components/wrapper/GameWithAuth'), { ssr: false });

const smashersBaseUrl = process.env.NEXT_PUBLIC_UNITY_SMASHERS_BASE_URL as string;
const smashersBuildVersion = process.env.NEXT_PUBLIC_UNITY_SMASHERS_BASE_VERSION as string;

const useCompressed = process.env.NEXT_PUBLIC_UNITY_USE_COMPRESSED !== 'false';

const smashersContext = new UnityContext({
  loaderUrl: `${smashersBaseUrl}/Build/${smashersBuildVersion}.loader.js`,
  dataUrl: `${smashersBaseUrl}/Build/${smashersBuildVersion}.data${useCompressed ? '.br' : ''}`,
  frameworkUrl: `${smashersBaseUrl}/Build/${smashersBuildVersion}.framework.js${useCompressed ? '.br' : ''}`,
  codeUrl: `${smashersBaseUrl}/Build/${smashersBuildVersion}.wasm${useCompressed ? '.br' : ''}`,
  streamingAssetsUrl: `${smashersBaseUrl}/StreamingAssets`,
  companyName: 'NiftyLeague',
  productName: 'NiftySmashers',
  productVersion: smashersBuildVersion,
});

const SmashersGame = () => (
  <>
    <div style={{ marginBottom: 20 }}>
      <strong>
        Note: This is a deprecated version of Nifty Smashers. If you&apos;re looking for our latest mobile game please
        visit{' '}
        <a href="https://niftysmashers.com" target="_blank" rel="noreferrer" style={{ color: '#5e72eb' }}>
          niftysmashers.com
        </a>
      </strong>
    </div>

    <GameWithAuth unityContext={smashersContext} />
  </>
);

export default SmashersGame;

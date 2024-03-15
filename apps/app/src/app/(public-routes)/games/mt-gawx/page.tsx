'use client';

import dynamic from 'next/dynamic';
import { UnityContext } from 'react-unity-webgl';
const GameWithAuth = dynamic(() => import('@/components/wrapper/GameWithAuth'), { ssr: false });

const burnerBaseUrl = process.env.NEXT_PUBLIC_UNITY_BURNER_BASE_URL as string;
const burnerBuildVersion = process.env.NEXT_PUBLIC_UNITY_BURNER_BASE_VERSION as string;

const burnerContext = new UnityContext({
  loaderUrl: `${burnerBaseUrl}/Build/${burnerBuildVersion}.loader.js`,
  dataUrl: `${burnerBaseUrl}/Build/${burnerBuildVersion}.data.br`,
  frameworkUrl: `${burnerBaseUrl}/Build/${burnerBuildVersion}.framework.js.br`,
  codeUrl: `${burnerBaseUrl}/Build/${burnerBuildVersion}.wasm.br`,
  streamingAssetsUrl: `${burnerBaseUrl}/StreamingAssets`,
  companyName: 'NiftyLeague',
  productName: 'Mt.Gawx',
  productVersion: burnerBuildVersion,
});

const MtGawxGame = () => <GameWithAuth unityContext={burnerContext} />;

export default MtGawxGame;

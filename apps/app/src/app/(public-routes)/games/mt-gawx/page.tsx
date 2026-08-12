import type { UnityConfig } from 'react-unity-webgl'

import GameRoute from '@/components/wrapper/GameRoute'

const burnerBaseUrl = process.env.NEXT_PUBLIC_UNITY_BURNER_BASE_URL as string
const burnerBuildVersion = process.env.NEXT_PUBLIC_UNITY_BURNER_BASE_VERSION as string

const burnerConfig: UnityConfig = {
  loaderUrl: `${burnerBaseUrl}/Build/${burnerBuildVersion}.loader.js`,
  dataUrl: `${burnerBaseUrl}/Build/${burnerBuildVersion}.data.br`,
  frameworkUrl: `${burnerBaseUrl}/Build/${burnerBuildVersion}.framework.js.br`,
  codeUrl: `${burnerBaseUrl}/Build/${burnerBuildVersion}.wasm.br`,
  streamingAssetsUrl: `${burnerBaseUrl}/StreamingAssets`,
  companyName: 'NiftyLeague',
  productName: 'Mt.Gawx',
  productVersion: burnerBuildVersion,
}

const MtGawxGame = () => <GameRoute unityConfig={burnerConfig} />

export default MtGawxGame

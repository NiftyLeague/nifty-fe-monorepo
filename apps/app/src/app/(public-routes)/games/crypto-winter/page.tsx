import type { UnityConfig } from 'react-unity-webgl'

import GameRoute from '@/components/wrapper/GameRoute'

const baseUrl = process.env.NEXT_PUBLIC_UNITY_CRYPTO_WINTER_BASE_URL as string
const buildVersion = process.env.NEXT_PUBLIC_UNITY_CRYPTO_WINTER_BASE_VERSION as string

const cryptoWinterConfig: UnityConfig = {
  loaderUrl: `${baseUrl}/Build/${buildVersion}.loader.js`,
  dataUrl: `${baseUrl}/Build/${buildVersion}.data.br`,
  frameworkUrl: `${baseUrl}/Build/${buildVersion}.framework.js.br`,
  codeUrl: `${baseUrl}/Build/${buildVersion}.wasm.br`,
  streamingAssetsUrl: `${baseUrl}/StreamingAssets`,
  companyName: 'NiftyLeague',
  productName: 'CryptoWinter',
  productVersion: buildVersion,
}

const CryptoWinterGame = () => <GameRoute unityConfig={cryptoWinterConfig} arcadeTokenRequired />

export default CryptoWinterGame

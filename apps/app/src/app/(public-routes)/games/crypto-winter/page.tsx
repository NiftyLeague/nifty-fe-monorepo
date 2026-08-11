'use client'

import dynamic from 'next/dynamic'
import type { UnityConfig } from 'react-unity-webgl'
import WalletRouteProvider from '@/components/providers/WalletRouteProvider'
const GameWithAuth = dynamic(() => import('@/components/wrapper/GameWithAuth'), { ssr: false })

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

const CryptoWinterGame = () => (
  <WalletRouteProvider>
    <GameWithAuth unityConfig={cryptoWinterConfig} arcadeTokenRequired />
  </WalletRouteProvider>
)

export default CryptoWinterGame

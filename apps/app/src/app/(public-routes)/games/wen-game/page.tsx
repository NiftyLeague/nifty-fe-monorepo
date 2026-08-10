// @ts-nocheck
'use client'

import dynamic from 'next/dynamic'
import type { UnityConfig } from 'react-unity-webgl'
import WalletRouteProvider from '@/components/providers/WalletRouteProvider'
const GameWithAuth = dynamic(() => import('@/components/wrapper/GameWithAuth'), { ssr: false })

const wenBaseUrl = process.env.NEXT_PUBLIC_UNITY_WEN_BASE_URL as string
const wenBuildVersion = process.env.NEXT_PUBLIC_UNITY_WEN_BASE_VERSION as string

const wenConfig: UnityConfig = {
  loaderUrl: `${wenBaseUrl}/Build/${wenBuildVersion}.loader.js`,
  dataUrl: `${wenBaseUrl}/Build/${wenBuildVersion}.data.br`,
  frameworkUrl: `${wenBaseUrl}/Build/${wenBuildVersion}.framework.js.br`,
  codeUrl: `${wenBaseUrl}/Build/${wenBuildVersion}.wasm.br`,
  streamingAssetsUrl: `${wenBaseUrl}/StreamingAssets`,
  companyName: 'NiftyLeague',
  productName: 'WENGame',
  productVersion: wenBuildVersion,
}

const WenGame = () => (
  <WalletRouteProvider>
    <GameWithAuth unityConfig={wenConfig} arcadeTokenRequired />
  </WalletRouteProvider>
)

export default WenGame

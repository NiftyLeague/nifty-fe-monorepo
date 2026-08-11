'use client'

import dynamic from 'next/dynamic'
import type { UnityConfig } from 'react-unity-webgl'
import WalletRouteProvider from '@/components/providers/WalletRouteProvider'
const GameWithAuth = dynamic(() => import('@/components/wrapper/GameWithAuth'), { ssr: false })

const smashersBaseUrl = process.env.NEXT_PUBLIC_UNITY_SMASHERS_BASE_URL as string
const smashersBuildVersion = process.env.NEXT_PUBLIC_UNITY_SMASHERS_BASE_VERSION as string

const useCompressed = process.env.NEXT_PUBLIC_UNITY_USE_COMPRESSED !== 'false'

const smashersConfig: UnityConfig = {
  loaderUrl: `${smashersBaseUrl}/Build/${smashersBuildVersion}.loader.js`,
  dataUrl: `${smashersBaseUrl}/Build/${smashersBuildVersion}.data${useCompressed ? '.br' : ''}`,
  frameworkUrl: `${smashersBaseUrl}/Build/${smashersBuildVersion}.framework.js${useCompressed ? '.br' : ''}`,
  codeUrl: `${smashersBaseUrl}/Build/${smashersBuildVersion}.wasm${useCompressed ? '.br' : ''}`,
  streamingAssetsUrl: `${smashersBaseUrl}/StreamingAssets`,
  companyName: 'NiftyLeague',
  productName: 'NiftySmashers',
  productVersion: smashersBuildVersion,
}

const SmashersGame = () => (
  <WalletRouteProvider>
    <>
      <div style={{ marginBottom: 20 }}>
        <strong>
          Note: This is a deprecated version of Nifty Smashers. If you&apos;re looking for our
          latest mobile game please visit{' '}
          <a
            href="https://niftysmashers.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: 'var(--color-blue)' }}
          >
            niftysmashers.com
          </a>
        </strong>
      </div>

      <GameWithAuth unityConfig={smashersConfig} />
    </>
  </WalletRouteProvider>
)

export default SmashersGame

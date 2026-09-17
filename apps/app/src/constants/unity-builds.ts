import type { UnityConfig } from '@/runtime/unity'

import {
  UNITY_SMASHERS_BASE_URL,
  UNITY_SMASHERS_BASE_VERSION,
  UNITY_USE_COMPRESSED,
} from '@/runtime/env'

interface BuildOptions {
  /** Brotli-compress the data/framework/wasm payloads. */
  compressed?: boolean
  productName: string
  version: string
  baseUrl: string
}

const buildConfig = ({
  baseUrl,
  compressed = UNITY_USE_COMPRESSED,
  productName,
  version,
}: BuildOptions): UnityConfigWithMeta => ({
  config: {
    loaderUrl: `${baseUrl}/Build/${version}.loader.js`,
    dataUrl: `${baseUrl}/Build/${version}.data${compressed ? '.br' : ''}`,
    frameworkUrl: `${baseUrl}/Build/${version}.framework.js${compressed ? '.br' : ''}`,
    codeUrl: `${baseUrl}/Build/${version}.wasm${compressed ? '.br' : ''}`,
    streamingAssetsUrl: `${baseUrl}/StreamingAssets`,
    companyName: 'NiftyLeague',
    productName,
    productVersion: version,
  },
})

export interface UnityConfigWithMeta {
  config: UnityConfig
}

export const smashersBuild = buildConfig({
  baseUrl: UNITY_SMASHERS_BASE_URL,
  productName: 'NiftySmashers',
  version: UNITY_SMASHERS_BASE_VERSION,
})

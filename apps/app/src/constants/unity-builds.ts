import type { UnityConfig } from 'react-unity-webgl'

import {
  UNITY_BURNER_BASE_URL,
  UNITY_BURNER_BASE_VERSION,
  UNITY_CREATOR_BASE_URL,
  UNITY_CREATOR_BASE_VERSION,
  UNITY_CRYPTO_WINTER_BASE_URL,
  UNITY_CRYPTO_WINTER_BASE_VERSION,
  UNITY_MOBILE_CREATOR_BASE_URL,
  UNITY_MOBILE_CREATOR_BASE_VERSION,
  UNITY_SMASHERS_BASE_URL,
  UNITY_SMASHERS_BASE_VERSION,
  UNITY_USE_COMPRESSED,
  UNITY_WEN_BASE_URL,
  UNITY_WEN_BASE_VERSION,
} from '@/runtime/env'

interface BuildOptions {
  arcadeTokenRequired?: boolean
  /** Brotli-compress the data/framework/wasm payloads. */
  compressed?: boolean
  productName: string
  version: string
  baseUrl: string
}

const buildConfig = ({
  arcadeTokenRequired,
  baseUrl,
  compressed = UNITY_USE_COMPRESSED,
  productName,
  version,
}: BuildOptions): UnityConfigWithMeta => ({
  arcadeTokenRequired,
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
  arcadeTokenRequired?: boolean
}

export const smashersBuild = buildConfig({
  baseUrl: UNITY_SMASHERS_BASE_URL,
  productName: 'NiftySmashers',
  version: UNITY_SMASHERS_BASE_VERSION,
})

export const wenGameBuild = buildConfig({
  arcadeTokenRequired: true,
  baseUrl: UNITY_WEN_BASE_URL,
  productName: 'WENGame',
  version: UNITY_WEN_BASE_VERSION,
})

export const cryptoWinterBuild = buildConfig({
  arcadeTokenRequired: true,
  baseUrl: UNITY_CRYPTO_WINTER_BASE_URL,
  productName: 'CryptoWinter',
  version: UNITY_CRYPTO_WINTER_BASE_VERSION,
})

export const mtGawxBuild = buildConfig({
  baseUrl: UNITY_BURNER_BASE_URL,
  productName: 'Mt.Gawx',
  version: UNITY_BURNER_BASE_VERSION,
})

/**
 * The character creator ships separate desktop and mobile builds. The mobile
 * build is only used when the browser is a phone or tablet.
 */
export const characterCreatorBuild = (isMobileOnly: boolean) =>
  isMobileOnly
    ? buildConfig({
        baseUrl: UNITY_MOBILE_CREATOR_BASE_URL,
        productName: 'NiftyCreator',
        version: UNITY_MOBILE_CREATOR_BASE_VERSION,
      })
    : buildConfig({
        baseUrl: UNITY_CREATOR_BASE_URL,
        productName: 'NiftyCreator',
        version: UNITY_CREATOR_BASE_VERSION,
      })

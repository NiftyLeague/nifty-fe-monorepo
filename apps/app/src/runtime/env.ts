/**
 * Public runtime configuration.
 *
 * These values are public settings that used to be inlined from a build-time
 * the build tool inlined at build time. Vite only inlines `import.meta.env.VITE_*`, so
 * every public setting now flows through this module to keep the reads in one
 * place.
 *
 * Nothing here throws at import time: this module is on the import path of most
 * of the app (and its tests), so a missing optional value must not break module
 * loading. Values that a feature genuinely cannot work without are validated
 * where that feature initializes — see `contexts/Web3ModalConfig.tsx`.
 *
 * `VITE_*` values are embedded in the client bundle. Only put public settings
 * here — never secrets.
 */

const read = (value: string | undefined) => {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

const optional = (value: string | undefined, fallback = '') => read(value) ?? fallback

const boolean = (value: string | undefined, fallback = false) => {
  const resolved = read(value)
  return resolved === undefined ? fallback : resolved === 'true'
}

/** Deployment environment. Vercel injects VERCEL_ENV; local dev falls back. */
export const DEPLOY_ENV =
  read(import.meta.env.VITE_VERCEL_ENV) ?? read(import.meta.env.VITE_DEPLOY_ENV) ?? 'development'

export const IS_PRODUCTION = DEPLOY_ENV === 'production'

export const DEBUG = boolean(import.meta.env.VITE_DEBUG, !IS_PRODUCTION)

/** `mainnet` | `sepolia` | `hardhat` */
export const NETWORK = optional(import.meta.env.VITE_NETWORK, 'mainnet')

/** Wallet and RPC configuration. */
export const WALLET_CONNECT_PROJECT_ID = optional(import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID)
export const INFURA_PROJECT_ID = optional(import.meta.env.VITE_INFURA_PROJECT_ID)
export const BLOCKNATIVE_DAPPID = optional(import.meta.env.VITE_BLOCKNATIVE_DAPPID)

/** Subgraph credentials. */
export const GRAPH_API_KEY = optional(import.meta.env.VITE_GRAPH_API_KEY)
export const GRAPH_ID = optional(import.meta.env.VITE_GRAPH_ID)
export const SUBGRAPH_VERSION = optional(import.meta.env.VITE_SUBGRAPH_VERSION)

/** Analytics opt-out, using the same policy as the other surfaces. */
export const TELEMETRY = boolean(import.meta.env.VITE_TELEMETRY, true)

/** Feature flags and local fixtures. */
export const FEATURE_FLAGS = optional(import.meta.env.VITE_FEATURE_FLAGS, '{}')
export const AUDIT_FIXTURE = boolean(import.meta.env.VITE_AUDIT_FIXTURE)

/**
 * Unity WebGL builds. These public CDN defaults keep a local preview playable
 * without a copied env file; deployments can still override every value
 * through Vite's public environment variables. The published payloads use
 * Brotli compression, so that is the safe default for the documented builds.
 */
export const UNITY_USE_COMPRESSED = boolean(import.meta.env.VITE_UNITY_USE_COMPRESSED, true)
export const UNITY_SMASHERS_BASE_URL = optional(
  import.meta.env.VITE_UNITY_SMASHERS_BASE_URL,
  'https://d7ct17ettlkln.cloudfront.net/ns/prod/0.53.1-eb048de3b4a0'
)
export const UNITY_SMASHERS_BASE_VERSION = optional(
  import.meta.env.VITE_UNITY_SMASHERS_BASE_VERSION,
  '0.53.1'
)
export const UNITY_WEN_BASE_URL = optional(
  import.meta.env.VITE_UNITY_WEN_BASE_URL,
  'https://d7ct17ettlkln.cloudfront.net/wg/prod/1.0.7-db2ffcb8be96'
)
export const UNITY_WEN_BASE_VERSION = optional(import.meta.env.VITE_UNITY_WEN_BASE_VERSION, '1.0.7')
export const UNITY_BURNER_BASE_URL = optional(
  import.meta.env.VITE_UNITY_BURNER_BASE_URL,
  'https://d7ct17ettlkln.cloudfront.net/nb/prod/1.0.8-9563cf52addc'
)
export const UNITY_BURNER_BASE_VERSION = optional(
  import.meta.env.VITE_UNITY_BURNER_BASE_VERSION,
  '1.0.8'
)
export const UNITY_CRYPTO_WINTER_BASE_URL = optional(
  import.meta.env.VITE_UNITY_CRYPTO_WINTER_BASE_URL,
  'https://d7ct17ettlkln.cloudfront.net/cw/prod/1.0.19-e321c17b263b'
)
export const UNITY_CRYPTO_WINTER_BASE_VERSION = optional(
  import.meta.env.VITE_UNITY_CRYPTO_WINTER_BASE_VERSION,
  '1.0.19'
)

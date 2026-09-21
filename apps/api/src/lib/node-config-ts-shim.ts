/**
 * Worker-side stand-in for `node-config-ts`.
 *
 * node-config-ts reads config/default.json from disk and resolves its `@@ENV`
 * placeholders from the environment. workerd has no filesystem, so this shim
 * bundles the same JSON and resolves the placeholders from process.env at
 * startup. Wrangler's `alias` config maps the `node-config-ts` import to this
 * module, so no consumer code changes.
 *
 * The Worker runtime populates process.env from bindings (deployed vars and
 * secrets) before any module evaluates.
 */
import defaultConfig from '../../config/default.json'

type ConfigValue = string | number | boolean | null | ConfigTree
interface ConfigTree {
  [key: string]: ConfigValue
}

const resolvePlaceholder = (value: string): string | undefined => {
  if (value.startsWith('@@')) {
    const name = value.slice(2)
    const fromEnv = globalThis.process.env[name]
    return fromEnv === undefined ? undefined : String(fromEnv)
  }
  return value
}

const substitute = (node: ConfigValue): ConfigValue => {
  if (typeof node === 'string') return resolvePlaceholder(node) ?? ''
  if (Array.isArray(node)) return node.map(substitute) as unknown as ConfigValue
  if (node && typeof node === 'object') {
    const out: ConfigTree = {}
    for (const [key, value] of Object.entries(node)) out[key] = substitute(value)
    return out
  }
  return node
}

// process.env is populated from Worker bindings when a request handler runs,
// not at module evaluation, so the substitution must be deferred until first
// access — which is always inside a handler in practice.
let materialized: ConfigTree | undefined
const materialize = (): ConfigTree => {
  materialized ??= substitute(defaultConfig as ConfigTree) as ConfigTree
  return materialized
}

export const config = new Proxy(
  {} as {
    host: Record<string, string>
    port: string
    eth: {
      account: { pk?: string }
      network: string
      infura: string
      etherscan: string
      alchemy: Record<string, string | undefined>
      opensea: string
    }
    aws: { apiSecret?: string; s3: Record<string, unknown> }
    blocknative: { webhookSecret?: string; apiKey?: Record<string, string | undefined> }
    ipfs: Record<string, unknown>
    [key: string]: ConfigValue | Record<string, unknown>
  },
  {
    get(_target, prop: string | symbol) {
      return materialize()[prop as string]
    },
    has(_target, prop: string | symbol) {
      return prop in materialize()
    },
    ownKeys() {
      return Reflect.ownKeys(materialize())
    },
  }
)

/**
 * Build-time values injected by the consuming app (Astro `define` or Vite
 * `define`). Declared here so library sources type-check standalone; the
 * interfaces merge with the app's own `ImportMetaEnv`.
 */
interface ImportMetaEnv {
  readonly PUBLIC_AUTH_PROVIDERS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

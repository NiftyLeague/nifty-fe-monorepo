/**
 * `config.ts` selects the Immutable SDK environment from a build-time value the
 * consuming app injects through Vite (`define`/`envPrefix`), so declare the
 * slice of `import.meta.env` this package reads. There is no runtime fallback:
 * an unset value means the app is not building through Vite.
 */
interface ImportMetaEnv {
  readonly VITE_VERCEL_ENV?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

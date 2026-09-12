/**
 * Build-time values injected by the consuming app through Astro/Vite `define`.
 *
 * Declaring the env slice here (rather than in the hook) means every program
 * that compiles a consumer — ui, playfab, app — sees the same `import.meta.env`
 * typing, and the `import.meta.env` expression stays textually intact for the
 * bundler's define replacement.
 */
declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  interface ImportMetaEnv {
    readonly PUBLIC_AUTH_PROVIDERS?: string
  }
}

export const PUBLIC_AUTH_PROVIDERS = import.meta.env.PUBLIC_AUTH_PROVIDERS

/**
 * Ambient declarations for Starlight's virtual modules.
 *
 * Starlight generates these at build time from the resolved user config; without
 * declarations `astro check` cannot resolve them from the docs app.
 */

declare module 'virtual:starlight/user-config' {
  import type { StarlightUserConfig } from '@astrojs/starlight/types'

  const config: StarlightUserConfig & {
    title: string
    titleDelimiter: string
    pagefind: boolean
    components: Record<string, string>
  }
  export default config
}

declare module 'virtual:starlight/components/*' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js'

  const component: AstroComponentFactory
  export default component
}

declare module 'virtual:starlight/project-context' {
  const project: {
    root: string
    srcDir: string
    trailingSlash: 'always' | 'never' | 'ignore'
  }
  export default project
}

declare module 'virtual:starlight/user-css' {}
declare module 'virtual:starlight/user-images' {
  export const logos: Record<string, { src: string; width: number; height: number } | undefined>
}
declare module 'virtual:starlight/optional-css' {}
declare module 'virtual:starlight/pagefind-config' {
  export const pagefindUserConfig: Record<string, unknown>
}

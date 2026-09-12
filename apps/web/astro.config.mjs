import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@tailwindcss/vite'
import { dirname, resolve } from 'node:path'
import { readFileSync, existsSync } from 'node:fs'
import {
  ASSETS_PUBLIC_DIR,
  INLINE_STYLESHEETS,
  appLocal,
  bundleSsrGraph,
  sourceAlias,
} from '@nl/astro-config'

const local = appLocal(import.meta.url)
const manifestPath = local('.web-images/manifest.json')
const sharedImage = local('../../packages/ui/src/components/custom/optimized-image')
const imageAdapter = {
  name: 'web-only-image-adapter',
  enforce: 'pre',
  resolveId(specifier, importer) {
    if (!importer || !specifier.startsWith('.')) return null
    const resolved = resolve(dirname(importer.split('?')[0]), specifier)
    if ([sharedImage, `${sharedImage}/index`, `${sharedImage}/index.tsx`].includes(resolved))
      return local('src/runtime/Image.tsx')
    return null
  },
}
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : {}

export default defineConfig({
  site: 'https://niftyleague.com',
  output: 'static',
  publicDir: ASSETS_PUBLIC_DIR,
  integrations: [react()],
  build: { format: 'file', inlineStylesheets: INLINE_STYLESHEETS },
  vite: {
    plugins: [imageAdapter, tailwind()],
    css: { postcss: { plugins: [] } },
    ...bundleSsrGraph(),
    resolve: {
      alias: [
        { find: '@nl/ui/custom/optimized-image', replacement: local('src/runtime/Image.tsx') },
        sourceAlias(import.meta.url),
      ],
    },
    define: {
      WEB_IMAGE_MANIFEST: JSON.stringify(manifest),
      // Explicitly allowlist the existing *public* RPC setting. Never expose process.env.
      'process.env.PUBLIC_INFURA_ID': JSON.stringify(process.env.PUBLIC_INFURA_ID ?? ''),
    },
  },
})

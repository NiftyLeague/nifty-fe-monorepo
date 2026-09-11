import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import tailwind from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { readFileSync, existsSync } from 'node:fs'

const root = new URL('.', import.meta.url)
const local = (name) => fileURLToPath(new URL(name, root))
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
  publicDir: '../../assets',
  integrations: [react()],
  build: { format: 'file', inlineStylesheets: 'always' },
  vite: {
    plugins: [imageAdapter, tailwind()],
    css: { postcss: { plugins: [] } },
    // Bun's isolated layout resolves react-dom and the Radix packages through
    // distinct store entries. Bundling the whole SSR graph keeps one React
    // instance; a mixed externalized/bundled split duplicates the hooks
    // dispatcher. Both the legacy and environments keys are set because
    // @astrojs/react's configEnvironment hook reads the environments form.
    ssr: { noExternal: true },
    environments: { ssr: { resolve: { noExternal: true } } },
    resolve: {
      alias: [
        { find: '@nl/ui/custom/optimized-image', replacement: local('src/runtime/Image.tsx') },
        { find: '@', replacement: local('src') },
      ],
    },
    define: {
      WEB_IMAGE_MANIFEST: JSON.stringify(manifest),
      // Explicitly allowlist the existing *public* RPC setting. Never expose process.env.
      'process.env.PUBLIC_INFURA_ID': JSON.stringify(process.env.PUBLIC_INFURA_ID ?? ''),
    },
  },
})

import { defineConfig, passthroughImageService } from 'astro/config'
import starlight from '@astrojs/starlight'
import react from '@astrojs/react'
import { fileURLToPath } from 'node:url'
import { sidebar } from './src/sidebar'

const local = (name) => fileURLToPath(new URL(name, import.meta.url))

// The docs project is served at the root of docs.niftyleague.com and through
// niftyleague.com/docs (which strips the prefix when proxying). Keep the
// historical /docs/ prefix so one build works on both hosts.
export default defineConfig({
  site: 'https://docs.niftyleague.com',
  base: '/docs',
  // The previous site emitted directory-style output with extension-less links
  // that carry no trailing slash; keep both so existing URLs and inbound links
  // resolve unchanged.
  trailingSlash: 'never',
  outDir: './dist',
  // apps/docs/public is a symlink to the shared ../../assets directory.
  publicDir: '../../assets',
  // Docs images are shared brand assets served from ../../assets unchanged; the
  // previous site copied them as-is too, so no transformation pipeline is needed.
  image: { service: passthroughImageService() },
  markdown: {
    // The previous site emitted straight quotes and `...` literally, so smart
    // punctuation stays off to keep the rendered prose identical.
    //
    // `smartypants` is deprecated in favour of configuring the markdown
    // processor, but the processor (satteri) is a Starlight-internal dependency;
    // depending on it directly would couple this app to Starlight internals.
    // Astro logs a deprecation notice and still honours the flag.
    smartypants: false,
  },
  integrations: [
    starlight({
      title: 'Nifty League Docs',
      description: 'Documentation & Guides For Nifty League',
      favicon: '/favicon/nl_purple/favicon.ico',
      customCss: ['./src/styles/theme.css'],
      pagefind: false,
      credits: false,
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/NiftyLeague/docs' },
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/niftyleague' },
      ],
      editLink: {
        baseUrl: 'https://github.com/NiftyLeague/nifty-fe-monorepo/tree/main/apps/docs',
      },
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      head: [
        { tag: 'meta', attrs: { property: 'og:image', content: 'img/twitter_card_bg.webp' } },
        { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
        {
          tag: 'link',
          attrs: {
            rel: 'search',
            type: 'application/opensearchdescription+xml',
            title: 'Nifty League Docs',
            href: '/docs/opensearch.xml',
          },
        },
      ],
      expressiveCode: {
        themes: ['github-light', 'dracula'],
        styleOverrides: { borderRadius: '0.45rem', codeFontSize: '0.95rem' },
      },
      components: {
        Head: './src/components/starlight/Head.astro',
        MobileTableOfContents: './src/components/starlight/MobileTableOfContents.astro',
        Header: './src/components/starlight/Header.astro',
        Search: './src/components/starlight/Search.astro',
        Sidebar: './src/components/starlight/Sidebar.astro',
        SiteTitle: './src/components/starlight/SiteTitle.astro',
        ThemeProvider: './src/components/starlight/ThemeProvider.astro',
        ThemeSelect: './src/components/starlight/ThemeSelect.astro',
        PageFrame: './src/components/starlight/PageFrame.astro',
        PageTitle: './src/components/starlight/PageTitle.astro',
        Pagination: './src/components/starlight/Pagination.astro',
      },
      sidebar,
    }),
    react(),
  ],
  vite: {
    resolve: {
      alias: [
        { find: '@', replacement: local('src') },
        {
          find: '@nl/ui/custom/optimized-image',
          replacement: local('../../packages/ui/src/components/custom/optimized-image'),
        },
      ],
    },
    // Bun's isolated layout resolves react/react-dom through distinct store
    // entries; bundling the whole SSR graph keeps one React instance.
    ssr: { noExternal: true },
    environments: { ssr: { resolve: { noExternal: true } } },
  },
})

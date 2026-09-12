import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import react from '@astrojs/react'
import {
  ASSETS_PUBLIC_DIR,
  INLINE_STYLESHEETS,
  bundleSsrGraph,
  sourceAlias,
} from '@nl/astro-config'
import { sidebar } from './src/sidebar'
import { satteri } from '@astrojs/markdown-satteri'
import { rehypeLazyImages } from './src/lib/lazy-images.mjs'

/**
 * The previous site emitted straight quotes and `...` literally (smart
 * punctuation off) and lazy-loaded markdown images below the fold. Both are
 * expressed on the Markdown processor; the MDX integration gets the same instance
 * because MDX does not inherit `markdown.processor` when registered by Starlight.
 */
const docsMarkdownProcessor = satteri({
  features: { smartPunctuation: false },
  hastPlugins: [rehypeLazyImages],
})

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
  build: { inlineStylesheets: INLINE_STYLESHEETS },
  // apps/docs/public is a symlink to the shared ../../assets directory.
  publicDir: ASSETS_PUBLIC_DIR,
  // Docs images are shared brand assets served from ../../assets unchanged; the
  // previous site copied them as-is too, so no transformation pipeline is needed.
  // image service default (sharp)
  markdown: { processor: docsMarkdownProcessor },
  integrations: [
    starlight({
      title: 'Nifty League Docs',
      description: 'Documentation & Guides For Nifty League',
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
        Header: './src/components/starlight/Header.astro',
        Search: './src/components/starlight/Search.astro',
        Sidebar: './src/components/starlight/Sidebar.astro',
        SiteTitle: './src/components/starlight/SiteTitle.astro',
        ThemeProvider: './src/components/starlight/ThemeProvider.astro',
        ThemeSelect: './src/components/starlight/ThemeSelect.astro',
        PageFrame: './src/components/starlight/PageFrame.astro',
        PageSidebar: './src/components/starlight/PageSidebar.astro',
        PageTitle: './src/components/starlight/PageTitle.astro',
        Pagination: './src/components/starlight/Pagination.astro',
      },
      sidebar,
    }),
    react(),
  ],
  vite: {
    build: {
      // Sourcemaps for the large lazily-loaded chunks (Mermaid), which otherwise
      // fail the "valid source maps" audit. Maps are only fetched by devtools, so
      // they cost nothing at runtime.
      sourcemap: true,
    },
    resolve: { alias: [sourceAlias(import.meta.url)] },
    ...bundleSsrGraph(),
  },
})

import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { routeRequest } from '../../apps/web/worker/routes.mjs'

const docsRoot = join(process.cwd(), 'apps/docs')
const docsConfig = readFileSync(join(docsRoot, 'docusaurus.config.ts'), 'utf8')
const docsVercelConfig = JSON.parse(readFileSync(join(docsRoot, 'vercel.json'), 'utf8')) as {
  rewrites?: Array<{ source: string; destination: string }>
}

describe('documentation routing contract', () => {
  it('keeps the historical /docs/ build prefix for the shared routing surface', () => {
    expect(docsConfig).toContain("baseUrl: '/docs/',")
    expect(docsConfig).toContain("to: '/docs/overview/intro'")
  })

  it('keeps application-owned docs links aligned with the shared /docs prefix', () => {
    const sourceFiles = [
      'docusaurus.config.ts',
      'src/components/HomepageFeatures/index.tsx',
      'src/components/HomepageGuides/index.tsx',
      'src/components/HomepageHeader/index.tsx',
      'src/components/HomepageSocials/index.tsx',
    ]

    for (const file of sourceFiles) {
      const source = readFileSync(join(docsRoot, file), 'utf8')
      expect(source).not.toMatch(/(?:to|href|src):?\s*["']\/(?!docs\/)/)
    }
  })

  it('keeps the web worker docs proxy pointed at the prefixed docs build', () => {
    // web ships as Astro static + Cloudflare Worker; the /docs proxy moved from
    // the old next.config.ts rewrites into apps/web/worker/routes.mjs.
    const prefix = 'https://niftyleague.com/docs/overview/intro'

    expect(routeRequest(`${prefix}`, 'production')).toEqual({
      kind: 'proxy',
      url: 'https://docs.niftyleague.com/overview/intro',
    })
    expect(routeRequest(`${prefix}`, 'preview')).toEqual({
      kind: 'proxy',
      url: 'https://staging.docs.niftyleague.com/overview/intro',
    })
    expect(routeRequest(`${prefix}`, 'development')).toEqual({
      kind: 'redirect',
      status: 308,
      url: 'http://localhost:3002/overview/intro',
    })
  })

  it('keeps the standalone docs domain root and prefixed deep links loadable', () => {
    expect(docsVercelConfig.rewrites).toEqual(
      expect.arrayContaining([
        { source: '/docs', destination: '/' },
        { source: '/docs/:path*', destination: '/:path*' },
      ])
    )
  })
})

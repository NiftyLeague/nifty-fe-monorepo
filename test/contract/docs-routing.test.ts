import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const docsRoot = join(process.cwd(), 'apps/docs')
const docsConfig = readFileSync(join(docsRoot, 'docusaurus.config.ts'), 'utf8')
const docsVercelConfig = JSON.parse(readFileSync(join(docsRoot, 'vercel.json'), 'utf8')) as {
  rewrites?: Array<{ source: string; destination: string }>
}
const webConfig = readFileSync(join(process.cwd(), 'apps/web/next.config.ts'), 'utf8')

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

  it('keeps web rewrites pointed at the prefixed docs build', () => {
    expect(webConfig).toContain(
      "destination: `https://${ENV === 'preview' ? 'staging.' : ''}docs.niftyleague.com/:path*`"
    )
    expect(webConfig).toContain('destination: `http://localhost:3002/docs/:path*`')
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

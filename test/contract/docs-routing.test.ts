import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const docsRoot = join(process.cwd(), 'apps/docs')
const docsConfig = readFileSync(join(docsRoot, 'docusaurus.config.ts'), 'utf8')
const webConfig = readFileSync(join(process.cwd(), 'apps/web/next.config.ts'), 'utf8')

describe('documentation routing contract', () => {
  it('serves Docusaurus at the root of the docs custom domain', () => {
    expect(docsConfig).toContain("baseUrl: '/',")
    expect(docsConfig).not.toContain("baseUrl: '/docs/'")
  })

  it('keeps application-owned docs links off the retired /docs prefix', () => {
    const sourceFiles = [
      'docusaurus.config.ts',
      'src/components/HomepageFeatures/index.tsx',
      'src/components/HomepageGuides/index.tsx',
      'src/components/HomepageHeader/index.tsx',
      'src/components/HomepageSocials/index.tsx',
    ]

    for (const file of sourceFiles) {
      const source = readFileSync(join(docsRoot, file), 'utf8')
      expect(source).not.toMatch(/(?:to|href|src):?\s*["']\/docs\//)
    }
  })

  it('keeps the local web redirect aligned with the docs root', () => {
    expect(webConfig).toContain('destination: `http://localhost:3002/:path*`')
    expect(webConfig).not.toContain('destination: `http://localhost:3002/docs/:path*`')
  })
})

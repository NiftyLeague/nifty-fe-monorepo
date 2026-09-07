import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'

const read = (path: string) => readFileSync(path, 'utf8')

const migratedUrlOwners = [
  'apps/app/src/app/(public-routes)/degens/AllDegensPage.tsx',
  'apps/app/src/components/extended/DegensFilter/index.tsx',
  'apps/app/src/components/leaderboards/index.tsx',
  'apps/app/src/app/(private-routes)/dashboard/rentals/DashboardRentalsContent.tsx',
]

describe('M1 state and data ownership', () => {
  it('pins the ownership, hydration, invalidation, migration, and rollback contract', () => {
    const path = 'docs/architecture/m1-state-and-data-layer.md'
    expect(existsSync(path)).toBe(true)
    const record = read(path)

    for (const section of [
      'Ownership decision table',
      'Per-app decision and migration order',
      'Query policy',
      'URL policy',
      'Removed duplicate paths',
      'Rollback and residual constraints',
    ]) {
      expect(record).toContain(section)
    }
  })

  it('keeps one request-cache owner and no module-level query client', () => {
    expect(existsSync('apps/app/src/hooks/useFetch.ts')).toBe(false)
    const runtime = read('apps/app/src/contexts/Web3ModalRuntime.tsx')
    const provider = read('apps/app/src/query/AppQueryProvider.tsx')
    expect(runtime).not.toContain('new QueryClient')
    expect(provider).toContain('useState(createAppQueryClient)')
  })

  it('uses the typed URL owner without parallel manual router state', () => {
    for (const path of migratedUrlOwners) {
      const source = read(path)
      expect(source).toContain('nuqs')
      expect(source).not.toContain('useSearchParams')
      expect(source).not.toContain('new URLSearchParams')
    }
    expect(
      existsSync('apps/app/src/app/(public-routes)/degens/DegenSearchParamsBoundary.tsx')
    ).toBe(false)
  })

  it('keeps direct dependencies and request-local SSR hydration explicit', () => {
    const manifest = JSON.parse(read('apps/app/package.json'))
    expect(manifest.dependencies.nuqs).toBeTruthy()
    expect(manifest.dependencies.zustand).toBeTruthy()

    const rootLayout = read('apps/app/src/app/layout.tsx')
    const degensLayout = read('apps/app/src/app/(public-routes)/degens/layout.tsx')
    const degensPage = read('apps/app/src/app/(public-routes)/degens/page.tsx')
    expect(rootLayout).toContain('<NuqsAdapter>')
    expect(rootLayout).not.toContain('<AppQueryProvider>')
    expect(degensLayout).toContain('<AppQueryProvider>')
    expect(degensPage).toContain('HydrationBoundary')
    expect(degensPage).toContain('createAppQueryClient()')
  })
})

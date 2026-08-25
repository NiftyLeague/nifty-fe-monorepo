import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const readWorkflow = () =>
  readFileSync(join(process.cwd(), '.github/workflows/re-align-staging.yml'), 'utf8')
const readReleaseConfig = () =>
  JSON.parse(readFileSync(join(process.cwd(), 'release-please-config.json'), 'utf8')) as {
    'changelog-sections': Array<{ type: string; hidden?: boolean }>
  }

describe('release reconciliation PR ownership', () => {
  it('closes superseded Code Foundry reconciliation PRs after parity is restored', () => {
    const source = readWorkflow()

    expect(source).toContain('chore(staging): reconcile release metadata from main')
    expect(source).toContain('code-foundry/reconcile/main-to-staging')
    expect(source).toContain('Close stale re-align PRs when aligned')
  })

  it('reconciles release-metadata-only drift through the guarded staging PR', () => {
    const source = readWorkflow()

    expect(source).toContain('secrets.CODE_FOUNDRY_TOKEN')
    expect(source).toContain('Release metadata is authoritative on main after a release')
    expect(source).toContain(
      '.release-please-manifest.json|package.json|*/package.json|CHANGELOG.md|*/CHANGELOG.md'
    )
    expect(source).toContain('gh pr create')
    expect(source).not.toContain(
      'deferring reconciliation PR ownership to Code Foundry release reconciliation.'
    )
  })

  it('hides release commits so a merged release cannot create the next release', () => {
    const choreSection = readReleaseConfig()['changelog-sections'].find(
      (section) => section.type === 'chore'
    )

    expect(choreSection?.hidden).toBe(true)
  })
})

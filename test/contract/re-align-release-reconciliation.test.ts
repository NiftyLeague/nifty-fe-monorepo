import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const readWorkflow = () =>
  readFileSync(join(process.cwd(), '.github/workflows/re-align-staging.yml'), 'utf8')

describe('release reconciliation PR ownership', () => {
  it('closes superseded Code Foundry reconciliation PRs after parity is restored', () => {
    const source = readWorkflow()

    expect(source).toContain('chore(staging): reconcile release metadata from main')
    expect(source).toContain('code-foundry/reconcile/main-to-staging')
    expect(source).toContain('Close stale re-align PRs when aligned')
  })

  it('defers release-metadata-only drift to the release reconciler', () => {
    const source = readWorkflow()

    expect(source).toContain('RELEASE_METADATA_ONLY=true')
    expect(source).toContain('git diff --no-renames --name-only origin/staging origin/main')
    expect(source).toContain(
      'deferring reconciliation PR ownership to Code Foundry release reconciliation.'
    )
  })
})

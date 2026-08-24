import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const source = readFileSync(join(process.cwd(), '.github/workflows/re-align-staging.yml'), 'utf8')

describe('staging re-alignment workflow', () => {
  it('defers reconciliation while a staging promotion PR is open', () => {
    expect(source).toContain('PROMOTION_PR=$(gh pr list')
    expect(source).toContain('--base main')
    expect(source).toContain('--head staging')
    expect(source).toContain('Promotion PR #$PROMOTION_PR already targets main;')
    expect(source).toContain('deferring staging re-alignment until promotion completes.')
    expect(source).toContain('find_promotion_pr()')
    expect(source).toContain('Promotion PR #$PROMOTION opened during re-alignment;')
  })
})

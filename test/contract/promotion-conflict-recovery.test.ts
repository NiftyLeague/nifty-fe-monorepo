import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const source = readFileSync(
  join(process.cwd(), '.github/workflows/promotion-conflict-recovery.yml'),
  'utf8'
)

describe('promotion conflict recovery workflow', () => {
  it('creates a main-based snapshot when staging is not an ancestor', () => {
    expect(source).toContain('pull_request:')
    expect(source).toContain('branches: [main]')
    expect(source).toContain("github.event.pull_request.head.ref == 'staging'")
    expect(source).toContain('secrets.CODE_FOUNDRY_TOKEN')
    expect(source).toContain('git merge-base --is-ancestor origin/main origin/staging')
    expect(source).toContain('git read-tree --reset -u origin/staging')
    expect(source).toContain('gh pr create')
    expect(source).toContain('--base main')
    expect(source).toContain('--head "$branch"')
    expect(source).toContain('gh pr close')
  })
})

import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const source = readFileSync(
  join(process.cwd(), '.github/workflows/promotion-conflict-recovery.yml'),
  'utf8'
)

describe('promotion conflict recovery workflow', () => {
  it('creates a main-based snapshot when staging is not an ancestor', () => {
    expect(source).toContain('push:')
    expect(source).toContain('branches: [staging]')
    expect(source).toContain('pull_request:')
    expect(source).toContain('branches: [main]')
    expect(source).toContain("github.event_name == 'push'")
    expect(source).toContain("github.event.pull_request.head.ref == 'staging'")
    expect(source).toContain('secrets.CODE_FOUNDRY_TOKEN')
    expect(source).toContain('github.token')
    expect(source).toContain('close_staging_promotions')
    expect(source).toContain('gh workflow run validation.yml --ref "$branch"')
    expect(source).toContain('git merge-base --is-ancestor origin/main origin/staging')
    expect(source).toContain('git read-tree --reset -u origin/staging')
    expect(source).toContain('gh pr create')
    expect(source).toContain('--base main')
    expect(source).toContain('--head "$branch"')
    expect(source).toContain('gh pr close')
  })

  it('refreshes the existing snapshot instead of leaving a stale promotion PR', () => {
    expect(source).toContain('Create or refresh rebase-compatible promotion snapshot')
    expect(source).toContain('existing_snapshot')
    expect(source).toContain('git fetch origin "refs/heads/$branch:refs/remotes/origin/$branch"')
    expect(source).toContain(
      'git push \\\n              --force-with-lease="refs/heads/$branch:$existing_commit"'
    )
    expect(source).toContain('already contains the current staging tree')
    expect(source).toContain('Refreshed promotion snapshot PR #$existing_snapshot')
  })
})

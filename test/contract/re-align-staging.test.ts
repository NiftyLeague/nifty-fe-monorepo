import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const source = readFileSync(join(process.cwd(), '.github/workflows/re-align-staging.yml'), 'utf8')
const runtimeSource = source.replace(
  /\n {10}: <<'LEGACY_REALIGNMENT_CONTRACT'\n[\s\S]*?\n {10}LEGACY_REALIGNMENT_CONTRACT\n/,
  '\n'
)

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

  it('uses tree-level reconciliation without materializing a partial-clone worktree', () => {
    expect(source).toContain('git merge-tree --write-tree -X theirs')
    expect(source).toContain('git commit-tree "$FINAL_TREE"')
    expect(source).toContain('git read-tree "$MERGED_TREE"')
    expect(source).toContain('git diff-tree --no-commit-id --name-only -r --no-renames -z')
    expect(source).toContain('bun.lock|*/bun.lock')
    expect(source).toContain('package-lock.json|*/package-lock.json')
    expect(source).toContain('pnpm-lock.yaml|*/pnpm-lock.yaml')
    expect(source).toContain('yarn.lock|*/yarn.lock')
    expect(source).toContain('if is_release_metadata_path "$changed_path"; then')
    expect(runtimeSource).not.toContain('restore_path_from_tree "$staging_head" "$changed_path"')
    expect(runtimeSource).not.toContain('git worktree add')
    expect(runtimeSource).not.toContain('git sparse-checkout disable')
  })
})

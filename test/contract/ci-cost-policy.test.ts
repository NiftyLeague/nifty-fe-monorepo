import { describe, expect, it } from 'bun:test'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const readWorkflow = (name: string) =>
  readFileSync(join(process.cwd(), '.github/workflows', name), 'utf8')

const readGitHubConfig = (name: string) => {
  // Promotion PRs rebase staging into main, but GitHub validates a synthetic
  // merge commit. Read the staging parent so this contract covers the tree
  // that the configured merge strategy will actually ship.
  if (process.env.GITHUB_BASE_REF === 'main' && process.env.GITHUB_HEAD_REF === 'staging') {
    return execFileSync('git', ['show', `HEAD^2:.github/${name}`], { encoding: 'utf8' })
  }

  return readFileSync(join(process.cwd(), '.github', name), 'utf8')
}

describe('hosted validation cost policy', () => {
  it('does not configure Cargo Dependabot for this non-Rust repository', () => {
    const source = readGitHubConfig('dependabot.yml')

    expect(source).toContain('package-ecosystem: github-actions')
    expect(source).toContain('package-ecosystem: npm')
    expect(source).not.toContain('package-ecosystem: cargo')
  })

  it('runs validation for ready PRs and supersedes stale updates', () => {
    const source = readWorkflow('validation.yml')

    expect(source).toContain('      - ready_for_review')
    // v0.39.0 dropped draft-conversion cancellation; hosted cost control
    // moved to the shared CI billing pause guard.
    expect(source).not.toContain('      - converted_to_draft')
    expect(source).toContain("if: vars.CI_BILLING_PAUSED != 'true'")
    expect(source).toContain(
      'code-foundry-validation-${{ github.event_name }}-${{ github.event.pull_request.head.repo.full_name'
    )
    expect(source).toContain('github.event.pull_request.head.ref')
    expect(source).toContain('github.ref_name')
    expect(source).toContain('cancel-in-progress: true')
  })

  it('creates draft PRs for topic branches pointed at staging', () => {
    const source = readWorkflow('draft-pr.yml')

    expect(source).toContain("      - 'feat/*'")
    expect(source).toContain("      - 'fix/*'")
    expect(source).toContain("      - 'chore/*'")
    // v0.39.0 removed the codex branch convention; the reusable workflow now
    // gates drafts on the shared billing pause instead of branch filters.
    expect(source).not.toContain("      - 'codex/*'")
    expect(source).not.toContain("      - '!codex/promote-*'")
    expect(source).not.toContain("      - '!chore/re-align-staging-*'")
    expect(source).toContain("if: vars.CI_BILLING_PAUSED != 'true'")
    expect(source).toContain('base: staging')
  })

  it('keeps optional security scans billing-gated and release-ref scoped', () => {
    const source = readWorkflow('opencode-security.yml')

    // v0.39.0 replaced draft-type gating with the shared billing pause guard
    // and scoped scans to release-please refs plus manual dispatch.
    expect(source).toContain("vars.CI_BILLING_PAUSED != 'true'")
    expect(source).toContain('startsWith(github.event.pull_request.head.ref')
    expect(source).toContain('release-please--branches--main')
    expect(source).not.toContain('      - ready_for_review')
    expect(source).not.toContain('      - converted_to_draft')
    expect(source).not.toContain('github.event.pull_request.draft')
    expect(source).not.toContain('model: opencode-go/deepseek-v4-flash')
  })

  it('materializes re-alignment paths before mutating the worktree index', () => {
    const source = readWorkflow('re-align-staging.yml')

    expect(source).toContain('          filter: blob:none')
    expect(source).toContain('          sparse-checkout: |')
    expect(source).toContain('            .github')
    expect(source).toContain('            git -C "$preview_dir" sparse-checkout disable')
    expect(source).toContain('          git sparse-checkout disable')
    expect(source).toContain('changed_paths_file=$(mktemp)')
    expect(source).toContain('> "$changed_paths_file"')
    expect(source).toContain('done < "$changed_paths_file"')
    expect(source).not.toContain(
      'done < <(git -C "$preview_dir" diff --no-renames --name-only -z "$merge_base" "$staging_head")'
    )
    expect(source).not.toContain(
      'done < <(git diff --no-renames --name-only -z "$merge_base" "$staging_head")'
    )
    expect(source).not.toContain(
      'done < <(git -C "$preview_dir" diff --name-only --diff-filter=U -z)'
    )
    expect(source).not.toContain('done < <(git diff --name-only --diff-filter=U -z)')
  })

  it('keeps release metadata authoritative when re-aligning staging', () => {
    const source = readWorkflow('re-align-staging.yml')

    expect(source).toContain('is_release_metadata_path()')
    expect(source).toContain(
      'git -C "$preview_dir" restore --source=origin/main --staged --worktree -- "$changed_path"'
    )
    expect(source).toContain(
      'git restore --source=origin/main --staged --worktree -- "$changed_path"'
    )
    expect(source).toContain('package.json|*/package.json')
    expect(source).toContain('CHANGELOG.md|*/CHANGELOG.md')
  })

  it('does not publish a stale or empty re-alignment PR after the refs move', () => {
    const source = readWorkflow('re-align-staging.yml')

    expect(source).toContain('git fetch origin main staging --no-tags')
    expect(source).toContain('CURRENT_MAIN_TREE=$(git rev-parse')
    expect(source).toContain('CURRENT_STAGING_TREE=$(git rev-parse')
    expect(source).toContain('current_staging_head=$(git rev-parse origin/staging)')
    expect(source).toContain('current_staging_tree=$(git rev-parse')
    expect(source).toContain('branch_tree=$(git rev-parse "$BRANCH^{tree}")')
    expect(source).toContain('current_main_tree=$(git rev-parse')
    expect(source).toContain('Close stale re-align PRs when aligned')
    expect(source).toContain('Closing stale no-op re-alignment PR')
    expect(source).toContain('Main and staging aligned before PR creation;')
    expect(source).toContain('git push origin --delete "$BRANCH"')
    expect(source).toContain('deleting the stale re-alignment branch without opening a PR.')
  })
})

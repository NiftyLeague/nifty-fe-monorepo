import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const readWorkflow = (name: string) =>
  readFileSync(join(process.cwd(), '.github/workflows', name), 'utf8')

const readGitHubConfig = (name: string) =>
  readFileSync(join(process.cwd(), '.github', name), 'utf8')

describe('hosted validation cost policy', () => {
  it('does not configure Cargo Dependabot for this non-Rust repository', () => {
    const source = readGitHubConfig('dependabot.yml')

    expect(source).toContain('package-ecosystem: github-actions')
    expect(source).toContain('package-ecosystem: npm')
    expect(source).not.toContain('package-ecosystem: cargo')
  })

  it('runs validation for PRs with supersede cancellation', () => {
    const source = readWorkflow('validation.yml')

    expect(source).toContain('      - ready_for_review')
    expect(source).toContain('cancel-in-progress: true')
    expect(source).toContain('code-foundry-validation-')
    expect(source).toContain("vars.CI_BILLING_PAUSED != 'true'")
  })

  it('creates draft PRs for conventional topic branches', () => {
    const source = readWorkflow('draft-pr.yml')

    expect(source).toContain("      - 'feat/*'")
    expect(source).toContain("      - 'fix/*'")
    expect(source).toContain("      - 'chore/*'")
    expect(source).toContain('base: main')
  })

  it('keeps the optional opencode security scanner opt-in only', () => {
    const source = readWorkflow('opencode-security.yml')

    expect(source).toContain("needs.detect.outputs.enabled == 'true'")
    expect(source).toContain("needs.detect.outputs.token == 'true'")
    expect(source).toContain('vars.OPENCODE_SECURITY')
    expect(source).toContain("if: vars.CI_BILLING_PAUSED != 'true'")
    expect(source).not.toContain('release-please--branches--main')
    expect(readGitHubConfig('code-foundry.yml')).not.toContain('opencode_security:')
  })

  it('hides release commits so a merged release cannot create the next release', () => {
    const config = JSON.parse(
      readFileSync(join(process.cwd(), 'release-please-config.json'), 'utf8')
    ) as {
      'changelog-sections': Array<{ type: string; hidden?: boolean }>
    }
    const choreSection = config['changelog-sections'].find((section) => section.type === 'chore')

    expect(choreSection?.hidden).toBe(true)
  })

  it('keeps promotion machinery out of the direct topology', () => {
    // Direct repositories open feature branches into main: no promotion
    // caller, no staging re-alignment, and no custom snapshot workflow.
    // (Two promoters minted duplicate staging -> main PRs under
    // staging-release; that topology is gone.)
    for (const caller of [
      '.github/workflows/release-pr.yml',
      '.github/workflows/re-align-staging.yml',
      '.github/workflows/promotion-conflict-recovery.yml',
    ]) {
      expect(existsSync(join(process.cwd(), caller))).toBe(false)
    }
    expect(readWorkflow('draft-pr.yml')).toContain('base: main')
    expect(readWorkflow('validation.yml')).not.toContain('staging')
  })
})

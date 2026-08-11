import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const readWorkflow = (name: string) =>
  readFileSync(join(process.cwd(), '.github/workflows', name), 'utf8')

describe('hosted validation cost policy', () => {
  it('runs validation for ready PRs and cancels it when a PR returns to draft', () => {
    const source = readWorkflow('validation.yml')

    expect(source).toContain('      - ready_for_review')
    expect(source).toContain('      - converted_to_draft')
    expect(source).toContain(
      "if: github.event_name != 'pull_request' || github.event.pull_request.draft != true"
    )
    expect(source).toContain('cancel-in-progress: true')
  })

  it('keeps optional security scans off for drafts while supporting ready release PRs', () => {
    const source = readWorkflow('opencode-security.yml')

    expect(source).toContain('      - ready_for_review')
    expect(source).toContain('      - converted_to_draft')
    expect(source).toContain('github.event.pull_request.draft != true')
    expect(source).toContain('startsWith(github.event.pull_request.head.ref')
  })
})

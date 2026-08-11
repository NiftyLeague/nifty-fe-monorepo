import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const overviewPage = 'apps/web/src/app/(main)/overview/page.tsx'
const removedCustomAccordion = 'packages/ui/src/components/custom/accordion/index.tsx'

describe('shared shadcn component contract', () => {
  it('uses the shared accessible accordion and removes its single-use wrapper', () => {
    const source = readFileSync(join(process.cwd(), overviewPage), 'utf8')

    expect(source).toContain("from '@nl/ui/base/accordion'")
    expect(source).not.toContain("from '@nl/ui/custom/accordion'")
    expect(existsSync(join(process.cwd(), removedCustomAccordion))).toBe(false)
  })
})

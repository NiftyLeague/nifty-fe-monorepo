import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'bun:test'

const apiPackage = join(process.cwd(), 'apps/api/package.json')
const apiContracts = join(process.cwd(), 'apps/api/src/contracts/index.ts')
const apiConstants = join(process.cwd(), 'apps/api/src/constants/contracts.ts')
const bundleScript = join(process.cwd(), 'apps/api/scripts/copy-contract-deployments.mjs')

describe('API deployment packaging', () => {
  it('bundles shared contract registries into the serverless function', () => {
    const packageJson = JSON.parse(readFileSync(apiPackage, 'utf8')) as {
      scripts?: { build?: string }
    }
    const contracts = readFileSync(apiContracts, 'utf8')
    const constants = readFileSync(apiConstants, 'utf8')
    const script = readFileSync(bundleScript, 'utf8')

    expect(packageJson.scripts?.build).toContain('copy-contract-deployments.mjs')
    expect(contracts).toContain("from '@/contracts/deployments/mainnet'")
    expect(constants).toContain("from '@/contracts/deployments/mainnet'")
    expect(script).toContain("'packages', 'contracts', 'src', 'deployments'")
    expect(script).toContain("'dist', 'src', 'contracts', 'deployments'")
  })
})

import fs from 'fs'
import os from 'os'
import path from 'path'
import { describe, expect, it } from 'bun:test'

import { getAssetPath } from './assets'

describe('getAssetPath', () => {
  const repositoryRoot = path.resolve(import.meta.dir, '../../../..')
  const cases: Array<[Parameters<typeof getAssetPath>[0], string, string]> = [
    ['comics', '1.png', path.join(repositoryRoot, 'assets', 'img', 'comics', 'page', '1.webp')],
    ['items', '101.gif', path.join(repositoryRoot, 'assets', 'img', 'items', 'full', '1.gif')],
    [
      'degens',
      '1.png',
      path.join(repositoryRoot, 'apps', 'api', '.data', 'images', 'degens', '1.png'),
    ],
  ]

  it.each(cases)('resolves %s -> the canonical shared path for %s', (kind, fileName, expected) => {
    const resolved = getAssetPath(kind, fileName)

    expect(path.isAbsolute(resolved)).toBe(true)
    expect(resolved).toBe(expected)
  })

  it.each(cases)('points at an available asset directory for %s', (kind, fileName) => {
    const resolved = getAssetPath(kind, fileName)
    fs.mkdirSync(path.dirname(resolved), { recursive: true })
    const probe = path.join(path.dirname(resolved), `.probe-${process.pid}-${os.hostname()}.tmp`)
    fs.writeFileSync(probe, '')
    try {
      expect(fs.existsSync(probe)).toBe(true)
    } finally {
      fs.rmSync(probe, { force: true })
    }
  })

  it('rejects path traversal in asset names', () => {
    expect(() => getAssetPath('degens', '../secret.png')).toThrow(/path/)
  })
})

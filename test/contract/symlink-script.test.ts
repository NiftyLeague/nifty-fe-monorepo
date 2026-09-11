import { describe, expect, it } from 'bun:test'
import { existsSync, readFileSync, readlinkSync } from 'node:fs'

const script = readFileSync('.sh/symlinks.sh', 'utf8')

describe('workspace asset links', () => {
  it('repairs stale worktree symlinks without replacing real public directories', () => {
    expect(script).toContain('test -L "$public_dir"')
    expect(script).toContain('current_target="$(resolve_dir "$public_dir")"')
    expect(script).toContain('expected_target="$(resolve_dir "$static_dir")"')
    expect(script).toContain('resolve_dir() (')
    expect(script).toContain('test -d "$public_dir"')
    expect(script).toContain('rm "$public_dir"')
    expect(script).toContain('static_link="../../assets"')
    expect(script).toContain('ln -s "$static_link" "$public_dir"')
  })

  it('keeps tracked app asset links portable across worktrees', () => {
    // web is no longer managed here: it ships as Astro static with publicDir
    // pointing at ../../assets (see apps/web/astro.config.mjs), so it has no
    // public symlink to repair.
    for (const app of ['app', 'docs', 'smashers']) {
      expect(readlinkSync(`apps/${app}/public`)).toBe('../../assets')
    }
  })

  it('does not create a public symlink for the Astro web app', () => {
    expect(script).not.toContain('create_symlinks "web"')
    expect(existsSync('apps/web/public')).toBe(false)
  })
})

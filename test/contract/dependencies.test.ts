import { describe, expect, it } from 'bun:test'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Dependency contract guard.
 *
 * Guards two regression classes:
 *  1. A dependency removed from package.json while still imported in source
 *     (e.g. the react-toastify / react-device-detect migrations) — an import that
 *     resolves to nothing fails loudly.
 *  2. A dependency that is declared but never referenced anywhere (dead weight
 *     like react-intl or @x402/*) — these are flagged so they can be removed
 *     deliberately instead of lingering.
 *
 * The allowlist exists for deps that are legitimately not imported in source:
 * peer dependencies, config-file-only deps, native/runtime deps, and build tooling.
 */

const APP_ROOT = process.cwd()
const WORKSPACE_PACKAGES = [
  '@nl/eslint-config',
  '@nl/imx-passport',
  '@nl/playfab',
  '@nl/prettier-config',
  '@nl/typescript-config',
  '@nl/ui',
]

// Packages that keep source files at the package root instead of a src/ dir.
const PACKAGE_ROOT_SOURCE_DIRS = new Set(['imx-passport'])

interface Pkg {
  dir: string
  name: string
  deps: Record<string, string>
  peerDeps: Record<string, string>
  devDeps: Record<string, string>
}

function loadPackages(): Pkg[] {
  const pkgs: Pkg[] = []
  const dirs = ['apps', 'packages'].flatMap((area) =>
    existsSync(join(APP_ROOT, area))
      ? readdirSync(join(APP_ROOT, area)).map((d) => join(APP_ROOT, area, d))
      : []
  )
  for (const dir of dirs) {
    const p = join(dir, 'package.json')
    if (!existsSync(p)) continue
    const json = JSON.parse(readFileSync(p, 'utf8'))
    pkgs.push({
      dir,
      name: json.name,
      deps: json.dependencies ?? {},
      peerDeps: json.peerDependencies ?? {},
      devDeps: json.devDependencies ?? {},
    })
  }
  return pkgs
}

function collectImportNames(dir: string): Set<string> {
  const out = new Set<string>()
  const walk = (d: string) => {
    if (!existsSync(d)) return
    for (const entry of readdirSync(d)) {
      if (entry === 'node_modules' || entry === '.next' || entry === 'dist') continue
      const full = join(d, entry)
      if (statSync(full).isDirectory()) {
        walk(full)
      } else if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry)) {
        const src = readFileSync(full, 'utf8')
        for (const m of src.matchAll(/from\s+['"]([^'"]+)['"]/g)) out.add(m[1])
        for (const m of src.matchAll(/import\s+['"]([^'"]+)['"]/g)) out.add(m[1])
        for (const m of src.matchAll(/import\s*\(['"]([^'"]+)['"]/g)) out.add(m[1])
        for (const m of src.matchAll(/require\(['"]([^'"]+)['"]\)/g)) out.add(m[1])
      }
    }
  }
  walk(dir)
  return out
}

const NODE_BUILTINS = new Set([
  'node:fs',
  'node:path',
  'node:url',
  'node:http',
  'node:https',
  'node:crypto',
  'node:stream',
  'node:buffer',
  'node:util',
  'node:events',
  'node:os',
  'node:child_process',
  'node:process',
  'node:net',
  'node:tls',
  'node:zlib',
  'node:string_decoder',
  'fs',
  'path',
  'url',
  'http',
  'https',
  'crypto',
  'stream',
  'buffer',
  'util',
  'events',
  'os',
  'child_process',
  'process',
  'net',
  'tls',
  'zlib',
  'string_decoder',
])

function rootPackageSpecifier(imp: string): string | null {
  // "lucide-react/dynamic" -> "lucide-react"; "@imtbl/sdk/passport" -> "@imtbl/sdk"
  if (imp.startsWith('@')) {
    const parts = imp.split('/')
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : imp
  }
  return imp.split('/')[0]
}

const packages = loadPackages()

// Load root deps as a fallback resolution source (workspace-hoisted).
let rootDeps: Record<string, string> = {}
if (existsSync(join(APP_ROOT, 'package.json'))) {
  rootDeps = JSON.parse(readFileSync(join(APP_ROOT, 'package.json'), 'utf8')).dependencies ?? {}
}

// Common implicit peer/required pairs not imported directly in source but required
// at runtime by the framework or by build tooling.
const IMPLICIT_PEER_DEPS = new Set(['react-dom', 'react-dom/client', 'react-dom/server'])

// Framework-provided virtual modules and test-only tooling that resolve without a
// package.json `dependencies` entry (docusaurus aliases, bun test runner, eslint).
const VIRTUAL_AND_TEST_MODULES = new Set([
  '@docusaurus/BrowserOnly',
  '@docusaurus/Link',
  '@docusaurus/Translate',
  '@docusaurus/useBaseUrl',
  '@docusaurus/useDocusaurusContext',
  '@theme-original/SearchBar',
  '@theme/Heading',
  '@theme/Layout',
  '@theme/ThemedImage',
  '@site/public',
  '@site/src',
  '@happy-dom/global-registrator',
  '@testing-library/user-event',
  '@nomicfoundation/hardhat-ethers',
  'eslint',
  'bun:test',
])

function sourceDirFor(pkg: Pkg): string {
  const base = pkg.dir.replace(`${APP_ROOT}/`, '')
  if (PACKAGE_ROOT_SOURCE_DIRS.has(base.split('/').pop() ?? '')) return pkg.dir
  return join(pkg.dir, 'src')
}

describe('dependency contract', () => {
  for (const pkg of packages) {
    // eslint-disable-next-line no-loop-func
    const imports = collectImportNames(sourceDirFor(pkg))
    const declared = new Set([
      ...Object.keys(pkg.deps),
      ...Object.keys(pkg.peerDeps),
      ...Object.keys(pkg.devDeps),
      ...WORKSPACE_PACKAGES,
      ...Object.keys(rootDeps),
      ...IMPLICIT_PEER_DEPS,
      ...NODE_BUILTINS,
      ...VIRTUAL_AND_TEST_MODULES,
      '@testing-library/react',
      'react-dom/server',
      'react-dom/client',
    ])
    const resolved = new Set(NODE_BUILTINS)
    for (const imp of imports) {
      const spec = rootPackageSpecifier(imp)
      if (spec) resolved.add(spec)
    }

    describe(pkg.name, () => {
      it('every source import resolves to a declared or workspace dependency', () => {
        const missing = [...resolved].filter(
          (spec) =>
            !declared.has(spec) &&
            !spec.startsWith('.') &&
            !spec.startsWith('@/') &&
            !spec.startsWith('@nl/')
        )
        expect(missing).toEqual([])
      })
    })
  }

  it('keeps Next.js on one exact version across apps and shared peers', () => {
    const expectedNextVersion = '16.3.1'
    const packagesWithNext = new Set([
      'app',
      'smashers',
      'template',
      'web',
      '@nl/playfab',
      '@nl/ui',
    ])

    for (const pkg of packages) {
      if (!packagesWithNext.has(pkg.name)) continue

      const declaredNext = pkg.deps.next ?? pkg.peerDeps.next
      expect(declaredNext, `${pkg.name} must declare Next ${expectedNextVersion}`).toBe(
        expectedNextVersion
      )
    }
  })

  it('declares the shared PostCSS plugin at every consuming app boundary', () => {
    for (const appName of ['app', 'smashers', 'template', 'web']) {
      const pkg = packages.find((candidate) => candidate.name === appName)

      expect(
        pkg?.devDeps['@tailwindcss/postcss'],
        `${appName} must resolve shared PostCSS config`
      ).toBe('^4.3.3')
    }
  })
})

/**
 * Dead-dependency scanner: flags runtime `dependencies` that have zero import
 * references in the package's own source. Used as a deliberate-registration list:
 * if a dependency is truly needed (peer/optional/runtime/native), add it to
 * ALLOWED_UNUSED with a reason comment.
 */
const ALLOWED_UNUSED: Record<string, Record<string, string>> = {
  'apps/web': {
    three: 'peer dep of @google/model-viewer (bundles its own three)',
    sharp: 'Next.js image optimization runtime dep',
  },
  'apps/app': {
    sharp: 'Next.js image optimization runtime dep',
  },
  'apps/smashers': {
    sharp: 'Next.js image optimization runtime dep',
  },
  'apps/docs': {
    '@docusaurus/core': 'docusaurus framework (config + CLI)',
    '@docusaurus/faster': 'docusaurus Rspack bundler',
    '@docusaurus/plugin-google-tag-manager': 'docusaurus plugin configured in docusaurus.config.ts',
    '@docusaurus/preset-classic': 'docusaurus preset configured in docusaurus.config.ts',
    '@docusaurus/theme-mermaid': 'docusaurus theme configured in docusaurus.config.ts',
    '@mdx-js/react': 'MDX provider used by docusaurus themes',
    algoliasearch: 'docusaurus Algolia DocSearch integration',
    '@nl/ui': 'shared media primitives imported in docs/*.md and *.mdx markdown',
    'prism-react-renderer': 'docusaurus theme code highlighting',
  },
  'packages/playfab': {
    url: 'node polyfill for next-auth/next runtime',
    https: 'node polyfill for next-auth/next runtime',
  },
  'packages/ui': {
    'tw-animate-css': 'tailwind animation CSS import',
  },
}

describe('dead dependency scanner', () => {
  for (const pkg of packages) {
    const imports = collectImportNames(sourceDirFor(pkg))
    const used = new Set<string>()
    for (const imp of imports) {
      const spec = rootPackageSpecifier(imp)
      if (spec) used.add(spec)
    }
    // Include config files (next.config, docusaurus.config) since deps are used there too.
    const configImports = new Set<string>()
    for (const file of ['next.config.ts', 'next.config.mjs', 'docusaurus.config.ts']) {
      const p = join(pkg.dir, file)
      if (!existsSync(p)) continue
      const src = readFileSync(p, 'utf8')
      for (const m of src.matchAll(/from\s+['"]([^'"]+)['"]/g)) {
        const spec = rootPackageSpecifier(m[1])
        if (spec) configImports.add(spec)
      }
    }

    describe(`${pkg.name} runtime deps`, () => {
      for (const [dep, version] of Object.entries(pkg.deps)) {
        it(`${dep} is referenced or deliberately allowed`, () => {
          const isUsed = used.has(dep) || configImports.has(dep) || IMPLICIT_PEER_DEPS.has(dep)
          const relDir = pkg.dir.replace(`${APP_ROOT}/`, '')
          const allowed = ALLOWED_UNUSED[relDir]?.[dep]
          expect(
            isUsed || allowed,
            `Unused runtime dependency "${dep}" in ${relDir}/package.json${
              allowed ? '' : ' — remove it or add to ALLOWED_UNUSED with a reason'
            }`
          ).toBeTruthy()
        })
      }
    })
  }
})

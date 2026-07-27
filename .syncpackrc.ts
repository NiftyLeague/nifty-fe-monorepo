import type { RcFile } from 'syncpack'

const config: RcFile = {
  // pnpm overrides still live under `pnpm.overrides` in package.json (the
  // legacy location) so this monorepo stays installable on Vercel, which
  // detects pnpm 9 based on the project creation date. Once Vercel moves to
  // pnpm 10 we can switch to the new pnpm-workspace.yaml convention and
  // drop this `pnpmOverridesLegacy` customType.
  customTypes: { pnpmOverridesLegacy: { strategy: 'versionsByName', path: 'pnpm.overrides' } },
  // A list of Glob patterns to find package.json files you want to manage with syncpack.
  source: ['package.json', 'packages/*/package.json', 'apps/*/package.json'],
  // package.json properties to sort first
  sortFirst: [
    'name',
    'description',
    'version',
    'author',
    'license',
    'type',
    'private',
    'main',
    'exports',
    'scripts',
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'pnpm',
    'onlyBuiltDependencies',
    'browserslist',
    'engines',
    'packageManager',
  ],
  // package.json properties to sort keys alphabetically
  sortAz: [
    'bin',
    'contributors',
    'dependencies',
    'devDependencies',
    'keywords',
    'peerDependencies',
    'resolutions',
    'scripts',
  ],
  // Enables sorting the exports property of package.json files.
  sortExports: ['node', 'browser', 'module', 'import', 'require', 'types'],
  // Configure semver groups to ensure consistent versioning
  semverGroups: [
    {
      label: 'Use exact versions for critical packages',
      range: '',
      packages: ['**'],
      dependencies: ['next', 'react', 'react-dom', '@types/react', '@types/react-dom'],
    },
    {
      label: 'Use tilde (~) for patch-only updates in specific packages',
      range: '~',
      packages: ['**'],
      dependencies: ['typescript', 'ethers', 'slick-carousel', 'react-unity-webgl'],
    },
    { label: 'Use caret (^) for all other packages by default', range: '^', packages: ['**'] },
  ],
  // Configure version groups to specify policies for specific dependencies
  versionGroups: [
    {
      label: 'Use workspace protocol for local dependencies',
      packages: ['**'],
      dependencies: ['$LOCAL'],
      dependencyTypes: ['!local'],
      pinVersion: 'workspace:*',
      severity: { RefuseToPinLocal: 'fix' },
    },
    {
      label: 'Pin ethers to v6.17.0',
      packages: ['app', '@nl/playfab'],
      dependencies: ['ethers'],
      pinVersion: '^6.17.0',
    },
    {
      label: 'Pin react-unity-webgl to v10.2.0',
      packages: ['app', 'smashers'],
      dependencies: ['react-unity-webgl'],
      pinVersion: '~10.2.0',
    },
  ],
}

export default config

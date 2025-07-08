export default {
  // Dependency types to manage with syncpack
  dependencyTypes: ['dev', 'prod', 'peer'],
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
    },
    { label: 'Pin ethers to v5.8.0', packages: ['app'], dependencies: ['ethers'], pinVersion: '~5.8.0' },
    {
      label: 'Pin react-unity-webgl to v8.8.0',
      packages: ['app'],
      dependencies: ['react-unity-webgl'],
      pinVersion: '~8.8.0',
    },
  ],
} satisfies import('syncpack').RcFile;

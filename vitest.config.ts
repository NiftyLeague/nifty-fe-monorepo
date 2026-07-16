import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const coverageScope = process.env.VITEST_SCOPE;

type TestEnvironment = 'jsdom' | 'node';

function workspaceProject(name: string, directory: string, environment: TestEnvironment) {
  const workspaceRoot = resolve(rootDir, directory);
  const aliases = [{ find: /^@\//, replacement: `${resolve(workspaceRoot, 'src')}/` }];
  if (name === 'docs') {
    aliases.push(
      { find: /^@site\//, replacement: `${workspaceRoot}/` },
      { find: /^@docusaurus\/Link$/, replacement: resolve(workspaceRoot, 'test/stubs/DocusaurusLink.tsx') },
      { find: /^@docusaurus\/useBaseUrl$/, replacement: resolve(workspaceRoot, 'test/stubs/useBaseUrl.ts') },
      { find: /^@theme\/ThemedImage$/, replacement: resolve(workspaceRoot, 'test/stubs/ThemedImage.tsx') },
    );
  }

  return {
    extends: true,
    resolve: { alias: aliases },
    test: {
      name,
      root: workspaceRoot,
      environment,
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      passWithNoTests: true,
      setupFiles: environment === 'jsdom' ? [resolve(rootDir, 'test/setup.ts')] : [],
    },
  };
}

const projects = [
  workspaceProject('app', 'apps/app', 'jsdom'),
  workspaceProject('docs', 'apps/docs', 'jsdom'),
  workspaceProject('smashers', 'apps/smashers', 'jsdom'),
  workspaceProject('template', 'apps/template', 'jsdom'),
  workspaceProject('web', 'apps/web', 'jsdom'),
  workspaceProject('eslint-config', 'packages/eslint-config', 'node'),
  workspaceProject('imx-passport', 'packages/imx-passport', 'jsdom'),
  workspaceProject('playfab', 'packages/playfab', 'node'),
  workspaceProject('prettier-config', 'packages/prettier-config', 'node'),
  workspaceProject('theme', 'packages/theme', 'jsdom'),
  workspaceProject('typescript-config', 'packages/typescript-config', 'node'),
  workspaceProject('ui', 'packages/ui', 'jsdom'),
];

export default defineConfig({
  root: rootDir,
  esbuild: { jsx: 'automatic' },
  test: {
    projects,
    passWithNoTests: true,
    testTimeout: 15_000,
    clearMocks: true,
    restoreMocks: true,
    unstubEnvs: true,
    unstubGlobals: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: resolve(rootDir, 'coverage', coverageScope?.replaceAll('/', '-') ?? ''),
      reporter: ['text', 'json-summary', 'lcov'],
      include: coverageScope
        ? [`${coverageScope}/src/**/*.{ts,tsx}`]
        : ['apps/*/src/**/*.{ts,tsx}', 'packages/{imx-passport,playfab,theme,ui}/src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.d.ts',
        '**/*.{test,spec}.{ts,tsx}',
        '**/{build,coverage,dist,.next,.turbo}/**',
        '**/*.{config,generated}.{ts,tsx}',
        'apps/app/src/types/typechain/**',
        // Contract ABIs and historical leaderboard snapshots are generated data artifacts.
        'apps/app/src/constants/contracts/deployments.*.ts',
        'apps/app/src/constants/leaderboards/leaderboard-*.ts',
      ],
      excludeAfterRemap: true,
      thresholds: coverageScope ? undefined : { branches: 25, functions: 25, lines: 25, statements: 25 },
    },
  },
});

import { config as baseConfig } from './base.js'
import * as espree from 'espree'
import nextPlugin from '@next/eslint-plugin-next'
import pluginImport from 'eslint-plugin-import'
import pluginJsxA11y from 'eslint-plugin-jsx-a11y'
import globals from 'globals'

const nextConfig = {
  name: 'next/core-web-vitals',
  files: ['**/*.{js,jsx,mjs,ts,tsx,mts,cts}'],
  plugins: {
    import: pluginImport,
    'jsx-a11y': pluginJsxA11y,
    '@next/next': nextPlugin,
  },
  languageOptions: {
    globals: { ...globals.browser, ...globals.node },
  },
  settings: {
    react: { version: 'detect' },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.mts', '.cts', '.tsx', '.d.ts'],
    },
    'import/resolver': {
      node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
      typescript: { alwaysTryTypes: true },
    },
  },
  rules: {
    ...nextPlugin.configs['core-web-vitals'].rules,
    'import/no-anonymous-default-export': 'warn',
    'react/no-unknown-property': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'jsx-a11y/alt-text': [
      'warn',
      {
        elements: ['img'],
        img: ['Image'],
      },
    ],
    'jsx-a11y/aria-props': 'warn',
    'jsx-a11y/aria-proptypes': 'warn',
    'jsx-a11y/aria-unsupported-elements': 'warn',
    'jsx-a11y/role-has-required-aria-props': 'warn',
    'jsx-a11y/role-supports-aria-props': 'warn',
    'react/jsx-no-target-blank': 'off',
  },
}

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const nextJsConfig = baseConfig.concat(
  nextConfig,
  // Keep JavaScript on ESLint's native parser. The shared base config supplies
  // typescript-eslint for TypeScript and avoids Next's bundled Babel parser.
  { files: ['**/*.{js,cjs,mjs,jsx}'], languageOptions: { parser: espree } },
  {
    // Keep newer react-hooks rules disabled to preserve the repository's existing lint policy.
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/immutability': 'off',
    },
  }
)

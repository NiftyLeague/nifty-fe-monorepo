import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';
import globals from 'globals';

import pluginOnlyWarn from 'eslint-plugin-only-warn';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginTurbo from 'eslint-plugin-turbo';

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const config = tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  eslintConfigPrettier,
  { plugins: { turbo: pluginTurbo }, rules: { 'turbo/no-undeclared-env-vars': 'warn' } },
  {
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: { ...globals.serviceworker, ...globals.browser, ...globals.node },
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
    },
  },
  {
    plugins: { 'react-hooks': pluginReactHooks },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // These rules were promoted to "recommended" in eslint-plugin-react-hooks 7.1.1.
      // They are disabled to preserve existing behavior; refactor the code to adopt them in a follow-up.
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/immutability': 'off',
    },
  },
  { plugins: { onlyWarn: pluginOnlyWarn } },
  {
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
  { linterOptions: { reportUnusedDisableDirectives: 'off' } },
  { ignores: ['build/**', 'dist/**'] },
);

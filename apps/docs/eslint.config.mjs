import { config } from '@nl/eslint-config/react-internal';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    ignores: ['node_modules', '.docusaurus', '.turbo', 'build', 'public'],
  },
];

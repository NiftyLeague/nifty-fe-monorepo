/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@nl/eslint-config/react-internal.js'],
  parser: '@typescript-eslint/parser',
  ignorePatterns: ['.*.js', 'babel.config.js', 'node_modules/', '.docusaurus/', '.turbo/', 'build/'],
  parserOptions: {
    project: true,
  },
};

// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ['apps/**', 'packages/**'],
  extends: ['@nl/eslint-config/library.js'],
  parserOptions: {
    project: true,
  },
};

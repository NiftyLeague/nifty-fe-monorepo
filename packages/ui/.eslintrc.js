/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@nl/eslint-config/react-internal.js'],
  parserOptions: {
    project: './tsconfig.lint.json',
    tsconfigRootDir: __dirname,
  },
};

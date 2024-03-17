/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@nl/eslint-config/react-internal.js'],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
};

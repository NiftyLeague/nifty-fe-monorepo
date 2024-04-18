/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@nl/eslint-config/react-internal.js'],
  ignorePatterns: ['.*.js', 'babel.config.js', 'node_modules', '.docusaurus', '.turbo', 'build', 'public'],
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
};

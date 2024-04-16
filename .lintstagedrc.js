module.exports = {
  // Type check TypeScript files
  '(apps|packages)/**/*.(ts|tsx)': () => 'pnpm type-check',
  // Lint then format TypeScript and JavaScript files
  '(apps|packages)/**/*.(ts|tsx|js)': filenames => [
    `pnpm eslint --fix ${filenames.join(' ')}`,
    `pnpm prettier --write ${filenames.join(' ')}`,
  ],
  // Format Markdown and JSON
  '(apps|packages)/**/*.(md|mdx|json)': filenames => `pnpm prettier --write ${filenames.join(' ')}`,
};

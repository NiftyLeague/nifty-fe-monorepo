module.exports = {
  // Type check TypeScript files
  '(apps|packages)/**/*.(ts|tsx)': () => 'pnpm type-check --',
  // Lint then format TypeScript and JavaScript files
  '(apps|packages)/**/*.(ts|tsx|js)': stagedFiles => [
    'pnpm lint:fix --',
    `prettier --write -- ${stagedFiles.join(' ')}`,
  ],
  // Format Markdown and JSON
  '(apps|packages)/**/*.(md|mdx|json)': stagedFiles => `prettier --write -- ${stagedFiles.join(' ')}`,
};

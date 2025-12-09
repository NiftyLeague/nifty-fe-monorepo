/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  // Use 'avoid' to omit parens when possible. Example: `x => x` instead of `(x) => x`
  arrowParens: 'avoid',

  // If true, puts the `>` of a multi-line JSX element at the end of the last line
  // instead of being alone on the next line
  bracketSameLine: false,

  // Print spaces between brackets in object literals.
  // Example: `{ foo: bar }` (true) vs `{foo: bar}` (false)
  bracketSpacing: true,

  // Use single quotes instead of double quotes in JSX
  jsxSingleQuote: false,

  // Control how objects are wrapped. 'collapse' keeps them on one line if they fit,
  // otherwise wraps each property on a new line
  objectWrap: 'collapse',

  // Maximum line length that Prettier will try to keep under
  printWidth: 120,

  // When there are multiple HTML attributes, put each on a new line
  singleAttributePerLine: false,

  // Use single quotes instead of double quotes
  singleQuote: true,

  // Number of spaces per indentation level
  tabWidth: 2,

  // Print trailing commas wherever possible in multi-line comma-separated syntax
  // 'all' adds them to function calls, objects, arrays, etc.
  trailingComma: 'all',
};

export default config;

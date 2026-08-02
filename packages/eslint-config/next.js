import { config as baseConfig } from './base.js'
import * as espree from 'espree'
import nextPlugin from 'eslint-config-next/core-web-vitals'

const nextConfig = nextPlugin.map((config) => {
  if (!config.plugins) return config

  const plugins = Object.fromEntries(
    Object.entries(config.plugins).filter(([name]) => name !== 'react' && name !== 'react-hooks')
  )
  return { ...config, plugins }
})

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const nextJsConfig = baseConfig.concat(
  nextConfig,
  {
    // eslint-config-next 16 ships a Babel parser whose scope manager predates
    // ESLint 10's SourceCode contract. ESLint's native parser is sufficient
    // for JavaScript and JSX; keep Next's TypeScript parser for TS files.
    files: ['**/*.{js,cjs,mjs,jsx}'],
    languageOptions: { parser: espree },
  },
  {
    // eslint-config-next 16.x re-enables react-hooks/recommended (which in 7.1+ includes
    // set-state-in-effect and static-components). Disable them again to preserve prior behavior.
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/static-components': 'off',
      'react-hooks/use-memo': 'off',
      'react-hooks/immutability': 'off',
    },
  }
)

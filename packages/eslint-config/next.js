import { config as baseConfig } from './base.js';
import nextPlugin from 'eslint-config-next/core-web-vitals';

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const nextJsConfig = baseConfig.concat(nextPlugin, {
  // eslint-config-next 16.x re-enables react-hooks/recommended (which in 7.1+ includes
  // set-state-in-effect and static-components). Disable them again to preserve prior behavior.
  rules: {
    'react-hooks/set-state-in-effect': 'off',
    'react-hooks/static-components': 'off',
    'react-hooks/use-memo': 'off',
    'react-hooks/immutability': 'off',
  },
});

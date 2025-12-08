import { config as baseConfig } from './base.js';
import nextPlugin from 'eslint-config-next/core-web-vitals';

/**
 * A custom ESLint configuration for libraries that use Next.js.
 *
 * @type {import("eslint").Linter.Config}
 * */
export const nextJsConfig = baseConfig.concat(nextPlugin);

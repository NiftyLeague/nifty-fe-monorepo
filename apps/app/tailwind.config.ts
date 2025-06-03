import type { Config } from 'tailwindcss';
import sharedConfig from '@nl/tailwind-config';

const config: Pick<Config, 'content' | 'presets'> = { content: ['./src/**/*.tsx'], presets: [sharedConfig] };

export default config;

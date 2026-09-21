// Set the config directory before node-config-ts is evaluated. The relative
// path works from src/, dist/src/, and bundled deploys alike.
import { fileURLToPath } from 'node:url'

globalThis.process.env.NODE_CONFIG_TS_DIR ??= fileURLToPath(new URL('../config/', import.meta.url))

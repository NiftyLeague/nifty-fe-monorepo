// Traced import of the runtime config JSON.
//
// `node-config-ts` reads `config/default.json` from disk at runtime (fs, not
// import), so Vercel's bundler never includes it and the function crashes
// with `config.imx is undefined`. Importing the JSON here forces the bundler
// to trace the copied config into the deployed bundle. Keeping the JSON at
// the app root avoids generating a duplicate config tree under `src/`.
import configData from '../config/default.json' with { type: 'json' }

export default configData

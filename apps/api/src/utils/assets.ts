import path from 'node:path'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Asset categories used by the NFT generators.
 *
 * Comics and marketplace items read the canonical source art checked into this
 * app at `assets/` — the comics pages are duplicated in the docs build, which
 * processes the same art at build time. Generated degen images remain local
 * operational data and are kept out of Git under `apps/api/.data/`.
 */
export type AssetKind = 'comics' | 'items' | 'degens'

// import.meta.url is undefined under the Workers runtime (no filesystem
// concept); only the local generators use these paths, so a placeholder root
// keeps the module importable there.
const apiRoot = (() => {
  try {
    return resolve(dirname(fileURLToPath(import.meta.url)), '../..')
  } catch {
    return resolve('.')
  }
})()

/**
 * Resolve the on-disk path of a source image for a given NFT kind.
 *
 * The logical filename is intentionally separate from the physical path:
 * the old API's public upload names (comic `1.png`, item `101.gif`, etc.)
 * remain unchanged while local generators read the shared WebP/GIF assets.
 */
export function getAssetPath(kind: AssetKind, fileName: string): string {
  const safeFileName = path.basename(fileName)
  if (safeFileName !== fileName) {
    throw new Error(`Asset filename must not contain a path: ${fileName}`)
  }

  const extension = path.extname(safeFileName).toLowerCase()
  const stem = path.basename(safeFileName, extension)

  switch (kind) {
    case 'comics':
      return resolve(apiRoot, 'assets', 'comics', 'page', `${stem}.webp`)
    case 'items': {
      const tokenId = Number(stem)
      const sharedId = Number.isInteger(tokenId) && tokenId >= 101 ? tokenId - 100 : tokenId
      return resolve(apiRoot, 'assets', 'items', 'full', `${sharedId}.gif`)
    }
    case 'degens':
      return resolve(apiRoot, '.data', 'images', 'degens', safeFileName)
  }
}

import { readFileSync } from 'node:fs'

/**
 * Byte size of a published media file, read from assets/media-manifest.json.
 *
 * Media lives on cdn.niftyleague.com and no longer in the repository, so size
 * budgets are enforced against the manifest rather than the filesystem.
 * Returns undefined for paths that are not published.
 */
export const mediaBytes = (mediaPath: string): number | undefined => {
  const manifest = JSON.parse(readFileSync('assets/media-manifest.json', 'utf8')) as Record<
    string,
    { bytes: number }
  >
  return manifest[mediaPath.replace(/^assets\/media\//, '')]?.bytes
}

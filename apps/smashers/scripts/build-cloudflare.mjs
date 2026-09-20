import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'

/**
 * Runs the Cloudflare production build, then the `_headers` merge.
 *
 * The adapter's prerender worker has a teardown race (`Server is not running`
 * thrown from miniflare's dispose after every route has already rendered —
 * @astrojs/cloudflare 14.3.x dispose path). The build artifacts are complete
 * at that point, so this wrapper treats that exact signature as success iff
 * both deploy artifacts exist; any other failure propagates.
 */
const result = spawnSync('bunx', ['--bun', 'astro', 'build'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  encoding: 'utf8',
})

const teardownRace =
  result.status !== 0 &&
  `${result.stdout ?? ''}${result.stderr ?? ''}`.includes('Server is not running') &&
  existsSync('dist/server/entry.mjs') &&
  existsSync('dist/client/index.html')

if (result.status !== 0 && !teardownRace) {
  // Surface the captured output: we piped both streams.
  process.stderr.write(`${result.stdout ?? ''}${result.stderr ?? ''}`)
  process.exit(result.status ?? 1)
}
if (teardownRace) {
  console.warn(
    '[build-cloudflare] astro build failed in the known miniflare dispose race; ' +
      'prerender artifacts are complete, continuing.'
  )
}

const headers = spawnSync('bun', ['scripts/append-headers.mjs'], { stdio: 'inherit' })
process.exit(headers.status ?? 1)

/**
 * Reports the eager (initial-load) script payload for a route.
 *
 * Run against a local preview. Uses Lighthouse's bundled Chrome over CDP so it
 * needs no extra browser dependency.
 *
 * Usage: node scripts/measure-eager.mjs <baseUrl> <route> [route...]
 */
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'

const [baseUrl, ...routes] = process.argv.slice(2)
const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
})

try {
  for (const route of routes) {
    const { lhr } = await lighthouse(
      `${baseUrl}${route}`,
      { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance'] },
      {
        extends: 'lighthouse:default',
        settings: {
          formMode: 'navigation',
          formFactor: 'mobile',
          throttlingMethod: 'devtools',
          throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 },
        },
      }
    )

    const requests = lhr.audits['network-requests']?.details?.items ?? []
    const scripts = requests.filter((r) => r.resourceType === 'Script')

    // transferSize is 0 for locally served uncompressed assets, so report the
    // resource size Lighthouse measured from the response body instead.
    const bodyBytes = scripts.reduce((total, r) => total + (r.resourceSize ?? 0), 0)
    const perf = Math.round((lhr.categories.performance?.score ?? 0) * 100)

    console.log(`\n${route}`)
    console.log(`  perf=${perf}  LCP=${lhr.audits['largest-contentful-paint'].displayValue}`)
    console.log(`  scripts: ${scripts.length} files, ${(bodyBytes / 1024).toFixed(0)} KB`)
    for (const r of scripts
      .toSorted((a, b) => (b.resourceSize ?? 0) - (a.resourceSize ?? 0))
      .slice(0, 5)) {
      console.log(
        `    ${((r.resourceSize ?? 0) / 1024).toFixed(0).padStart(5)} KB  ${r.url.replace(/^https?:\/\/[^/]+/, '')}`
      )
    }
  }
} finally {
  await chrome.kill()
}

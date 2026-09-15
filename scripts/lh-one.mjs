import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'
import { writeFileSync } from 'node:fs'

const url = process.argv[2]
const out = process.argv[3]
const mobile = process.argv[4] === 'mobile'
const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
})
const settings = mobile
  ? {
      formFactor: 'mobile',
      throttlingMethod: 'devtools',
      throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 },
      screenEmulation: {
        mobile: true,
        width: 360,
        height: 640,
        deviceScaleFactor: 2,
        disabled: false,
      },
    }
  : {
      formFactor: 'desktop',
      throttlingMethod: 'devtools',
      throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false,
      },
    }
const result = await lighthouse(
  url,
  { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance'] },
  { extends: 'lighthouse:default', settings }
)
if (!result?.lhr) {
  console.log('NO RESULT')
  await chrome.kill()
  process.exit(0)
}
writeFileSync(out, JSON.stringify(result.lhr))
const a = result.lhr.audits
console.log('score:', (result.lhr.categories.performance?.score ?? 0) * 100)
console.log(
  'lcp:',
  a['largest-contentful-paint']?.numericValue,
  'fcp:',
  a['first-contentful-paint']?.numericValue
)
console.log(
  'errors:',
  JSON.stringify(a['errors-in-console']?.details?.items?.slice(0, 5) ?? []).slice(0, 800)
)
const el = a['lcp-discovery-insight']?.details?.items ?? []
for (const it of el)
  if (it.type === 'node') console.log('LCP el:', (it.snippet ?? '').slice(0, 200))
const d = a['lcp-discovery-insight']?.details?.items?.[0]?.items
if (d)
  console.log(
    'discovery:',
    JSON.stringify(Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v.value])))
  )
await chrome.kill()

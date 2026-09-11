import { parseArgs } from 'node:util'
import { spawn } from 'node:child_process'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve as resolvePath } from 'node:path'

const { values } = parseArgs({
  options: {
    before: { type: 'string' },
    after: { type: 'string' },
    route: { type: 'string', default: '/' },
    runs: { type: 'string', default: '3' },
    output: { type: 'string', default: 'artifacts/performance' },
  },
})
if (!values.before || !values.after)
  throw new Error('Provide --before and --after deployment origins')
const count = Number(values.runs)
if (!Number.isInteger(count) || count < 3 || count % 2 !== 1)
  throw new Error('Use an odd run count >= 3')
const origins = {}
for (const key of ['before', 'after']) {
  const url = new URL(values[key])
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password)
    throw new Error('Invalid origin')
  origins[key] = new URL(values.route, url).href
}
const output = resolvePath(values.output)
await mkdir(output, { recursive: true })
const samples = { before: [], after: [] }
function command(args) {
  return new Promise((resolve, reject) => {
    const process = spawn('npx', args, { stdio: 'inherit' })
    process.once('error', reject)
    process.once('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`Lighthouse exited ${code}`))
    )
  })
}
for (let run = 1; run <= count; run++) {
  for (const key of run % 2 ? ['before', 'after'] : ['after', 'before']) {
    const file = `${output}/${key}-${run}.json`
    await command([
      '--yes',
      'lighthouse@13.0.1',
      origins[key],
      '--quiet',
      '--chrome-flags=--headless=new --no-sandbox',
      '--only-categories=performance',
      '--output=json',
      `--output-path=${file}`,
    ])
    const report = JSON.parse(await readFile(file, 'utf8'))
    if (report.runtimeError) throw new Error(`${key}: ${report.runtimeError.message}`)
    const audits = report.audits
    const requests = audits['network-requests'].details.items
    samples[key].push({
      score: report.categories.performance.score,
      lcpMs: audits['largest-contentful-paint'].numericValue,
      cls: audits['cumulative-layout-shift'].numericValue,
      tbtMs: audits['total-blocking-time'].numericValue,
      jsBytes: requests
        .filter((r) => r.resourceType === 'Script')
        .reduce((n, r) => n + (r.transferSize || 0), 0),
      totalBytes: requests.reduce((n, r) => n + (r.transferSize || 0), 0),
    })
  }
}
const median = (items) => items.toSorted((a, b) => a - b)[Math.floor(items.length / 2)]
const medians = Object.fromEntries(
  Object.entries(samples).map(([key, runs]) => [
    key,
    Object.fromEntries(
      Object.keys(runs[0]).map((metric) => [metric, median(runs.map((sample) => sample[metric]))])
    ),
  ])
)
await writeFile(
  `${output}/summary.json`,
  JSON.stringify(
    {
      origins,
      samples,
      medians,
      caveats: [
        'Navigation audits do not measure field INP.',
        'Match content, analytics settings and cache state before interpreting deployment differences.',
      ],
    },
    null,
    2
  ) + '\n'
)
console.log(medians)

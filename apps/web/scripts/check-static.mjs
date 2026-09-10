import { readdir, readFile, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../dist')
async function walk(dir) {
  const found = []
  for (const item of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, item.name)
    if (item.isDirectory()) found.push(...(await walk(path)))
    else if (item.isFile()) found.push(path)
  }
  return found
}
const paths = await walk(root)
for (const file of paths) {
  if ((await stat(file)).size > 25 * 1024 * 1024)
    throw new Error(`Cloudflare asset exceeds 25 MiB: ${file.slice(root.length + 1)}`)
}
for (const name of [
  'index.html',
  'games.html',
  'degens.html',
  'privacy-policy.html',
  'shells/gltf.html',
  'shells/referral.html',
]) {
  const html = await readFile(join(root, name), 'utf8')
  if (html.includes('/_next/') || html.includes('__NEXT_DATA__'))
    throw new Error(`${name} still contains Next.js runtime output`)
}
const scripts = paths.filter((path) => path.endsWith('.js'))
let bytes = 0
for (const script of scripts) bytes += (await stat(script)).size
console.log(JSON.stringify({ staticFiles: paths.length, emittedJavaScriptBytes: bytes }, null, 2))

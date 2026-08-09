#!/usr/bin/env bun
// Run each test file in its own bun process. bun 1.3.14 leaks `mock.module`
// state across files in a single process (27 false failures) and `bun test
// --isolate` hangs at summary. Per-file processes avoid both. Fast via xargs -P.
import { existsSync, readdirSync, statSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { execFileSync } from 'node:child_process'

function findTestFiles(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist' || entry === '.git') continue
      findTestFiles(full, acc)
    } else if (entry.endsWith('.test.ts') || entry.endsWith('.test.tsx')) {
      acc.push(full)
    }
  }
  return acc
}

function resolveTestFiles(inputs: string[]): string[] {
  if (inputs.length === 0) return findTestFiles(process.cwd())

  const files: string[] = []
  for (const input of inputs) {
    const path = resolve(process.cwd(), input)
    if (!existsSync(path)) throw new Error(`Test path does not exist: ${input}`)
    if (statSync(path).isDirectory()) findTestFiles(path, files)
    else if (path.endsWith('.test.ts') || path.endsWith('.test.tsx')) files.push(path)
  }
  return files
}

const inputs: string[] = []
const excludes: string[] = []
const args = process.argv.slice(2)
for (let index = 0; index < args.length; index += 1) {
  const arg = args[index]
  if (arg === '--exclude') {
    const excluded = args[index + 1]
    if (!excluded) throw new Error('--exclude requires a test path')
    excludes.push(resolve(process.cwd(), excluded))
    index += 1
  } else {
    inputs.push(arg)
  }
}

const excluded = new Set(excludes)
const files = resolveTestFiles(inputs).filter((file) => !excluded.has(file))
let failed = 0
for (const f of files) {
  try {
    execFileSync('bun', ['test', f], { stdio: 'ignore', timeout: 20000 })
    console.log(`ok   ${f}`)
  } catch {
    failed++
    console.log(`FAIL ${f}`)
  }
}
if (failed > 0) {
  console.log(`\n${failed} test file(s) failed`)
  process.exit(1)
}
console.log(`\nall ${files.length} test files passed`)
process.exit(0)

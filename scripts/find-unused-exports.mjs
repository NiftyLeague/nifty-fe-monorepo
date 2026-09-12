#!/usr/bin/env node
/**
 * Reports exported symbols that nothing outside their own file references.
 *
 * The M4.4 sweep (#1838) covered whole files and stylesheets, where a name scan is
 * enough. It could not see inside a file that *is* imported, so an export used by
 * nobody survives exactly the way an unimported file does. This pass resolves names
 * through the type checker instead of matching text: barrels, namespace imports and
 * aliased re-exports count as real references, and a name that only appears in a
 * comment, a class string or a test description does not.
 *
 * Three consumers a naive scan misses have to be stitched back in, or the output is
 * mostly false positives:
 *
 *   1. Other workspaces. `packages/ui`'s exports are consumed by apps whose tsconfig
 *      owns the `@nl/ui/*` path mapping, so each workspace gets its own program and
 *      the reference sets are merged by `path::name`.
 *   2. `.astro` frontmatter. 46 of the 58 Astro files import TypeScript modules from
 *      a language this program cannot parse, so their import statements are read
 *      textually and resolved through the owning workspace's resolver.
 *   3. Dynamic `import()` and `import * as ns`. Neither names an export, so every
 *      export of the resolved module is treated as referenced.
 *
 * Usage:
 *   bun scripts/find-unused-exports.mjs                  # report
 *   bun scripts/find-unused-exports.mjs --json           # machine-readable
 *   bun scripts/find-unused-exports.mjs --workspace ui   # one workspace
 *
 * Exit code is always 0 — this reports, it does not gate. `test/contract/unused-exports.test.ts`
 * pins the reviewed verdicts so this list cannot drift silently.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
// `.vercel` and `.wrangler` hold copies of source files; counting those as references
// would make every finding look used, and counting their exports as candidates is noise.
const IGNORED =
  /(?:^|\/)(?:node_modules|dist|\.astro|\.turbo|coverage|\.vercel|\.wrangler|\.agents)\//
const TEST_FILE = /\.(?:test|spec)\.tsx?$|(?:^|\/)(?:test|tests|e2e)\//
/**
 * Modules something other than an import loads, so "no importer" proves nothing:
 * tool and platform configs read by name, and the worker entry the platform invokes.
 * `apps/app/src/types/typechain/**` needs no entry here — the owning tsconfig excludes it,
 * and candidates come from the parsed config so excluded files are never reported.
 */
const ENTRY_FILE =
  /(?:^|\/)(?:vite|astro|playwright|postcss|tailwind|wrangler)\.config\.[cm]?[jt]s$|(?:^|\/)\.wrangler\/|(?:^|\/)worker\/index\.[cm]?[jt]s$/
/**
 * Framework routing. Astro discovers these by file path and calls the exported `GET`/`POST`
 * itself, and the app's `routeTree.gen.ts` is generated. Neither has an importer, and both
 * are load-bearing — which is the same trap that kept a deleted boundary alive in #1906.
 */
const CONVENTION_FILE =
  /(?:^|\/)pages\/.*\.[cm]?[jt]s$|(?:^|\/)middleware\.[cm]?[jt]s$|(?:^|\/)content\.config\.[cm]?[jt]s$|\.gen\.[cm]?[jt]s$/

function listWorkspaces() {
  const found = []
  for (const group of ['packages', 'apps']) {
    for (const entry of readdirSync(join(ROOT, group))) {
      const dir = join(ROOT, group, entry)
      if (!statSync(dir).isDirectory()) continue
      try {
        statSync(join(dir, 'tsconfig.json'))
        found.push({ name: entry, dir })
      } catch {
        // not a TypeScript workspace
      }
    }
  }
  return found
}

function readTsconfig(dir) {
  const configPath = join(dir, 'tsconfig.json')
  const raw = ts.readConfigFile(configPath, (path) => readFileSync(path, 'utf8'))
  if (raw.error) return null
  return ts.parseJsonConfigFileContent(raw.config, ts.sys, dir, undefined, configPath)
}

function walk(dir, filter, out = []) {
  let entries
  try {
    entries = readdirSync(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (IGNORED.test(full)) continue
    if (entry.isDirectory()) walk(full, filter, out)
    else if (filter(entry.name)) out.push(full)
  }
  return out
}

const isTs = (name) => /\.tsx?$/.test(name)
/** Ambient declarations export nothing reportable but they do reference types. */
const isDeclaration = (name) => name.endsWith('.d.ts')
const isAstro = (name) => name.endsWith('.astro')

function hasExportModifier(node) {
  const modifiers = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined
  return Boolean(modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword))
}

/**
 * Top-level exported names of a file.
 *
 * Entries are keyed by `file::symbolName` rather than by node identity: each workspace
 * gets its own program, so the same declaration is a different node object in the ui
 * program and in the app program that consumes it. Names survive that; node identity does
 * not. The symbol name is also what the *reference* side reports (an importer's aliased
 * symbol), which is the half that has to agree with this side.
 */
function collectExports(sourceFile, checker, register) {
  const file = sourceFile.fileName
  const record = (exportName, node, kind) => {
    const symbol =
      checker.getSymbolAtLocation(node) ??
      checker.getSymbolAtLocation(node.name ?? node) ??
      undefined
    const names = new Set([exportName])
    if (symbol) names.add(symbol.getName())
    // A default export is reachable under either name depending on how it is imported.
    if (exportName === 'default' || symbol?.getName() === 'default') {
      names.add('default')
      if (symbol) names.add(symbol.getName())
    }
    register(file, [...names], exportName, kind)
  }

  for (const statement of sourceFile.statements) {
    if (ts.isExportAssignment(statement)) {
      record('default', statement.expression, 'value')
      continue
    }
    // `export ... from` introduces a name whose symbol resolves to the original
    // declaration, so recording the specifier here would report it as unreferenced.
    if (ts.isExportDeclaration(statement)) continue
    if (!hasExportModifier(statement)) continue
    if (statement.name && ts.isIdentifier(statement.name)) {
      record(statement.name.text, statement.name, kindOf(statement))
      continue
    }
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (ts.isIdentifier(declaration.name))
          record(declaration.name.text, declaration.name, 'value')
      }
      continue
    }
    record('default', statement, kindOf(statement))
  }
}

/**
 * `type` declarations vanish at compile time, so deleting one cannot change built output;
 * `value` declarations can, and need route or bundle evidence.
 */
function kindOf(statement) {
  if (
    ts.isInterfaceDeclaration(statement) ||
    ts.isTypeAliasDeclaration(statement) ||
    ts.isTypeParameterDeclaration(statement)
  )
    return 'type'
  return 'value'
}

/** Import statements from an `.astro` frontmatter block, which TypeScript cannot parse. */
function astroImportSpecifiers(text) {
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)
  if (!frontmatter) return []
  const found = []
  const statement = /\bimport\s+([^'"]*?)\s*from\s*['"]([^'"]+)['"]/g
  let match
  while ((match = statement.exec(frontmatter[1]))) {
    const clause = match[1].replace(/^\s*type\s+/, '').trim()
    const names = []
    if (clause.startsWith('*')) names.push('*')
    else {
      const named = /\{([^}]*)\}/.exec(clause)
      const defaultName = clause
        .replace(/\{[^}]*\}/, '')
        .replace(/,/g, '')
        .trim()
      if (defaultName) names.push('default')
      if (named)
        for (const raw of named[1].split(',')) {
          // `{ A, type B }` — the inline `type` is a modifier, not part of the name.
          const part = raw.replace(/^\s*type\s+/, '').trim()
          if (part) names.push(part.split(/\s+as\s+/)[0].trim())
        }
    }
    found.push({ specifier: match[2], names })
  }
  return found
}

function buildProgram(workspace) {
  const parsed = readTsconfig(workspace.dir)
  if (!parsed) return null
  const rootNames = new Set(parsed.fileNames.filter((file) => !IGNORED.test(file)))
  for (const file of walk(workspace.dir, isTs)) rootNames.add(file)
  for (const dir of ['test', 'scripts'])
    for (const file of walk(join(ROOT, dir), isTs)) rootNames.add(file)
  const options = {
    ...parsed.options,
    noEmit: true,
    incremental: false,
    composite: false,
    declaration: false,
    skipLibCheck: true,
  }
  return {
    program: ts.createProgram({ rootNames: [...rootNames], options }),
    options,
    // Candidates come from the parsed config, so a file the tsconfig excludes (generated
    // ABIs, fixtures) is never reported — while still being searched for references.
    // `.d.ts` files are searched but never reported: they are ambient, not code.
    candidateFiles: new Set(
      parsed.fileNames.filter((file) => !isDeclaration(file) && !IGNORED.test(file))
    ),
  }
}

function analyzeWorkspace(workspace, entries, referenced, selfReferenced, ambiguous) {
  const built = buildProgram(workspace)
  if (!built) return
  const { program, options, candidateFiles } = built
  const checker = program.getTypeChecker()

  const markAll = (file) => ambiguous.add(file)

  const markSymbol = (node, sourceFile) => {
    let symbol = checker.getSymbolAtLocation(node)
    if (symbol && symbol.flags & ts.SymbolFlags.Alias) {
      try {
        symbol = checker.getAliasedSymbol(symbol)
      } catch {
        symbol = undefined
      }
    }
    const name = symbol?.getName()
    if (!name) return
    for (const declaration of symbol.declarations ?? []) {
      const file = declaration.getSourceFile().fileName
      // The declaration's own name is not a use of it — except in a shorthand property
      // (`{ ProfileConstraints }`), where that same node is also the value being read.
      if (declaration === node) continue
      if (declaration.name === node && !ts.isShorthandPropertyAssignment(declaration)) continue
      if (file === sourceFile.fileName) selfReferenced.add(`${file}::${name}`)
      else referenced.add(`${file}::${name}`)
    }
  }

  const register = (file, names, exportName, kind) => {
    const id = `${file}::${exportName}`
    if (entries.has(id)) return
    entries.set(id, {
      exportName,
      kind,
      file,
      path: relative(ROOT, file),
      names: new Set(names),
      // Where it is declared, for the report: a test-only definition is not shippable code.
      definitionOnly: TEST_FILE.test(relative(ROOT, file)),
    })
  }

  for (const sourceFile of program.getSourceFiles()) {
    // Declaration files are searched for references — `window.d.ts` importing a type is a
    // real reference — but never reported as candidates (see `candidateFiles`).
    if (IGNORED.test(sourceFile.fileName)) continue
    const isCandidate =
      candidateFiles.has(sourceFile.fileName) &&
      !ENTRY_FILE.test(relative(ROOT, sourceFile.fileName)) &&
      !CONVENTION_FILE.test(relative(ROOT, sourceFile.fileName))

    if (isCandidate) collectExports(sourceFile, checker, register)

    const visit = (node) => {
      // Import and re-export statements are read structurally, not through the checker.
      // `getAliasedSymbol` collapses a pass-through re-export to the *ultimate* target, so
      // `export default someImportedThing` hides the intermediate module entirely — the
      // resolved specifier plus the imported name is what the exporting module is reached by.
      if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) {
        const specifier = node.moduleSpecifier
        if (specifier && ts.isStringLiteral(specifier)) {
          const resolved = ts.resolveModuleName(
            specifier.text,
            sourceFile.fileName,
            options,
            ts.sys
          )
          const target = resolved.resolvedModule?.resolvedFileName
          if (target) {
            if (ts.isExportDeclaration(node)) {
              if (node.exportClause && ts.isNamedExports(node.exportClause)) {
                for (const element of node.exportClause.elements)
                  referenced.add(`${target}::${(element.propertyName ?? element.name).text}`)
              } else markAll(target) // `export * from`
            } else {
              const clause = node.importClause
              if (clause) {
                if (clause.name) referenced.add(`${target}::default`)
                const bindings = clause.namedBindings
                if (bindings) {
                  if (ts.isNamespaceImport(bindings)) markAll(target)
                  else
                    for (const element of bindings.elements)
                      referenced.add(`${target}::${(element.propertyName ?? element.name).text}`)
                }
              }
            }
          }
        }
      }
      // `import('./mod')` names no export: treat the whole module as used.
      if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
        const [argument] = node.arguments
        if (argument && ts.isStringLiteral(argument)) {
          const resolved = ts.resolveModuleName(argument.text, sourceFile.fileName, options, ts.sys)
          const file = resolved.resolvedModule?.resolvedFileName
          if (file) markAll(file)
        }
      }
      if (ts.isIdentifier(node)) markSymbol(node, sourceFile)
      ts.forEachChild(node, visit)
    }
    ts.forEachChild(sourceFile, visit)
  }

  for (const file of walk(workspace.dir, isAstro)) {
    for (const { specifier, names } of astroImportSpecifiers(readFileSync(file, 'utf8'))) {
      const resolved = ts.resolveModuleName(specifier, file, options, ts.sys)
      const target = resolved.resolvedModule?.resolvedFileName
      if (!target) continue
      if (names.includes('*')) markAll(target)
      else for (const name of names) referenced.add(`${target}::${name}`)
    }
  }
}

/**
 * Analyses every TypeScript workspace and returns the exports nothing outside their
 * own file reaches, split by the fix each one needs.
 */
export function findUnusedExports({ only } = {}) {
  const entries = new Map()
  const referenced = new Set()
  const selfReferenced = new Set()
  const ambiguous = new Set()

  for (const workspace of listWorkspaces()) {
    if (only && workspace.name !== only) continue
    analyzeWorkspace(workspace, entries, referenced, selfReferenced, ambiguous)
  }

  const unused = []
  for (const entry of entries.values()) {
    if (ambiguous.has(entry.file)) continue
    const keys = [...entry.names].map((name) => `${entry.file}::${name}`)
    if (keys.some((key) => referenced.has(key))) continue
    // Used only by its own file: the `export` keyword is redundant, but the code is live.
    // The fix is to drop the keyword, not the declaration — a different change entirely.
    const internalOnly = keys.some((key) => selfReferenced.has(key))
    unused.push({
      name: entry.exportName,
      kind: entry.kind,
      scope: internalOnly ? 'export-only' : 'unreachable',
      path: entry.path,
      definitionOnly: entry.definitionOnly,
    })
  }
  unused.sort((a, b) => a.path.localeCompare(b.path) || a.name.localeCompare(b.name))
  return { unused, ambiguousModules: ambiguous.size }
}

if (import.meta.main) {
  const args = process.argv.slice(2)
  const asJson = args.includes('--json')
  const only = args.includes('--workspace') ? args[args.indexOf('--workspace') + 1] : undefined

  const { unused, ambiguousModules } = findUnusedExports({ only })

  if (asJson) {
    console.log(JSON.stringify({ count: unused.length, unused }, null, 2))
  } else {
    for (const scope of ['unreachable', 'export-only']) {
      const group = unused.filter((entry) => entry.scope === scope)
      const byFile = new Map()
      for (const entry of group) {
        if (!byFile.has(entry.path)) byFile.set(entry.path, [])
        byFile.get(entry.path).push(entry)
      }
      console.log(`\n### ${scope} (${group.length})`)
      for (const [path, names] of byFile)
        console.log(`  ${path}\n    ${names.map((entry) => entry.name).join(', ')}`)
    }
    console.log(`\n${unused.length} unreferenced export(s)`)
    console.log(
      `(${ambiguousModules} module(s) treated as fully referenced via namespace or dynamic import)`
    )
  }
}

import { execFileSync } from 'node:child_process'
import { basename, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const BUILD_BRANCHES = new Set(['main', 'staging'])
const ZERO_SHA = /^0+$/

const GLOBAL_SHARED_PATH_PREFIXES = [
  'assets/',
  'scripts/vercel-ignore-build.mjs',
  'package.json',
  'bun.lock',
  'turbo.json',
  'packages/eslint-config/',
  'packages/prettier-config/',
  'packages/typescript-config/',
]

const PROJECT_PATH_PREFIXES = {
  app: ['apps/app/'],
  web: ['apps/web/'],
  smashers: ['apps/smashers/'],
  docs: ['apps/docs/'],
  api: ['apps/api/'],
}

const PROJECT_SHARED_PATH_PREFIXES = {
  app: ['packages/contracts/', 'packages/imx-passport/', 'packages/sentry-client/', 'packages/ui/'],
  web: ['packages/sentry-client/', 'packages/ui/'],
  smashers: ['packages/playfab/', 'packages/sentry-client/', 'packages/ui/'],
  docs: ['packages/ui/'],
  api: ['packages/contracts/'],
}

const PROJECT_ALIASES = {
  app: 'app',
  web: 'web',
  smashers: 'smashers',
  'smashers-web': 'smashers',
  docs: 'docs',
  api: 'api',
}

const normalizePath = (value) => value.replaceAll('\\', '/')

const matchesPath = (changedPath, configuredPath) =>
  configuredPath.endsWith('/')
    ? changedPath.startsWith(configuredPath)
    : changedPath === configuredPath

const knownPackagePrefixes = new Set([
  ...GLOBAL_SHARED_PATH_PREFIXES.filter((path) => path.startsWith('packages/')),
  ...Object.values(PROJECT_SHARED_PATH_PREFIXES).flat(),
])

const isUnknownPackagePath = (changedPath) =>
  changedPath.startsWith('packages/') &&
  ![...knownPackagePrefixes].some((configuredPath) => matchesPath(changedPath, configuredPath))

export const canonicalProjectName = (
  value = process.env.VERCEL_PROJECT_NAME || basename(process.cwd())
) => PROJECT_ALIASES[value.trim().toLowerCase()] || null

export const isProjectAffected = (project, changedPaths) => {
  const canonicalProject = canonicalProjectName(project)
  const projectPaths = PROJECT_PATH_PREFIXES[canonicalProject]

  // Unknown projects build by default so a new Vercel project cannot silently
  // miss a release deployment until its path map is added here.
  if (!projectPaths) return true

  return changedPaths.some((path) => {
    const changedPath = normalizePath(path)
    const projectSharedPaths = PROJECT_SHARED_PATH_PREFIXES[canonicalProject] || []

    return (
      isUnknownPackagePath(changedPath) ||
      [...GLOBAL_SHARED_PATH_PREFIXES, ...projectPaths, ...projectSharedPaths].some(
        (configuredPath) => matchesPath(changedPath, configuredPath)
      )
    )
  })
}

export const shouldBuild = (
  branch = process.env.VERCEL_GIT_COMMIT_REF,
  project = process.env.VERCEL_PROJECT_NAME,
  changedPaths
) => {
  // Manual deployments do not have a Git branch and must remain available.
  if (!branch) return true
  if (!BUILD_BRANCHES.has(branch)) return false

  // Missing Git history is treated as affected to avoid a false-negative
  // release deployment in a shallow or otherwise incomplete checkout.
  if (changedPaths === undefined || changedPaths === null) return true

  return isProjectAffected(project, changedPaths)
}

const changedPathsForRelease = () => {
  const previousSha = process.env.VERCEL_GIT_PREVIOUS_SHA
  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA

  if (!previousSha || !commitSha || ZERO_SHA.test(previousSha) || ZERO_SHA.test(commitSha)) {
    return undefined
  }

  try {
    const repositoryRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], {
      cwd: process.cwd(),
      encoding: 'utf8',
    }).trim()

    return execFileSync('git', ['diff', '--name-only', '-z', previousSha, commitSha, '--'], {
      cwd: repositoryRoot,
      encoding: 'utf8',
    })
      .split('\0')
      .filter(Boolean)
  } catch (error) {
    console.warn('Unable to inspect the release diff; enabling this Vercel build.', error)
    return undefined
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const branch = process.env.VERCEL_GIT_COMMIT_REF
  const project = process.env.VERCEL_PROJECT_NAME || basename(process.cwd())
  const changedPaths = BUILD_BRANCHES.has(branch) ? changedPathsForRelease() : undefined
  const build = shouldBuild(branch, project, changedPaths)

  console.log(
    build
      ? `Vercel build enabled for ${project} on ${branch || 'manual deployment'}.`
      : branch && BUILD_BRANCHES.has(branch)
        ? `Vercel build skipped for unaffected project ${project} on ${branch}.`
        : `Vercel build skipped for feature branch ${branch}.`
  )
  process.exit(build ? 1 : 0)
}

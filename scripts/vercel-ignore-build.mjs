import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const BUILD_BRANCHES = new Set(['main', 'staging'])

export const shouldBuild = (branch = process.env.VERCEL_GIT_COMMIT_REF) =>
  !branch || BUILD_BRANCHES.has(branch)

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  const branch = process.env.VERCEL_GIT_COMMIT_REF
  const build = shouldBuild(branch)

  console.log(
    build
      ? `Vercel build enabled for ${branch || 'manual deployment'}.`
      : `Vercel build skipped for feature branch ${branch}.`
  )
  process.exit(build ? 1 : 0)
}

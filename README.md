# Nifty League Frontend Monorepo

[![Algolia Search](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/search.yaml/badge.svg?branch=main)](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/search.yaml)
[![CodeQL](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/github-code-scanning/codeql/badge.svg?branch=main)](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/github-code-scanning/codeql)
[![CI](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/ci.yml)

> Built with [Turborepo](https://turbo.build/)!

## What's inside?

This Turborepo includes the following apps/packages:

### Apps

- `app`: a [TanStack Start](https://tanstack.com/start) app for our Web3 dashboards at [app.niftyleague.com](http://app.niftyleague.com)
- `docs`: an [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) site for our company docs at [niftyleague.com/docs](http://niftyleague.com/docs)
- `smashers`: an [Astro](https://astro.build) SSR site for our game's website [niftysmashers.com](http://niftysmashers.com)
- `web`: an [Astro](https://astro.build) static site for our company's website [niftyleague.com](http://niftyleague.com), with a Cloudflare Worker variant for the special routes

### Packages

- `@nl/contracts`: shared deployed contract addresses and ABIs used by the app and API
- `@nl/playfab`: a [PlayFab](https://playfab.com/) client API for our game services. Includes auth UI components for PlayFab login
- `@nl/typescript-config`: global [TypeScript](https://www.typescriptlang.org/) configs `tsconfig.json`
- `@nl/ui`: a stub [React](https://react.dev/) component library using [Shadcn/ui](https://ui.shadcn.com/). Includes global [Tailwind CSS](https://tailwindcss.com/) styles

> **Note:**
> Each package/app strictly uses [TypeScript](https://www.typescriptlang.org/)

### Development Ports

- `app`: [http://localhost:3001](http://localhost:3001)
- `docs`: [http://localhost:3002](http://localhost:3002/docs/)
- `smashers`: [http://localhost:3003](http://localhost:3003/)
- `web`: [http://localhost:3000](http://localhost:3000)

### Utilities

This Turborepo has several tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Oxlint](https://oxc.rs/docs/guide/usage/linter) for code linting
- [Oxfmt](https://oxc.rs/docs/guide/usage/formatter) for opinionated code formatting
- [Turbo](https://turbo.build/) for parallelizing and caching your build steps
- [Syncpack](https://syncpack.io/) for managing dependencies
- [Tailwind CSS](https://tailwindcss.com/) for style utility classes

## Getting Started

### Install turbo globally

To install turbo globally for ease of use:

```
bun add -g turbo
```

### Set working directory to root

> **Note:**
> All commands are run from the root directory!

```
cd nifty-fe-monorepo
```

### Install dependencies

We use [Bun](https://bun.sh/) to manage dependencies.

```
bun install --frozen-lockfile
```

### Build

To build all apps and packages, run the following command:

```
turbo build
```

> **Note:**
> This step is only necessary for running app in prod with `turbo start`

### Develop

To run all apps and packages locally, run the following command:

```
turbo dev
```

## Testing

To lint all apps and packages, run the following command:

```
turbo lint
```

> **Note:**
> you can also use `turbo lint:fix` to run linting with `--fix`

To format all apps and packages, run the following command:

```
turbo format
```

To check TypeScript in all apps and packages, run the following command:

```
turbo type-check
```

To run all tests, run the following command:

```
bun run test
```

The root test command isolates each test file so module mocks and browser
globals cannot leak between workspaces. Use `bun run test:workspaces` when you
specifically need Turbo's workspace-level scheduling.

### CI Tests

We have several GitHub Actions workflows pre-configured to run tests such as linting, formatting, and type checking on pushes to `main` and on pull requests targeting `main`. All tests must pass before a pull request can be merged.

If you want to run the CI tests locally, you can use [act](https://github.com/nektar/act) to run the workflows.

On **macOS**, you can install act using Homebrew:

```
brew install act
```

On **Windows**, you can install act using Chocolatey:

```
choco install act
```

After you have act installed, you can run the following command to run all CI tests locally via Docker:

```
bun run act-ci
```

> **Note:**
> GitHub automatically provides a `GITHUB_TOKEN` secret when running workflows inside GitHub. With act, you need to manually provide yours each run. The above command will automatically prompt you to input your GitHub personal access token!

## Managing dependencies

### Add dependencies

Please install dependencies only where they're used.

To add a dependency to a specific app directory use `--filter`

```
bun --filter DIRECTORY_NAME add PACKAGE_NAME
```

### Bun Filtering

Filtering allows you to restrict commands to specific subsets of packages.

Selectors may be specified via the `--filter` (or `-F`) flag:

```
bun --filter <app/package_selector> <command>
```

**App Selectors:**

- `app`
- `docs`
- `smashers`
- `web`

**Package Selectors:**

- `playfab`
- `typescript-config`
- `ui`

### Update dependencies

We use [Syncpack](https://jamiemason.github.io/syncpack/) to ensure consistent dependency versions.

`bunx syncpack lint`

Lint all versions and ranges and exit with 0 or 1 based on whether all files match your Syncpack configuration file.

`bunx syncpack fix-mismatches`

Fix all mismatches in your dependencies uncovered by `syncpack lint`.

`bunx syncpack format`

Format all package.json files to match our Syncpack configuration file `.syncpackrc.ts`.

`bunx syncpack list`

Query and inspect all dependencies in our project, both valid and invalid.

`bunx syncpack update`

Update all dependencies to the latest versions on the npm registry. This covers dev, prod, and peer dependencies and updates all apps/packages recursively.

## Global Component Library

We use [Shadcn/ui](https://ui.shadcn.com/) as foundational components for all of our apps. All Shadcn UI components are located at `@nl/ui/base`.

### Adding New Components

Add Shadcn UI components to `@nl/ui/base` using the provided script:

```
bun run add-ui COMPONENT_NAME
```

If you need to customize, extend, or build custom global components they should be placed in the `@nl/ui/custom` package.

> **Note:**
> `@nl/ui/custom` expects a folder for each component. Use **kebab case** for folder names. Also use **named exports** for explicit & consistent naming.

## Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

## Learn More

## Deploy on Cloudflare

Deploys run through [Cloudflare Workers](https://developers.cloudflare.com/workers/). The
`Cloudflare Production` workflow deploys every app on `main`; `Cloudflare Preview`
deploys ready pull requests.

## Support

Email [andy@niftyleague.com](mailto:andy@niftyleague.com)

**OR**

Join the Nifty League [Discord Server](https://discord.gg/niftyleague) and message an admin

## Deployment and CI cost controls

Draft pull requests use local validation and do not start runner-heavy GitHub Actions. Mark a pull request ready for review to start the canonical audit ending in `Validation / Gate`; converting it back to draft cancels in-flight validation.

The `Cloudflare Preview` workflow is draft-protected and scoped by the Turbo affected check, so untouched apps neither build nor deploy. Production deploys run only from `main`.

## Environment Variables

Runtime secrets (Worker secrets, via `wrangler secret put`) and the build-time
`PUBLIC_*` / `VITE_*` values (GitHub environment secrets on the
`Production – <app>` / `Preview – <app>` environments) live outside the repo.
Sync them locally from the migrated values:

```bash
# Worker secrets for one app, from a local .env line KEY=value:
cd apps/smashers
printf '%s' "$VALUE" | bunx wrangler secret put KEY
```

> Never commit `.env.local` — it is gitignored.

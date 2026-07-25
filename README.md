# Nifty League Frontend Monorepo

[![Algolia Search](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/search.yaml/badge.svg?branch=main)](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/search.yaml)
[![CodeQL](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/github-code-scanning/codeql/badge.svg?branch=main)](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/github-code-scanning/codeql)
[![CI](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/ci.yml)

> Built with [Turborepo](https://turbo.build/)!

## What's inside?

This Turborepo includes the following apps/packages:

### Apps

- `app`: a [Next.js](https://nextjs.org/) app for our Web3 dashboards at [app.niftyleague.com](http://app.niftyleague.com)
- `docs`: a [Docusaurus](https://docusaurus.io/) app for our company docs at [niftyleague.com/docs](http://niftyleague.com/docs)
- `smashers`: a [Next.js](https://nextjs.org/) app for our game's website [niftysmashers.com](http://niftysmashers.com)
- `web`: a [Next.js](https://nextjs.org/) app for our company's website [niftyleague.com](http://niftyleague.com)
- `template`: a [Next.js](https://nextjs.org/) template to fork for new apps or test new features

### Packages

- `@nl/eslint-config`: global [eslint](https://eslint.org/) configurations (includes `eslint-plugin-next` and `eslint-config-prettier`) for code analysis/linting
- `@nl/imx-passport`: an [Immutable Passport](https://www.immutable.com/products/passport) instance to connect apps to the Immutable zkEVM blockchain
- `@nl/playfab`: a [PlayFab](https://playfab.com/) client API for our game services. Includes auth UI components for PlayFab login
- `@nl/prettier-config`: global [Prettier](https://prettier.io/) config overrides for code formatting
- `@nl/theme`: a common theme wrapper for [Next.js](https://nextjs.org/) apps using [Material-UI](https://mui.com/material-ui/)
- `@nl/typescript-config`: global [TypeScript](https://www.typescriptlang.org/) configs `tsconfig.json`
- `@nl/ui`: a stub [React](https://react.dev/) component library using [Shadcn/ui](https://ui.shadcn.com/). Includes global [Tailwind CSS](https://tailwindcss.com/) styles

> **Note:**
> Each package/app strictly uses [TypeScript](https://www.typescriptlang.org/)

### Development Ports

- `app`: [http://localhost:3001](http://localhost:3001)
- `docs`: [http://localhost:3002](http://localhost:3002/docs/)
- `smashers`: [http://localhost:3003](http://localhost:3003/)
- `web`: [http://localhost:3000](http://localhost:3000)
- `template`: [http://localhost:3005](http://localhost:3005)

### Utilities

This Turborepo has several tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for opinionated code formatting
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
bun run install
```

### Build

To build all apps and packages, run the following command:

```
bun run build
```

> **Note:**
> This step is only necessary for running app in prod with `bun run start`

### Develop

To run all apps and packages locally, run the following command:

```
bun run dev
```

## Testing

To lint all apps and packages, run the following command:

```
bun run lint
```

> **Note:**
> you can also use `bun run lint:fix` to run linting with `--fix`

To format all apps and packages, run the following command:

```
bun run format
```

To check TypeScript in all apps and packages, run the following command:

```
bun run type:check
```

To run all tests, run the following command:

```
bun run test
```

> **Note:**
> `bun run test` runs `turbo test`, which executes `bun test --isolate` in each workspace with proper dependency ordering and caching.

### CI Tests

We have several GitHub Actions workflows pre-configured to run tests such as linting, formatting, and type checking on pushes to `main` or `staging` and on pull requests targeting `staging`. All tests must pass before a pull request can be merged.

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
- `template`

**Package Selectors:**

- `eslint-config`
- `imx-passport`
- `playfab`
- `prettier-config`
- `theme`
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

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Support

Email [andy@niftyleague.com](mailto:andy@niftyleague.com)

**OR**

Join the Nifty League [Discord Server](https://discord.gg/niftyleague) and message an admin

## Environment Variables

Environment variables are managed in **Vercel** (source of truth). Each app in `apps/` is linked to its own Vercel project under the `niftyleague` team. Sync locally:

```bash
# From any app directory:
cd apps/app
vercel link --scope niftyleague
vercel env pull .env.local

# Push local changes back:
vercel env push .env.local
```

> Never commit `.env.local` — it is gitignored.

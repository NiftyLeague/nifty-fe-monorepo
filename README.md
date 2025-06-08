# Nifty League Frontend Monorepo

[![Algolia Search](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/search.yaml/badge.svg?branch=main)](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/search.yaml)
[![CodeQL](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/github-code-scanning/codeql/badge.svg?branch=main)](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/github-code-scanning/codeql)
[![CI](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/ci.yml)

> Built with [Turborepo](https://turbo.build/)!

## What's inside?

This Turborepo includes the following apps/packages:

### Apps

- `app`: a [Next.js](https://nextjs.org/) app for our Web3 dashboards at [app.niftyleague.com](http:/app.niftyleague.com)
- `docs`: a [Docusaurus](https://docusaurus.io/) app for our company docs at [niftyleague.com/docs](http://niftyleague.com/docs)
- `smashers`: a [Next.js](https://nextjs.org/) app for our game's website [niftysmashers.com](http://niftysmashers.com)
- `web`: a [Next.js](https://nextjs.org/) app for our company's website [niftyleague.com](http://niftyleague.com)

### Packages

- `@nl/eslint-config`: global [eslint](https://eslint.org/) configurations (includes `eslint-plugin-next` and `eslint-config-prettier`) for code analysis/linting
- `@nl/imx-passport`: an [Immutable Passport](https://www.immutable.com/products/passport) instance to connect apps to the Immutable zkEVM blockchain
- `@nl/playfab`: a [PlayFab](https://playfab.com/) client API for our game services. Includes auth UI components for PlayFab login.
- `@nl/prettier-config`: global [Prettier](https://prettier.io/) config overrides for code formatting
- `@nl/theme`: a common theme wrapper for [Next.js](https://nextjs.org/) apps using [Material-UI](https://mui.com/material-ui/)
- `@nl/tailwind-config`: global [Tailwind CSS](https://tailwindcss.com/) configs `tailwind.config.js`
- `@nl/typescript-config`: global [TypeScript](https://www.typescriptlang.org/) configs `tsconfig.json`
- `@nl/ui`: a stub [React](https://react.dev/) component library shared by all applications

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
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for opinionated code formatting
- [Turbo](https://turbo.build/) for parallelizing and caching your build steps
- [Syncpack](https://syncpack.io/) for managing dependencies
- [Tailwind CSS](https://tailwindcss.com/) for style utility classes

## Getting Started

### Install turbo globally

To install turbo globally for ease of use:

```
pnpm install turbo --global
```

### Set working directory to root

> **Note:**
> All commands are run from the root directory!

```
cd nifty-fe-monorepo
```

### Install dependencies

We use [pnpm](https://pnpm.io/) to manage dependencies.

```
pnpm install
```

### Add dependencies

Please install dependencies only where they're used.

To add a dependency to a specific app directory use `--filter`

```
pnpm add PACKAGE_NAME --filter=DIRECTORY_NAME
```

### Build

To build all apps and packages, run the following command:

```
turbo build
```

### Develop

To develop all apps and packages, run the following command:

```
turbo dev
```

### Testing

To lint all apps and packages, run the following command:

```
turbo lint
```

> **Note:**
> you can also use `turbo lint:fix` to run linting with --fix

To format all apps and packages, run the following command:

```
turbo format
```

To check TypeScript in all apps and packages, run the following command:

```
turbo type-check
```

To run all of the above test commands together, run the following command:

```
turbo test
```

### Managing dependencies

We use [Syncpack](https://jamiemason.github.io/syncpack/) to ensure consistent dependency versions.

`syncpack lint`

Lint all versions and ranges and exit with 0 or 1 based on whether all files match your Syncpack configuration file.

`syncpack fix-mismatches`

Fix all mismatches in your dependencies uncovered by `syncpack lint`.

`syncpack format`

Format all package.json files to match our Syncpack configuration file `.syncpackrc.ts`.

`syncpack list`

Query and inspect all dependencies in our project, both valid and invalid.

`syncpack update`

Update all dependencies to the latest versions on the npm registry.  
This covers dev, prod, and peer dependencies and updates all apps/packages recursively.

### Updating dependencies via pnpm instead

`--recursive, -r`

Concurrently runs update in all subdirectories with a package.json (excluding node_modules).

`--latest, -L`

Update the dependencies to their latest stable version as determined by their latest tags.

`--workspace`

Tries to link all packages from the workspace. Versions are updated to match the versions of packages inside the workspace.

`--interactive, -i`

Show outdated dependencies and select which ones to update

---

**Recusively update all packages (does not pull latest major releases):**

```
pnpm up -r --workspace
```

**Recusively show latest dependencies and select which ones to update:**

```
pnpm up -r -L -i
```

### pnpm Filtering

Filtering allows you to restrict commands to specific subsets of packages.

Selectors may be specified via the `--filter` (or `-F`) flag:

```
pnpm --filter <app/package_selector> <command>
```

**App Selectors:**

- `app`
- `docs`
- `smashers`
- `web`

**Package Selectors:**

- `eslint-config`
- `imx-passport`
- `playfab`
- `prettier-config`
- `theme`
- `typescript-config`
- `ui`

### CI Tests

We have several GitHub Actions workflows pre-configured to run tests such as linting, formatting, and type checking on pull requests to `main` or `staging`. All tests must pass before a pull request can be merged.

If you want to run the CI tests locally, you can use [act](https://github.com/nektar/act) to run the workflows.

On **MacOS**, you can install act using Homebrew:

```
brew install act
```

On **Windows**, you can install act using Chocolatey:

```
choco install act
```

After you have act installed, you can run the following command to run the all CI tests locally via Docker:

```
pnpm act-ci
```

> **Note:**
> GitHub automatically provides a `GITHUB_TOKEN` secret when running workflows inside GitHub. With act, you need to mannually provide yours each run. The above command will automatically prompt you to input your GitHub personal access token!

### Remote Caching

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

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Support

Email [andy@niftyleague.com](mailto:andy@niftyleague.com)

**OR**

Join the Nifty League [Discord Server](https://discord.gg/niftyleague) and message an admin

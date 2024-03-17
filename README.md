# Nifty League Frontend Monorepo

[![Validate, lint, and test on every push](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/ci.yml)

[![Algolia Search](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/search.yaml/badge.svg?branch=main)](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/search.yaml)

[![CodeQL](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/github-code-scanning/codeql/badge.svg?branch=main)](https://github.com/NiftyLeague/nifty-fe-monorepo/actions/workflows/github-code-scanning/codeql)

> Built with [Turborepo](https://turbo.build/)!

## What's inside?

This Turborepo includes the following apps/packages:

### Apps

- `app`: a [Next.js](https://nextjs.org/) app for our web3 dashboards at [app.niftyleague.com](http:/app.niftyleague.com)
- `docs`: a [Docusaurus](https://docusaurus.io/) app for our docs at [niftyleague.com/docs](http://niftyleague.com/docs)
- `web`: a [Next.js](https://nextjs.org/) app for our website [niftyleague.com](http://niftyleague.com)

### Packages

- `@nl/ui`: a stub React component library shared by all applications
- `@nl/theme`: a common theme wrapper for NextJs apps using Material-UI
- `@nl/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@nl/prettier-config`: `prettier` configuration overrides
- `@nl/typescript-config`: `tsconfig.json` configs used throughout the monorepo

> **Note:**
> Each package/app strictly uses [TypeScript](https://www.typescriptlang.org/)

### Development Ports

- `app`: [http://localhost:3001](http://localhost:3001)
- `docs`: [http://localhost:3002](http://localhost:3002/docs/)
- `web`: [http://localhost:3000](http://localhost:3000)

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

## Getting Started

### Install turbo globally

To install turbo globally for ease of use:

```
npm install turbo --global
```

### Set working directory to root

All commands are run from the root directory!

```
cd nifty-fe-monorepo
```

### Install dependencies

We use [npm](https://docs.npmjs.com/) to manage dependencies.

```
npm install
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

> **[?]**
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

### Updating dependencies

Note that by default `npm update` will not update the semver values of direct dependencies in `package.json`. If you want to also update values in `package.json` you can run: `npm update --save`

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

Join the [Nifty League Discord Server](https://discord.gg/niftyleague) and message a admin!

# Nifty League Docs

[![Crowdin](https://badges.crowdin.net/niftyleague-docs/localized.svg)](https://crowdin.com/project/niftyleague-docs)

## Deployments

- main: [niftyleague.com/docs](https://niftyleague.com/docs)
- staging: [staging.niftyleague.com/docs](https://staging.niftyleague.com/docs)

## Info

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Contributing to Nifty League Docs

Contributing to the docs site is a great way to get involved in the dev community and help other devs along the way! Check out our guidelines [here](https://github.com/NiftyLeague/nifty-fe-monorepo/blob/main/.github/CONTRIBUTING.md).

## How to generate markdown files from solidity Natspec comments

Install solidity doc gen
`pnpm install solidity-docgen`

Get the correct compiler version
`pnpm install -D solc-0.7@npm:solc@0.7.6`

Put the updated template `contract.hbs` in a /templates folder under the same directory as /contracts that you want to generate

Run `npx solidity-docgen --solc-module solc-0.7 -t ./templates`

## How to gernerate markdown files from typescript commments

`pnpm install --save-dev typedoc typedoc-plugin-markdown`

`typedoc --out <docs> src/index.ts`

see https://www.npmjs.com/package/typedoc-plugin-markdown for details

## How to Update search indices with algolia

create .env file with `ALGOLIA_APP_ID` and the `ALGOLIA_API_KEY` (write access)

Edit config.json file with:

- start url from updated website
- sitemap url from updated website: ex) for docs: https://docs.niftyleague.com/sitemap.xml
- "docs" index name

install jq : `brew install jq`

install Docker: [Mac](https://docs.docker.com/desktop/install/mac-install/) or [Windows](https://docs.docker.com/desktop/install/windows-install/)

run `docker run -it --env-file=.env.local -e "CONFIG=$(cat ./algolia-config.json | jq -r tostring)" algolia/docsearch-scraper`

## How to add a new page

Create a markdown file in its respective docs directory.

### Set up environment variables

Copy the `.env.example` file in this directory to `.env.local` (which will be ignored by Git):

```bash
cp .env.example .env.local
```

### Installation

```
$ pnpm install
```

### Local Development

```
$ pnpm dev
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Clear cache

```console
pnpm clear
```

### Build

```
$ pnpm build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true pnpm deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> pnpm deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

## Translations

We use Crowdin to handle our translations https://crowdin.com/project/niftyleague-docs

Follow docs provided by Docusaurus for initial setup: https://docusaurus.io/docs/i18n/crowdin

After changes generate the JSON translation files for the default language in website/i18n/en:

```console
pnpm write-translations
```

We use Github integration through Crowdin so please skip running `pnpm crowdin upload` to upload all the JSON and Markdown translation files.

As translations occcur in Crowdin it will automatically create pull requests from `l10n_staging` into `staging` so there is no need to downloading anything as well.

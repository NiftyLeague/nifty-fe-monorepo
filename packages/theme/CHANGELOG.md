# Changelog

## [1.0.1](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/theme-v1.0.0...theme-v1.0.1) (2026-08-07)


### Maintenance

* drop-mui-support ([#360](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/360)) ([cf09198](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cf0919857ea50424d4dc70f721238aa209abd46b))

## 1.0.0 (2026-08-02)


### Bug Fixes

* exclude test files from type-check (bun:test not tsc-resolvable) ([05acfaa](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/05acfaa55cd7ed357c9e4f6927a4d0588d74f17d))
* restore workspace:* protocol and pin react-unity-webgl to v8.8.0 in apps/app ([0b28131](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0b28131527d2284ea55a9b497f2786fed4984806))
* **test:** import describe/expect/it in 000-setup-dom copies ([d77db3a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d77db3a1a653abcf13528c3db1154b5ce48c764c))


### Tests

* add coverage for nfm error handlers, theme + playfab utils ([ca6df38](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ca6df38f04a852c1cdb465443f308bf5df02b1c0))
* add coverage for preloader-base (+90%) and gas.ts (+25%) ([#282](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/282)) ([5fd7249](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5fd7249aaa9150c72e0b24a03f8fb61a18fa439f))
* bun 1.4.0 + happy-dom per-file registration infra ([72e2d33](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/72e2d33fb8ecca9c7955b1bf3e7608ada8cb31bd))
* standardize monorepo testing and CI ([dad0659](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dad0659a1dd5d940de7d6c8455479f4f756e175f))
* standardize monorepo testing and CI ([4aea8f6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4aea8f6fd7a253603155f8a4e12bb53a39ec6998))
* standardize workspace runners on bun ([47db8f6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/47db8f6164cbf4fa8ac5e7f8baa2e746dcd301a5))


### CI

* mise-based 2-job CI (quality + test) ([514e489](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/514e489593ac5bec64dd176d70743bbcc561e777))
* trigger re-run after lint + describe-import fixes ([75810c4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/75810c43a802c855bf7371b680b91f23b5d40cae))


### Maintenance

* align repository with shared template ([1722262](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/17222629d80b1bb2c68a6968fcfb4665ff363b16))
* **deps:** update frontend dependencies and Vercel gate ([#333](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/333)) ([5e3b5dd](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5e3b5dda3095c8d57a9ae6061965d4cf5129cb94))
* staging → main release — CI trigger update + 22 commits ([#292](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/292)) ([f8553fc](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f8553fce1eaf24de67ed92a04389416a983d38f1))
* update all dependencies to latest ([#281](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/281)) ([a23baf1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a23baf1e04076427bffd78d1aa07e54b9b9d84cd))
* upgrade @mui/material, @mui/system, @mui/lab, @mui/x-data-grid to v9 ([aa02b53](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/aa02b539f14963fad71eb08bf6a57953d0acbd5e))
* upgrade 5 medium-risk deps (three, uuid, axelar, cow-sdk, react-intl) ([bd6b90d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bd6b90d9e2f908a62f921be9f0d138663c168112))
* upgrade dependencies to latest minor/patch versions ([dbe90f2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dbe90f2f41f90d512c4ce59e944e2c279f1bfce2))
* upgrade dependencies to latest minor/patch versions ([6b25e02](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6b25e02ea0d5a3b143cfe77d25aa8b18ca9841ce))

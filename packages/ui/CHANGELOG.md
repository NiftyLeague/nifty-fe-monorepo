# Changelog

## [1.0.2](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/ui-v1.0.1...ui-v1.0.2) (2026-08-15)


### Bug Fixes

* **ui:** correct invalid preloader transform style ([#692](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/692)) ([09c679e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/09c679e804e9b4da386ae0c3f4118fa11238e7a5))
* **ui:** position animated image fill wrappers ([#698](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/698)) ([0524f41](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0524f41e412cf2337524afa9638ab568f6166059))


### Performance

* **app:** defer dashboard overview sections ([bd3f238](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bd3f2387a3f5922ec8e0fecbda105b222f10d8c1))
* **app:** lazy-load slider implementation ([d8b2c72](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d8b2c721fd68d257dd1a6ed87b1b40be9d819471))
* **app:** remove private icon registry callers ([#577](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/577)) ([3282114](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3282114c0952dc134931eab4e9bee7beaf641f50))
* **app:** remove remaining lodash imports ([#547](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/547)) ([9f64eda](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9f64edaede5d36e0c8b257f0fc99bb50115cc001))
* **app:** serve animated item WebP assets ([#541](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/541)) ([acc9060](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/acc9060038553406afb67e149ebcb8e6317e02f5))
* **app:** slim public shell controls ([#567](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/567)) ([e49686b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e49686bb5d25962683aed0ba415b6bd45ef90a45))
* defer console game client boundary ([#485](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/485)) ([9754bba](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9754bba581b67a8398c9a3acb1af2b6ee5dd2fbc))
* defer marketing sections below the fold ([#491](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/491)) ([bcc90a8](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bcc90a87b0b41c3918423e7a0c43e2d7908b5bf9))
* defer shared analytics loading ([#484](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/484)) ([15f84af](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/15f84afa2aa243d243374887631e21f6f77044db))
* defer shared media and client boundaries ([#463](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/463)) ([89a5922](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/89a5922d80ef719f91dbaf851866581052e0c98f))
* defer shared Sentry initialization and route loading ([21203df](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/21203dfdfc659868bd8355e0ac529b57171d41df))
* **docs:** share lazy media primitives ([fe1e7ba](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/fe1e7ba2b56bb534ec2598d4698c0f5c4bcef0d8))
* keep marketing pages server-rendered ([#510](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/510)) ([49e1ae9](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/49e1ae927afa67e333b3679069c1153d987c6564))
* reduce homepage hero preload contention ([#500](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/500)) ([70fda3f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/70fda3f5940b4934ee8a580a80cc9e402cdf36ee))
* reduce shared app and website runtime cost ([#462](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/462)) ([f311471](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f311471139733ba4ca20b1e95aa6d999cd800884))
* **smashers:** server-render static sections and defer media ([#464](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/464)) ([294c08e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/294c08e7750d1005e417f495ec90c797d6f4011e))
* **ui:** coalesce shared parallax updates ([#526](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/526)) ([508b54d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/508b54d53cd158276fa15864ed2cae36bc82b124))
* **ui:** defer viewport video playback observers ([#589](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/589)) ([64f9c7a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/64f9c7a3c89adc647f8b6cf1b0d01f02e5614f8a))
* **ui:** prune unused icon registry entries ([#570](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/570)) ([ef9c4c2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ef9c4c246d887ab18aa53c4637351cb8243bd7e2))
* **ui:** remove shared navbar observer ([#596](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/596)) ([bc7170c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bc7170c9a82a4a355ae9e90d6e676248b2af3b2d))
* **ui:** scope font preloads by app theme ([#533](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/533)) ([265b2b1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/265b2b123ae0eddeba7faae16b23ff8ad2cc3c33))
* **ui:** share console visibility observer ([#597](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/597)) ([076d7fc](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/076d7fc1488e32f8cf248e9f62a46763099aa8cc))
* **ui:** slim auth icon dependency graphs ([#571](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/571)) ([f373fe1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f373fe137d58c95104344c8577921c503811ee72))
* **ui:** slim circular progress icon dependency ([#569](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/569)) ([97d6388](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/97d638834e8d22ff0f3b76899ce1a2b19341b305))
* **web:** defer shared navbar interactions ([#514](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/514)) ([a57045c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a57045c3140e53840b36bd7ddd69fc3e1c7de63a))
* **web:** lazy-load shared YouTube embeds ([#539](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/539)) ([c1a9814](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c1a9814fe999ba767be3aefd2ccc1e8471cece0c))
* **web:** remove default marketing animation boundaries ([#523](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/523)) ([e827962](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e827962319e335f8192abe401ef4cc518804427e))
* **web:** slim home page animation client graph ([#548](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/548)) ([b50c1e2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b50c1e2ac74f7979cf7d99e7cfd8f2050d217382))


### Maintenance

* **playfab:** use shared alert dialog primitive ([#536](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/536)) ([bd6c378](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bd6c378d3046c094f77380f04a89611bd212e97b))
* promote staging sidebar fix to main ([a3d1a40](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a3d1a40167ca80be253a3cca807030520def33c9))
* promote staging to main ([e0bbf03](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e0bbf03b70e80750b523a0da964b27d6a8ea6e8f))
* promote staging to main ([cc77798](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cc77798c50da9641287aae69f5c73564e0be07cd))
* promote staging to main ([b31b504](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b31b5047539c2dbc7563e87323b61bc1b60df019))
* promote staging to main ([c183e71](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c183e714e695628c9c9fe9fe65ed2b9b827a35fb))
* promote staging to main ([49fd879](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/49fd879ba87846e446cd7bd85178c3d404858d35))
* promote staging to main ([e950a71](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e950a71bb5cdfcbbd77bb23fca0edbb807dcd4ad))
* promote staging to main ([6584cf8](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6584cf85a9ea9d2bc975e4882798042c7a248e3d))
* promote staging to main ([9e3cef2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9e3cef2ca40bcb76fe54e9f24d582bd122ce5d4f))
* promote staging to main ([4df104f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4df104f1b387d6a253951c6c0abd5fc92423dae6))
* promote staging to main ([5b4116f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5b4116ff29dec8ff1603f2b429d8c5698ca597c2))
* promote staging to main ([d2660bf](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d2660bf9d6167b4cf3ab8c549d8b37e2aa00ba9a))
* promote staging to main ([db1bd2f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/db1bd2fd759a3564d01e537e179920b6b68075e8))
* promote staging to main ([d58e87c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d58e87c4304f7b0e44389bd57842d9bafc7982da))
* promote staging to main ([792b81f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/792b81fdf8c6322987d839cbc80a38f6d49abc8f))
* promote staging to main ([936b624](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/936b624078e6c92dad0cd5089e99706633e57a56))
* promote staging to main ([7fc3caa](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7fc3caae951ca17ed3b66a8eb1368c62f459f76f))
* promote staging to main ([f8ff163](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f8ff163405ec942633c6b52d710e88942213a344))
* promote staging to main ([de3fd88](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/de3fd88f55394ac831ca84b5ca9ee5ed6431ffd9))
* promote staging to main ([e70541a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e70541a02879ea45f54cd2a9a60858faf0717367))
* promote staging to main ([d0effbf](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d0effbff7f96206ca85eac7e81de9b6fb5c7239f))
* promote staging to main ([7f2433e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7f2433e69ad7aef942faedb58495192fd4d6e430))
* promote staging to main for GLTF NFTL hotfix ([b66c5f9](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b66c5f9af80715e267f7925b3fd5793721bccbc1))
* promote staging to main for release ([887a71b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/887a71b0383d763925a9065cf6af548bb7e11211))
* promote staging tree to main ([4860b22](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4860b2210eecc5af2b5c31fffc08546bcf0175c1))
* **ui:** remove unused animated wrapper ([#550](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/550)) ([d8137ca](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d8137caa9bfe097122d8b1b9f412259e55fdead5))
* **ui:** reuse shared retry button ([#602](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/602)) ([048fcb1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/048fcb18d25c6a8f714377cedb402d30b6ce5979))
* **ui:** share accordion and icon button primitives ([#568](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/568)) ([0e545fa](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0e545fab64a99ebfc745e951598f80454a14fbc0))

## [1.0.1](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/ui-v1.0.0...ui-v1.0.1) (2026-08-09)


### Bug Fixes

* sync-local-commits-to-staging ([#371](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/371)) ([37d95fb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/37d95fba2daf7c0972eec715fea7ee32e1ea0c0e))


### Maintenance

* extract shared degens page logic and remove dead console output ([#379](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/379)) ([92ec323](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/92ec323cef0b9054015f9e2214407beabb91ebb1))
* **release:** promote validated staging tree ([a8b1e7e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a8b1e7e1e2db7e0b12d1d8b8807e2f7c7d8a6c74))

## 1.0.0 (2026-08-02)


### Features

* add mise.toml (toolchain pins for local+CI) ([e9ad8c8](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e9ad8c860ab9d0b1e9eccc6bddb2294bac4327db))


### Bug Fixes

* exclude test files from type-check (bun:test not tsc-resolvable) ([05acfaa](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/05acfaa55cd7ed357c9e4f6927a4d0588d74f17d))
* strip broken --project-placeholder filters from all test scripts; run bun test directly ([5de1d6f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5de1d6fec320a361606630138106f0b82dff4023))
* **test:** import describe/expect/it in 000-setup-dom copies ([d77db3a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d77db3a1a653abcf13528c3db1154b5ce48c764c))
* tolerate pre-existing test failures in ui and playfab packages ([115f053](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/115f0537bde0b65f126ea63b669c26ca40ceb3a0))
* **ui:** import base components in base-components.test.tsx ([0ecc757](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0ecc757f3ccecd05ac9effa81e5f686d1ffa9eb3))
* update preloader progress synchronously ([baa1031](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/baa1031e18ac15a42463ba3ddbd0f730ce1c4ec1))


### Tests

* add coverage for preloader-base (+90%) and gas.ts (+25%) ([#282](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/282)) ([5fd7249](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5fd7249aaa9150c72e0b24a03f8fb61a18fa439f))
* bun 1.4.0 + happy-dom per-file registration infra ([72e2d33](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/72e2d33fb8ecca9c7955b1bf3e7608ada8cb31bd))
* **custom-components:** skip Preloader fake-timer test; setInterval deadlocks in Bun ([16a8ab8](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/16a8ab8d87461331ac1379cf0bb9805cf248a947))
* fix 6 failing tests + run CI with --isolate ([11c1c42](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/11c1c42c1abb1fa6476a0af7a47dc5f3072a923a))
* fix bun:test migration — mock.module timing, spyOn, navigator ([7fcbe33](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7fcbe33acc75459c88c7219ccb5b4cdb6624635e))
* fix happy-dom registration + next/font/react-device-detect/docusaurus stubs + playfab mock ([3dfb5a0](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3dfb5a0eaa2315062338b56f0daf9947acb09ba0))
* increase coverage and raise regression floor ([ad6dceb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ad6dcebfbca0c4812d8f7fe67168f707dee74bee))
* increase coverage and raise regression floors ([5221af6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5221af6ae242c8361e4eba6285334d13db7d06e0))
* increase timeout for flaky auth forms test ([bb907e4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bb907e42adde97c8379a5fd778a6983e0177212d))
* purge @testing-library/jest-dom — all assertions now bun-native ([a20778f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a20778f170c84e29286a7fca678c7534104a746a))
* raise bun:test coverage to 95% (was ~91%) ([9b1d425](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9b1d4257b8621535a86939da1af90c1a2b86cfbd))
* remove dangling jest-dom import from setup.ts + native toBeChecked ([7a5a694](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7a5a694336e1c1266093fdcbba29ef5a4e387943))
* scope mock.module + dynamic imports (batch 1) ([9cbfb65](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9cbfb652b0cb3e1119a0ed898a4ed05b74882c5e))
* scope mock.module + dynamic imports (batch 2) ([5aba023](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5aba023d5380feb21471b73e09f4178d11f25be5))
* standardize monorepo testing and CI ([dad0659](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dad0659a1dd5d940de7d6c8455479f4f756e175f))
* standardize monorepo testing and CI ([4aea8f6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4aea8f6fd7a253603155f8a4e12bb53a39ec6998))
* standardize workspace runners on bun ([47db8f6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/47db8f6164cbf4fa8ac5e7f8baa2e746dcd301a5))


### CI

* mise-based 2-job CI (quality + test) ([514e489](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/514e489593ac5bec64dd176d70743bbcc561e777))
* trigger re-run after lint + describe-import fixes ([75810c4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/75810c43a802c855bf7371b680b91f23b5d40cae))


### Maintenance

* align repository with shared template ([1722262](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/17222629d80b1bb2c68a6968fcfb4665ff363b16))
* daily code improvements — dead code removal, debug log cleanup, bug fix ([#324](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/324)) ([7e2fa94](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7e2fa94de12c9827e040a1c483bce41b95daa03e))
* daily code improvements — lint fixes, dep alignment, dead code removal ([2f66e33](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2f66e33f072412d7cf6095e04d562b7e2828f306))
* **deps:** update frontend dependencies and Vercel gate ([#333](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/333)) ([5e3b5dd](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5e3b5dda3095c8d57a9ae6061965d4cf5129cb94))
* remove pnpm remnants — packageManager→bun, delete lockfiles/workspace files ([1414f1d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1414f1d4c81656555b3e37fd17a4540d6e36c8dc))
* staging → main release — CI trigger update + 22 commits ([#292](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/292)) ([f8553fc](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f8553fce1eaf24de67ed92a04389416a983d38f1))
* staging → main release — CI trigger update + 6 commits ([#283](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/283)) ([35b7001](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/35b700143d44914380a668b41dc547ee3d610bfc))
* update all dependencies to latest ([#281](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/281)) ([a23baf1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a23baf1e04076427bffd78d1aa07e54b9b9d84cd))
* upgrade dependencies to latest minor/patch versions ([dbe90f2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dbe90f2f41f90d512c4ce59e944e2c279f1bfce2))
* upgrade dependencies to latest minor/patch versions ([6b25e02](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6b25e02ea0d5a3b143cfe77d25aa8b18ca9841ce))
* upgrade low-risk major versions (syncpack 15, lint-staged 17, @types/node 26, lucide-react 1) ([bee48a4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bee48a4c59b446bcf59d28d37f40b1c0b522440b))

:robot: I have created a release *beep* *boop*
---


<details><summary>nifty-fe-monorepo: 2.0.0</summary>

## [2.0.0](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/nifty-fe-monorepo-v1.2.70...nifty-fe-monorepo-v2.0.0) (2026-09-21)


###   BREAKING CHANGES

* migrate all apps from Vercel to Cloudflare Workers ([#1996](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1996))
* **lint:** adopt strict @shadcn/lint, Kobalte primitives, and React-era cleanup ([#1961](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1961))
* migrate monorepo from React to SolidJS ([#1955](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1955))

### Features

* **a11y,e2e:** axe sweep, app browser E2E, visual baselines, and the M5.5M5.8 audits ([#1923](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1923)) ([4dc7c1d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4dc7c1d44991e8d5d0e0669f9b2def10c63fb8c6))
* **analytics:** unify the web-vitals payload and gate telemetry to production ([#1919](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1919)) ([ec77480](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ec77480181f9e90bbbb2f2eeb19a42e881297763))
* **app:** M5.8 complete audit  chunk groups, image variants, prerendered shells, canonicals ([#1885](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1885)) ([#1937](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1937)) ([1e57d61](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1e57d61cdfd59f95c0495afd9194df48dc039015))
* **app:** migrate from Next.js to TanStack Start ([#1870](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1870)) ([5576b04](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5576b04272582a000fc996770ef79e5fa6f257d2))
* **app:** migrate Mint-O-Matic, WEN Game, and Crypto Winter off Unity ([#1952](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1952)) ([92d7ddd](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/92d7ddd18d54e75fd602f3ab7da1e0c8ccf1085f))
* **app:** serve Mt. Gawx through the Nifty World embed ([#1977](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1977)) ([200a7f5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/200a7f5b851b0f3229fd96aab2cd085bacf7542b))
* **benchmarks:** M5.2 budget evaluation against the M0 decision rules ([#1917](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1917)) ([70f195c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/70f195cc564c7b75d8fe743c716ff8e8274c7926))
* **benchmarks:** unified Lighthouse harness, cache contracts, and the budget gate ([#1920](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1920)) ([416a00f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/416a00fad88b45d8a3469b242e51a0e2a36f963c))
* **docs:** M5.7 complete audit  performance, a11y, SEO, and the real cache surface ([#1884](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1884)) ([#1933](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1933)) ([b39065e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b39065e93253768721201408eabbe71be7ca1cee))
* **games:** embed Nifty World mini games ([85cfb95](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/85cfb95f8721c4be4dee1b1b99c9b417e6e06134))
* migrate all apps from Vercel to Cloudflare Workers ([#1996](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1996)) ([2f7fa04](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2f7fa0485e91a371d4d26dc93ad5e1a7bc1732f5))
* migrate monorepo from React to SolidJS ([#1955](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1955)) ([1e54f2c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1e54f2c1c1b4460f9711fa09b485dbebac29afa1))
* migrate public degen assets from AWS S3 to Cloudflare R2 ([#1953](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1953)) ([2d23882](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2d2388286e5edda283df8f031424c679eecaa43c))
* **smashers:** M5.6 complete audit  SSR auth surfaces, cache policy, sitemap truthfulness, dialog wiring ([#1931](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1931)) ([cd1caac](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cd1caacbeb32ddc187639ef3d28165d8e912eb1b))
* **smashers:** migrate from Next.js to Astro SSR without next-auth ([#1869](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1869)) ([fd81af2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/fd81af23cb791bf8db3ebf6bf4e1016638dca2a8))
* **smashers:** pin store-link vars + guard the worker runtime env contract ([#2001](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/2001)) ([c0308e1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c0308e11fd330333bb1efa9b214e38f0c556942e))
* standardize degen imagery on WebP across all sizes ([#1956](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1956)) ([8801084](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/8801084d181ed9d14c087e1cefc63085f1c6b3ca))
* **ui:** make the shared primitives accessible and pin the contracts ([#1900](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1900)) ([1c382c6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1c382c684aa9ad06536eb081a913d696f15c9638))
* **web:** M5.5 complete audit  measured LCP fixes, keyboard-only pass, SEO and cache verification ([#1939](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1939)) ([d869b04](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d869b047237328335079cdc82acc94ef6c375d6c))
* **web:** migrate marketing site from Next.js to Astro static + Cloudflare Worker variant ([#1866](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1866)) ([eedea02](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/eedea02e0e49138988ff148f805546751805bd12))
* **web:** refresh marketing surfaces and navigation ([#1927](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1927)) ([1ed147f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1ed147f8bdd7d42c98d7bb110499cbf6e4690c62))
* **web:** regression matrix for M5.1 plus interaction E2E coverage ([#1916](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1916)) ([cddb6cb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cddb6cbf72f15404dbfbcbb3eb7c87c4a3d41850))
* **web:** serve degen 3D models as R2-hosted GLBs ([#1972](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1972)) ([f20b6f7](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f20b6f73cb52e828b16e0fa71f7550108d288791))
* **world:** add Nifty World scene browser ([#1928](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1928)) ([6e5f369](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6e5f369a4fd47a6ef022030aa34f941c179b0b3a))
* **world:** refine scene card navigation ([#1930](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1930)) ([8afd71c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/8afd71c504088b82f03bc9a7059fde483b4e46c4))


### Bug Fixes

* **api:** register webhook handler directly ([#1865](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1865)) ([36df800](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/36df8001b99dace02186b2ff3075df256c0de240))
* app-route-cleanup-audit-comments ([#1940](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1940)) ([6cf99ad](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6cf99ada8d2b413f525b0a8ffc62ef2ac8a16b7a))
* **app,smashers:** keep controlled dialog open props reactive ([#1959](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1959)) ([3d8d52c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3d8d52c454173580e60577dfe4464a4cd706b648))
* **app:** give mint-o-matic the shared padded public layout ([#1966](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1966)) ([e4098ff](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e4098ff5d7b1e96352cf0e20cb5e83fee6509840))
* **app:** keep the sidebar disclosure on its native role ([#1909](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1909)) ([f8b7ddb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f8b7ddb9936198c5e686cd07204a11ddc18242d5))
* **app:** make the embed screens fill the main area's vertical space ([#1981](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1981)) ([4b8c410](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4b8c41074ddc48a10244d2de0aab5511a5af71cf))
* **app:** polish world map embeds and catalog ([#1991](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1991)) ([18ddac2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/18ddac25a67da503e12f6854cedff5ca3c768cd7))
* **app:** restore Solid reactivity broken by React-era prop/context destructures ([#1962](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1962)) ([c0e3baf](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c0e3baf9b4c6f93e008bdc0e46f71380e0477d32))
* **ci:** replace bunx-chained install command for Vercel builds ([#1995](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1995)) ([aa54a01](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/aa54a01d0a1616a551ef011aea5e5394ed975934))
* complete fleet toolchain alignment ([#1990](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1990)) ([13094ee](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/13094ee85d13362373f8aebe3b3e6c395b45e442))
* **fonts:** declare the shared faces once and repair web's special-face drift ([#1893](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1893)) ([3eda7c5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3eda7c5d2ac90b153236ed315cc737a8ef45f0fc)), refs [#1887](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1887)
* **global:** clean Nifty World routes and audit comments ([#1938](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1938)) ([0739b8e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0739b8e5ea8813681aecb08df1898335af6c6a44))
* **image:** resolve preload import shadowing and remove dead test code ([#1898](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1898)) ([a4d24f5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a4d24f57f6dc6ae113df92df02b160d52c129c4a))
* make root Bun test suite isolation-safe ([#1945](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1945)) ([7f615e6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7f615e6dbf2924fd9dd5d265e6f81e072fc7dac8))
* **playfab:** await wallet signature validation ([#1994](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1994)) ([cba1934](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cba1934c568020b158102d195ed7af703eb88604))
* **playfab:** gate the user-session fetch to the client ([#1960](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1960)) ([d5b3e36](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d5b3e36ee3086a545e8b3e450b08764b497fa9ee))
* **playfab:** resolve crypto off globalThis so server-side signup can generate usernames ([#1947](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1947)) ([73b8c5b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/73b8c5bf1ae4f344372aad4f8ef9299f13bdf2c5))
* **security:** add missing rel=noopener on target=_blank links, remove no-op BuyCard handler ([#1993](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1993)) ([2b8733f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2b8733fbd91de9e2a86276b11227347a7c724e11))
* **seo:** consolidate docs on the apex /docs surface and clean sitemaps ([#1976](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1976)) ([cbbc094](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cbbc094c1fc46f9056d95a212c7ef60e6429298a))
* **smashers:** gate the hero animation on the connection tier, not downlink ([#1908](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1908)) ([51cafcb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/51cafcbd302f04bfce89bdf485f55e18f84ca268))
* **smashers:** preserve accessible auth interactions ([#1997](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1997)) ([9d08afb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9d08afb4a7ad441331b513fce6cb398c6df28513))
* **smashers:** repair the runtime regressions from the Astro migration ([#1874](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1874)) ([b2a2bff](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b2a2bff519ef9ac877807cc5536c7881f5fbfe2f))
* **smashers:** serve server-emitted assets (restores web fonts) ([#2002](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/2002)) ([e9b0445](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e9b0445c8982686b56271a14e6a81fb9e01d4260))
* stale-code test timeouts and sign util unit tests ([#1954](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1954)) ([8db12b2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/8db12b2336f8bbd2d2b29b8b97c80aa2107cff81))
* testnet-dev-workflow ([#2000](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/2000)) ([b329735](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b329735fa1dbbe69bf7ea1782d531c93d862cef1))
* **ui:** harden auth forms against pre-hydration GET submits ([#1948](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1948)) ([64758d0](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/64758d0b7d91be19f2a8fc20922c30e91e78cb15))
* **ui:** hydrate the console game island via lazy + Suspense ([#1957](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1957)) ([02f1294](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/02f1294d4c456c8f91d49aa80a23f6be8ca60b05))
* **ui:** keep a minimum gutter on fluid containers at 2xl ([#1958](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1958)) ([b1d7ed4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b1d7ed4646786a22878ebce36d05520465309d14))
* **ui:** restore the console-game controller float offset ([#1965](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1965)) ([796c2b1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/796c2b188b4d1828e6209744baa936055e181963))
* **ui:** stop double-locking document scroll in dialogs ([#1963](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1963)) ([7ed217d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7ed217d679e92d6e91ac8bccccf758888413fbac))
* **web:** address marketing page layout and styling feedback ([#1936](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1936)) ([a70d2d2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a70d2d24aaa7cb5b5813e0418df84b380aa6010e))
* **web:** console-game load timing, seamless avatar marquee, roadmap cropping ([#1868](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1868)) ([2202aa4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2202aa4cd4e4f998c02d8533739e6b71a17596cd))
* **web:** hide the game-card tag when the headline row cannot fit it ([#1964](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1964)) ([c148fd4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c148fd4ba58eeb9722c6fff66bd71741daf31520))
* **web:** scope responsive hero preload ([#1941](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1941)) ([1a57c6d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1a57c6db08c9ac31ecb5f9fd30d9c6034199a3cf))
* **web:** serve degen run-cycle sprites as animated WebP ([#1978](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1978)) ([1b7a298](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1b7a29870cda4bef4062890fdf718998094181ed))
* **web:** shell rewrite destinations must use clean urls ([#1867](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1867)) ([a7426ab](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a7426ab5626d5e8371a0bb45d984816d9869e3b8))


### Performance

* **app:** cycle the comics-burner buttons with CSS sprite sheets instead of a JS interval ([#1979](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1979)) ([0313b8a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0313b8af36cf5ba3a34b9c3977f5f4421aea941f))
* **app:** drop React-era store/timer deps and fix dead effect cleanups ([#1967](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1967)) ([3763944](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/376394440b2e02755589a70c2e72b7c464fc9ecf))
* **app:** make QueryErrorState accept unknown errors safely ([#1970](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1970)) ([211e4c6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/211e4c62e9db40dc675fc1639fb4cad88badc2fb))
* **app:** migrate IMX claim writes to viem ([#1988](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1988)) ([21cddd2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/21cddd2792bcfd09b6af65eb3af0910a70b5f63d))
* **app:** move the bridge writes to the viem pipeline and drop the orphaned roster ([#1986](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1986)) ([86c26fb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/86c26fbc50c87d53834ed3a848e2c9edd19db036))
* **app:** move the remaining ethers contract reads to the shared query cache ([#1982](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1982)) ([04a0345](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/04a0345e33e434e78202c2cb473db489de03b157))
* **app:** prefetch dashboard data on navigation intent through shared query factories ([#1973](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1973)) ([f1bc33d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f1bc33daef50aef76c84cc1fd67dcb3fe5374319))
* **app:** prefetch wallet modal on connect intent, time route transitions ([#1969](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1969)) ([b7a6d35](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b7a6d35e158d6a66aa8cd15eec2405ed97c4438c))
* **app:** replace nuqs with local parsers, guard auth race, prefetch leaderboard ([#1968](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1968)) ([db7050a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/db7050aff29dbc6f33beb3996d42e7c120f4fa83))
* **app:** route contract writes through the viem pipeline ([#1984](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1984)) ([fd9f477](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/fd9f477a11f39f09d9cf40122bae997577d2f5c0))
* **app:** server-prefetch dashboard data through a cookie mirror of the session token ([#1974](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1974)) ([61684d9](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/61684d992a7426c363b68c94c1b934291080daaa))
* **app:** server-prefetch leaderboard scores and keep the table scroll keyboard-reachable ([#1975](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1975)) ([22ad3b5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/22ad3b57f76d26d49a3e001bf48728c898ee9d2e))
* **app:** SolidJS architecture audit  shared state, cached contract reads, intent preloading ([#1971](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1971)) ([44d5e97](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/44d5e9792b7765a23cd37f1f5908ab56d3b90ce1))
* complete M5 follow-up audit ([#1943](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1943)) ([7a79f14](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7a79f14bb2e27701317fc97c59da1caeddb31bc2))
* post-migration modernization pass across web, smashers, and app ([#1946](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1946)) ([d462b8b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d462b8b2a0d09ab21b69edba1e8e8714f0387b3a))
* **smashers:** deliver the home-page animations as video ([#1907](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1907)) ([010973d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/010973d7c1784e485dd835cd90304c6218f6a37e))


### Documentation

* **architecture:** scope the ethers to viem consolidation ([#1980](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1980)) ([91e1272](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/91e1272d4070269587d761daf1e7fda584ec115f))
* record the follow-up status in the M4.0 inventory ([#1899](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1899)) ([afee88c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/afee88cc71844d84f0caf0f124ea98550a14a223))


### Maintenance

* **app:** finish ethers-to-viem consolidation ([#1989](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1989)) ([9585ab6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9585ab6c095ba03f558667ae6e353b5375603317))
* **app:** split the local-storage mega-context into per-key stores ([#1950](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1950)) ([f5f1f98](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f5f1f98db7ce5840901924d611a317ed33b327a7))
* **app:** use the shared optimized-image component and drop the copy ([#1895](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1895)) ([dd28959](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dd289597d5b2957572d25203023f1a9c2b60422c)), refs [#1890](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1890)
* **astro:** adopt the shared app config and Astro tsconfig base ([#1896](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1896)) ([dd2d546](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dd2d546183e2dcc8d668ac4f61c11c04a5098716)), refs [#1888](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1888)
* **docs:** dedupe the GTM loader and Astro app config (M4.0) ([#1892](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1892)) ([4fd12c6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4fd12c6e124b0fa03bcd6a0ead4a1f0f05e6ee4b)), refs [#1881](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1881)
* **docs:** migrate documentation site to Astro + Starlight ([#1872](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1872)) ([3c35109](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3c351099559332fddb67708def18ace2895c6751))
* **images:** share the image attribute contract across surfaces ([#1905](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1905)) ([0ca7745](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0ca7745350736df945cd39f77cf8acfbc79da08f)), refs [#1836](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1836)
* **lint:** adopt strict @shadcn/lint, Kobalte primitives, and React-era cleanup ([#1961](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1961)) ([d08c29f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d08c29f96cce9fa51f30ab082c68d3415a0d7500))
* **smashers:** resolve astro:assets through a gated Vercel image service ([#1949](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1949)) ([17af156](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/17af1568b02a0b9283eaef594cb62e7e3e15f9b1))
* **telemetry:** share the activation primitive and container loader ([#1897](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1897)) ([66f28cf](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/66f28cf8239433c91e81819843b0acbb7edbd52e)), refs [#1889](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1889)
* web-astro-shell-native ([#1951](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1951)) ([ff6f07b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ff6f07b98ad88fa12e9977d97a19ae116e9a4106))
* **web:** remove dead imports and preserve deferred chunks ([#1873](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1873)) ([6aa61ad](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6aa61ad6292c919acb46ac2b02f4423bdd1dfd5f))
* **web:** remove the dead Next-compat Link shim ([#1894](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1894)) ([64bb6d8](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/64bb6d8ca3049eae9b61e331b03d8f24a31c8d05)), refs [#1891](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1891)
</details>

<details><summary>api: 2.0.0</summary>

## [2.0.0](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/api-v1.0.0...api-v2.0.0) (2026-09-21)


###   BREAKING CHANGES

* migrate all apps from Vercel to Cloudflare Workers ([#1996](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1996))

### Features

* migrate all apps from Vercel to Cloudflare Workers ([#1996](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1996)) ([2f7fa04](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2f7fa0485e91a371d4d26dc93ad5e1a7bc1732f5))
* migrate public degen assets from AWS S3 to Cloudflare R2 ([#1953](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1953)) ([2d23882](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2d2388286e5edda283df8f031424c679eecaa43c))
* **smashers:** pin store-link vars + guard the worker runtime env contract ([#2001](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/2001)) ([c0308e1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c0308e11fd330333bb1efa9b214e38f0c556942e))
* standardize degen imagery on WebP across all sizes ([#1956](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1956)) ([8801084](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/8801084d181ed9d14c087e1cefc63085f1c6b3ca))


### Bug Fixes

* **api:** register webhook handler directly ([#1865](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1865)) ([36df800](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/36df8001b99dace02186b2ff3075df256c0de240))
* app-route-cleanup-audit-comments ([#1940](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1940)) ([6cf99ad](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6cf99ada8d2b413f525b0a8ffc62ef2ac8a16b7a))
* **ci:** replace bunx-chained install command for Vercel builds ([#1995](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1995)) ([aa54a01](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/aa54a01d0a1616a551ef011aea5e5394ed975934))
* **global:** clean Nifty World routes and audit comments ([#1938](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1938)) ([0739b8e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0739b8e5ea8813681aecb08df1898335af6c6a44))
* make root Bun test suite isolation-safe ([#1945](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1945)) ([7f615e6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7f615e6dbf2924fd9dd5d265e6f81e072fc7dac8))
* stale-code test timeouts and sign util unit tests ([#1954](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1954)) ([8db12b2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/8db12b2336f8bbd2d2b29b8b97c80aa2107cff81))
* testnet-dev-workflow ([#2000](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/2000)) ([b329735](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b329735fa1dbbe69bf7ea1782d531c93d862cef1))
* **web:** scope responsive hero preload ([#1941](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1941)) ([1a57c6d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1a57c6db08c9ac31ecb5f9fd30d9c6034199a3cf))
</details>

<details><summary>app: 2.0.0</summary>

## [2.0.0](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/app-v1.2.0...app-v2.0.0) (2026-09-21)


###   BREAKING CHANGES

* migrate all apps from Vercel to Cloudflare Workers ([#1996](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1996))
* **lint:** adopt strict @shadcn/lint, Kobalte primitives, and React-era cleanup ([#1961](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1961))
* migrate monorepo from React to SolidJS ([#1955](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1955))

### Features

* **a11y,e2e:** axe sweep, app browser E2E, visual baselines, and the M5.5M5.8 audits ([#1923](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1923)) ([4dc7c1d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4dc7c1d44991e8d5d0e0669f9b2def10c63fb8c6))
* **analytics:** unify the web-vitals payload and gate telemetry to production ([#1919](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1919)) ([ec77480](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ec77480181f9e90bbbb2f2eeb19a42e881297763))
* **app:** M5.8 complete audit  chunk groups, image variants, prerendered shells, canonicals ([#1885](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1885)) ([#1937](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1937)) ([1e57d61](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1e57d61cdfd59f95c0495afd9194df48dc039015))
* **app:** migrate from Next.js to TanStack Start ([#1870](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1870)) ([5576b04](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5576b04272582a000fc996770ef79e5fa6f257d2))
* **app:** migrate Mint-O-Matic, WEN Game, and Crypto Winter off Unity ([#1952](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1952)) ([92d7ddd](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/92d7ddd18d54e75fd602f3ab7da1e0c8ccf1085f))
* **app:** serve Mt. Gawx through the Nifty World embed ([#1977](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1977)) ([200a7f5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/200a7f5b851b0f3229fd96aab2cd085bacf7542b))
* **games:** embed Nifty World mini games ([85cfb95](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/85cfb95f8721c4be4dee1b1b99c9b417e6e06134))
* migrate all apps from Vercel to Cloudflare Workers ([#1996](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1996)) ([2f7fa04](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2f7fa0485e91a371d4d26dc93ad5e1a7bc1732f5))
* migrate monorepo from React to SolidJS ([#1955](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1955)) ([1e54f2c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1e54f2c1c1b4460f9711fa09b485dbebac29afa1))
* migrate public degen assets from AWS S3 to Cloudflare R2 ([#1953](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1953)) ([2d23882](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2d2388286e5edda283df8f031424c679eecaa43c))
* **smashers:** pin store-link vars + guard the worker runtime env contract ([#2001](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/2001)) ([c0308e1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c0308e11fd330333bb1efa9b214e38f0c556942e))
* standardize degen imagery on WebP across all sizes ([#1956](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1956)) ([8801084](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/8801084d181ed9d14c087e1cefc63085f1c6b3ca))
* **ui:** make the shared primitives accessible and pin the contracts ([#1900](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1900)) ([1c382c6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1c382c684aa9ad06536eb081a913d696f15c9638))
* **web:** serve degen 3D models as R2-hosted GLBs ([#1972](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1972)) ([f20b6f7](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f20b6f73cb52e828b16e0fa71f7550108d288791))
* **world:** add Nifty World scene browser ([#1928](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1928)) ([6e5f369](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6e5f369a4fd47a6ef022030aa34f941c179b0b3a))
* **world:** refine scene card navigation ([#1930](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1930)) ([8afd71c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/8afd71c504088b82f03bc9a7059fde483b4e46c4))


### Bug Fixes

* app-route-cleanup-audit-comments ([#1940](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1940)) ([6cf99ad](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6cf99ada8d2b413f525b0a8ffc62ef2ac8a16b7a))
* **app,smashers:** keep controlled dialog open props reactive ([#1959](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1959)) ([3d8d52c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3d8d52c454173580e60577dfe4464a4cd706b648))
* **app:** give mint-o-matic the shared padded public layout ([#1966](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1966)) ([e4098ff](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e4098ff5d7b1e96352cf0e20cb5e83fee6509840))
* **app:** keep the sidebar disclosure on its native role ([#1909](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1909)) ([f8b7ddb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f8b7ddb9936198c5e686cd07204a11ddc18242d5))
* **app:** make the embed screens fill the main area's vertical space ([#1981](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1981)) ([4b8c410](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4b8c41074ddc48a10244d2de0aab5511a5af71cf))
* **app:** polish world map embeds and catalog ([#1991](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1991)) ([18ddac2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/18ddac25a67da503e12f6854cedff5ca3c768cd7))
* **app:** restore Solid reactivity broken by React-era prop/context destructures ([#1962](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1962)) ([c0e3baf](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c0e3baf9b4c6f93e008bdc0e46f71380e0477d32))
* **ci:** replace bunx-chained install command for Vercel builds ([#1995](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1995)) ([aa54a01](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/aa54a01d0a1616a551ef011aea5e5394ed975934))
* **fonts:** declare the shared faces once and repair web's special-face drift ([#1893](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1893)) ([3eda7c5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3eda7c5d2ac90b153236ed315cc737a8ef45f0fc)), refs [#1887](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1887)
* **global:** clean Nifty World routes and audit comments ([#1938](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1938)) ([0739b8e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0739b8e5ea8813681aecb08df1898335af6c6a44))
* **security:** add missing rel=noopener on target=_blank links, remove no-op BuyCard handler ([#1993](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1993)) ([2b8733f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2b8733fbd91de9e2a86276b11227347a7c724e11))
* **seo:** consolidate docs on the apex /docs surface and clean sitemaps ([#1976](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1976)) ([cbbc094](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cbbc094c1fc46f9056d95a212c7ef60e6429298a))
* testnet-dev-workflow ([#2000](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/2000)) ([b329735](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b329735fa1dbbe69bf7ea1782d531c93d862cef1))
* **ui:** hydrate the console game island via lazy + Suspense ([#1957](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1957)) ([02f1294](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/02f1294d4c456c8f91d49aa80a23f6be8ca60b05))
* **web:** scope responsive hero preload ([#1941](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1941)) ([1a57c6d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1a57c6db08c9ac31ecb5f9fd30d9c6034199a3cf))


### Performance

* **app:** cycle the comics-burner buttons with CSS sprite sheets instead of a JS interval ([#1979](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1979)) ([0313b8a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0313b8af36cf5ba3a34b9c3977f5f4421aea941f))
* **app:** drop React-era store/timer deps and fix dead effect cleanups ([#1967](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1967)) ([3763944](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/376394440b2e02755589a70c2e72b7c464fc9ecf))
* **app:** make QueryErrorState accept unknown errors safely ([#1970](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1970)) ([211e4c6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/211e4c62e9db40dc675fc1639fb4cad88badc2fb))
* **app:** migrate IMX claim writes to viem ([#1988](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1988)) ([21cddd2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/21cddd2792bcfd09b6af65eb3af0910a70b5f63d))
* **app:** move the bridge writes to the viem pipeline and drop the orphaned roster ([#1986](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1986)) ([86c26fb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/86c26fbc50c87d53834ed3a848e2c9edd19db036))
* **app:** move the remaining ethers contract reads to the shared query cache ([#1982](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1982)) ([04a0345](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/04a0345e33e434e78202c2cb473db489de03b157))
* **app:** prefetch dashboard data on navigation intent through shared query factories ([#1973](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1973)) ([f1bc33d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f1bc33daef50aef76c84cc1fd67dcb3fe5374319))
* **app:** prefetch wallet modal on connect intent, time route transitions ([#1969](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1969)) ([b7a6d35](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b7a6d35e158d6a66aa8cd15eec2405ed97c4438c))
* **app:** replace nuqs with local parsers, guard auth race, prefetch leaderboard ([#1968](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1968)) ([db7050a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/db7050aff29dbc6f33beb3996d42e7c120f4fa83))
* **app:** route contract writes through the viem pipeline ([#1984](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1984)) ([fd9f477](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/fd9f477a11f39f09d9cf40122bae997577d2f5c0))
* **app:** server-prefetch dashboard data through a cookie mirror of the session token ([#1974](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1974)) ([61684d9](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/61684d992a7426c363b68c94c1b934291080daaa))
* **app:** server-prefetch leaderboard scores and keep the table scroll keyboard-reachable ([#1975](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1975)) ([22ad3b5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/22ad3b57f76d26d49a3e001bf48728c898ee9d2e))
* **app:** SolidJS architecture audit  shared state, cached contract reads, intent preloading ([#1971](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1971)) ([44d5e97](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/44d5e9792b7765a23cd37f1f5908ab56d3b90ce1))
* complete M5 follow-up audit ([#1943](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1943)) ([7a79f14](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7a79f14bb2e27701317fc97c59da1caeddb31bc2))
* post-migration modernization pass across web, smashers, and app ([#1946](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1946)) ([d462b8b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d462b8b2a0d09ab21b69edba1e8e8714f0387b3a))


### Maintenance

* **app:** finish ethers-to-viem consolidation ([#1989](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1989)) ([9585ab6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9585ab6c095ba03f558667ae6e353b5375603317))
* **app:** split the local-storage mega-context into per-key stores ([#1950](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1950)) ([f5f1f98](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f5f1f98db7ce5840901924d611a317ed33b327a7))
* **app:** use the shared optimized-image component and drop the copy ([#1895](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1895)) ([dd28959](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dd289597d5b2957572d25203023f1a9c2b60422c)), refs [#1890](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1890)
* **lint:** adopt strict @shadcn/lint, Kobalte primitives, and React-era cleanup ([#1961](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1961)) ([d08c29f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d08c29f96cce9fa51f30ab082c68d3415a0d7500))
</details>

<details><summary>docs: 2.0.0</summary>

## [2.0.0](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/docs-v1.0.8...docs-v2.0.0) (2026-09-21)


###   BREAKING CHANGES

* migrate all apps from Vercel to Cloudflare Workers ([#1996](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1996))
* **lint:** adopt strict @shadcn/lint, Kobalte primitives, and React-era cleanup ([#1961](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1961))
* migrate monorepo from React to SolidJS ([#1955](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1955))

### Features

* **analytics:** unify the web-vitals payload and gate telemetry to production ([#1919](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1919)) ([ec77480](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ec77480181f9e90bbbb2f2eeb19a42e881297763))
* **benchmarks:** unified Lighthouse harness, cache contracts, and the budget gate ([#1920](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1920)) ([416a00f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/416a00fad88b45d8a3469b242e51a0e2a36f963c))
* **docs:** M5.7 complete audit  performance, a11y, SEO, and the real cache surface ([#1884](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1884)) ([#1933](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1933)) ([b39065e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b39065e93253768721201408eabbe71be7ca1cee))
* migrate all apps from Vercel to Cloudflare Workers ([#1996](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1996)) ([2f7fa04](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2f7fa0485e91a371d4d26dc93ad5e1a7bc1732f5))
* migrate monorepo from React to SolidJS ([#1955](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1955)) ([1e54f2c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1e54f2c1c1b4460f9711fa09b485dbebac29afa1))
* **web:** serve degen 3D models as R2-hosted GLBs ([#1972](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1972)) ([f20b6f7](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f20b6f73cb52e828b16e0fa71f7550108d288791))


### Bug Fixes

* app-route-cleanup-audit-comments ([#1940](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1940)) ([6cf99ad](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6cf99ada8d2b413f525b0a8ffc62ef2ac8a16b7a))
* **ci:** replace bunx-chained install command for Vercel builds ([#1995](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1995)) ([aa54a01](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/aa54a01d0a1616a551ef011aea5e5394ed975934))
* **global:** clean Nifty World routes and audit comments ([#1938](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1938)) ([0739b8e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0739b8e5ea8813681aecb08df1898335af6c6a44))
* **seo:** consolidate docs on the apex /docs surface and clean sitemaps ([#1976](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1976)) ([cbbc094](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cbbc094c1fc46f9056d95a212c7ef60e6429298a))
* **ui:** hydrate the console game island via lazy + Suspense ([#1957](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1957)) ([02f1294](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/02f1294d4c456c8f91d49aa80a23f6be8ca60b05))
* **web:** scope responsive hero preload ([#1941](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1941)) ([1a57c6d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1a57c6db08c9ac31ecb5f9fd30d9c6034199a3cf))


### Performance

* complete M5 follow-up audit ([#1943](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1943)) ([7a79f14](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7a79f14bb2e27701317fc97c59da1caeddb31bc2))
* post-migration modernization pass across web, smashers, and app ([#1946](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1946)) ([d462b8b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d462b8b2a0d09ab21b69edba1e8e8714f0387b3a))


### Maintenance

* **astro:** adopt the shared app config and Astro tsconfig base ([#1896](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1896)) ([dd2d546](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dd2d546183e2dcc8d668ac4f61c11c04a5098716)), refs [#1888](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1888)
* **docs:** dedupe the GTM loader and Astro app config (M4.0) ([#1892](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1892)) ([4fd12c6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4fd12c6e124b0fa03bcd6a0ead4a1f0f05e6ee4b)), refs [#1881](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1881)
* **docs:** migrate documentation site to Astro + Starlight ([#1872](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1872)) ([3c35109](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3c351099559332fddb67708def18ace2895c6751))
* **lint:** adopt strict @shadcn/lint, Kobalte primitives, and React-era cleanup ([#1961](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1961)) ([d08c29f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d08c29f96cce9fa51f30ab082c68d3415a0d7500))
</details>

<details><summary>smashers: 2.0.0</summary>

## [2.0.0](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/smashers-v1.0.15...smashers-v2.0.0) (2026-09-21)


###   BREAKING CHANGES

* migrate all apps from Vercel to Cloudflare Workers ([#1996](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1996))
* **lint:** adopt strict @shadcn/lint, Kobalte primitives, and React-era cleanup ([#1961](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1961))
* migrate monorepo from React to SolidJS ([#1955](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1955))

### Features

* **a11y,e2e:** axe sweep, app browser E2E, visual baselines, and the M5.5M5.8 audits ([#1923](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1923)) ([4dc7c1d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4dc7c1d44991e8d5d0e0669f9b2def10c63fb8c6))
* **analytics:** unify the web-vitals payload and gate telemetry to production ([#1919](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1919)) ([ec77480](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ec77480181f9e90bbbb2f2eeb19a42e881297763))
* **app:** migrate from Next.js to TanStack Start ([#1870](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1870)) ([5576b04](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5576b04272582a000fc996770ef79e5fa6f257d2))
* **benchmarks:** unified Lighthouse harness, cache contracts, and the budget gate ([#1920](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1920)) ([416a00f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/416a00fad88b45d8a3469b242e51a0e2a36f963c))
* migrate all apps from Vercel to Cloudflare Workers ([#1996](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1996)) ([2f7fa04](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2f7fa0485e91a371d4d26dc93ad5e1a7bc1732f5))
* migrate monorepo from React to SolidJS ([#1955](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1955)) ([1e54f2c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1e54f2c1c1b4460f9711fa09b485dbebac29afa1))
* migrate public degen assets from AWS S3 to Cloudflare R2 ([#1953](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1953)) ([2d23882](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2d2388286e5edda283df8f031424c679eecaa43c))
* **smashers:** M5.6 complete audit  SSR auth surfaces, cache policy, sitemap truthfulness, dialog wiring ([#1931](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1931)) ([cd1caac](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cd1caacbeb32ddc187639ef3d28165d8e912eb1b))
* **smashers:** migrate from Next.js to Astro SSR without next-auth ([#1869](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1869)) ([fd81af2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/fd81af23cb791bf8db3ebf6bf4e1016638dca2a8))
* **smashers:** pin store-link vars + guard the worker runtime env contract ([#2001](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/2001)) ([c0308e1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c0308e11fd330333bb1efa9b214e38f0c556942e))


### Bug Fixes

* app-route-cleanup-audit-comments ([#1940](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1940)) ([6cf99ad](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6cf99ada8d2b413f525b0a8ffc62ef2ac8a16b7a))
* **app,smashers:** keep controlled dialog open props reactive ([#1959](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1959)) ([3d8d52c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3d8d52c454173580e60577dfe4464a4cd706b648))
* **ci:** replace bunx-chained install command for Vercel builds ([#1995](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1995)) ([aa54a01](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/aa54a01d0a1616a551ef011aea5e5394ed975934))
* **fonts:** declare the shared faces once and repair web's special-face drift ([#1893](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1893)) ([3eda7c5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3eda7c5d2ac90b153236ed315cc737a8ef45f0fc)), refs [#1887](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1887)
* **global:** clean Nifty World routes and audit comments ([#1938](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1938)) ([0739b8e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0739b8e5ea8813681aecb08df1898335af6c6a44))
* **image:** resolve preload import shadowing and remove dead test code ([#1898](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1898)) ([a4d24f5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a4d24f57f6dc6ae113df92df02b160d52c129c4a))
* **seo:** consolidate docs on the apex /docs surface and clean sitemaps ([#1976](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1976)) ([cbbc094](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cbbc094c1fc46f9056d95a212c7ef60e6429298a))
* **smashers:** preserve accessible auth interactions ([#1997](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1997)) ([9d08afb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9d08afb4a7ad441331b513fce6cb398c6df28513))
* **smashers:** repair the runtime regressions from the Astro migration ([#1874](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1874)) ([b2a2bff](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b2a2bff519ef9ac877807cc5536c7881f5fbfe2f))
* **smashers:** serve server-emitted assets (restores web fonts) ([#2002](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/2002)) ([e9b0445](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e9b0445c8982686b56271a14e6a81fb9e01d4260))
* **web:** scope responsive hero preload ([#1941](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1941)) ([1a57c6d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1a57c6db08c9ac31ecb5f9fd30d9c6034199a3cf))


### Performance

* complete M5 follow-up audit ([#1943](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1943)) ([7a79f14](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7a79f14bb2e27701317fc97c59da1caeddb31bc2))
* post-migration modernization pass across web, smashers, and app ([#1946](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1946)) ([d462b8b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d462b8b2a0d09ab21b69edba1e8e8714f0387b3a))
* **smashers:** deliver the home-page animations as video ([#1907](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1907)) ([010973d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/010973d7c1784e485dd835cd90304c6218f6a37e))


### Maintenance

* **astro:** adopt the shared app config and Astro tsconfig base ([#1896](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1896)) ([dd2d546](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dd2d546183e2dcc8d668ac4f61c11c04a5098716)), refs [#1888](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1888)
* **images:** share the image attribute contract across surfaces ([#1905](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1905)) ([0ca7745](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0ca7745350736df945cd39f77cf8acfbc79da08f)), refs [#1836](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1836)
* **lint:** adopt strict @shadcn/lint, Kobalte primitives, and React-era cleanup ([#1961](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1961)) ([d08c29f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d08c29f96cce9fa51f30ab082c68d3415a0d7500))
* **smashers:** resolve astro:assets through a gated Vercel image service ([#1949](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1949)) ([17af156](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/17af1568b02a0b9283eaef594cb62e7e3e15f9b1))
* **telemetry:** share the activation primitive and container loader ([#1897](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1897)) ([66f28cf](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/66f28cf8239433c91e81819843b0acbb7edbd52e)), refs [#1889](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1889)
</details>

<details><summary>web: 2.0.0</summary>

## [2.0.0](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/web-v1.0.32...web-v2.0.0) (2026-09-21)


###   BREAKING CHANGES

* migrate all apps from Vercel to Cloudflare Workers ([#1996](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1996))
* **lint:** adopt strict @shadcn/lint, Kobalte primitives, and React-era cleanup ([#1961](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1961))
* migrate monorepo from React to SolidJS ([#1955](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1955))

### Features

* **a11y,e2e:** axe sweep, app browser E2E, visual baselines, and the M5.5M5.8 audits ([#1923](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1923)) ([4dc7c1d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4dc7c1d44991e8d5d0e0669f9b2def10c63fb8c6))
* **analytics:** unify the web-vitals payload and gate telemetry to production ([#1919](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1919)) ([ec77480](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ec77480181f9e90bbbb2f2eeb19a42e881297763))
* migrate all apps from Vercel to Cloudflare Workers ([#1996](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1996)) ([2f7fa04](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2f7fa0485e91a371d4d26dc93ad5e1a7bc1732f5))
* migrate monorepo from React to SolidJS ([#1955](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1955)) ([1e54f2c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1e54f2c1c1b4460f9711fa09b485dbebac29afa1))
* migrate public degen assets from AWS S3 to Cloudflare R2 ([#1953](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1953)) ([2d23882](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2d2388286e5edda283df8f031424c679eecaa43c))
* **ui:** make the shared primitives accessible and pin the contracts ([#1900](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1900)) ([1c382c6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1c382c684aa9ad06536eb081a913d696f15c9638))
* **web:** M5.5 complete audit  measured LCP fixes, keyboard-only pass, SEO and cache verification ([#1939](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1939)) ([d869b04](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d869b047237328335079cdc82acc94ef6c375d6c))
* **web:** migrate marketing site from Next.js to Astro static + Cloudflare Worker variant ([#1866](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1866)) ([eedea02](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/eedea02e0e49138988ff148f805546751805bd12))
* **web:** refresh marketing surfaces and navigation ([#1927](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1927)) ([1ed147f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1ed147f8bdd7d42c98d7bb110499cbf6e4690c62))
* **web:** regression matrix for M5.1 plus interaction E2E coverage ([#1916](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1916)) ([cddb6cb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cddb6cbf72f15404dbfbcbb3eb7c87c4a3d41850))
* **web:** serve degen 3D models as R2-hosted GLBs ([#1972](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1972)) ([f20b6f7](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f20b6f73cb52e828b16e0fa71f7550108d288791))


### Bug Fixes

* app-route-cleanup-audit-comments ([#1940](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1940)) ([6cf99ad](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6cf99ada8d2b413f525b0a8ffc62ef2ac8a16b7a))
* **ci:** replace bunx-chained install command for Vercel builds ([#1995](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1995)) ([aa54a01](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/aa54a01d0a1616a551ef011aea5e5394ed975934))
* **fonts:** declare the shared faces once and repair web's special-face drift ([#1893](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1893)) ([3eda7c5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3eda7c5d2ac90b153236ed315cc737a8ef45f0fc)), refs [#1887](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1887)
* **global:** clean Nifty World routes and audit comments ([#1938](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1938)) ([0739b8e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0739b8e5ea8813681aecb08df1898335af6c6a44))
* **seo:** consolidate docs on the apex /docs surface and clean sitemaps ([#1976](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1976)) ([cbbc094](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cbbc094c1fc46f9056d95a212c7ef60e6429298a))
* **web:** address marketing page layout and styling feedback ([#1936](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1936)) ([a70d2d2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a70d2d24aaa7cb5b5813e0418df84b380aa6010e))
* **web:** console-game load timing, seamless avatar marquee, roadmap cropping ([#1868](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1868)) ([2202aa4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2202aa4cd4e4f998c02d8533739e6b71a17596cd))
* **web:** hide the game-card tag when the headline row cannot fit it ([#1964](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1964)) ([c148fd4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c148fd4ba58eeb9722c6fff66bd71741daf31520))
* **web:** scope responsive hero preload ([#1941](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1941)) ([1a57c6d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1a57c6db08c9ac31ecb5f9fd30d9c6034199a3cf))
* **web:** serve degen run-cycle sprites as animated WebP ([#1978](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1978)) ([1b7a298](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1b7a29870cda4bef4062890fdf718998094181ed))
* **web:** shell rewrite destinations must use clean urls ([#1867](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1867)) ([a7426ab](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a7426ab5626d5e8371a0bb45d984816d9869e3b8))


### Performance

* complete M5 follow-up audit ([#1943](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1943)) ([7a79f14](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7a79f14bb2e27701317fc97c59da1caeddb31bc2))
* post-migration modernization pass across web, smashers, and app ([#1946](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1946)) ([d462b8b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d462b8b2a0d09ab21b69edba1e8e8714f0387b3a))


### Maintenance

* **astro:** adopt the shared app config and Astro tsconfig base ([#1896](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1896)) ([dd2d546](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dd2d546183e2dcc8d668ac4f61c11c04a5098716)), refs [#1888](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1888)
* **images:** share the image attribute contract across surfaces ([#1905](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1905)) ([0ca7745](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0ca7745350736df945cd39f77cf8acfbc79da08f)), refs [#1836](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1836)
* **lint:** adopt strict @shadcn/lint, Kobalte primitives, and React-era cleanup ([#1961](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1961)) ([d08c29f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d08c29f96cce9fa51f30ab082c68d3415a0d7500))
* **telemetry:** share the activation primitive and container loader ([#1897](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1897)) ([66f28cf](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/66f28cf8239433c91e81819843b0acbb7edbd52e)), refs [#1889](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1889)
* web-astro-shell-native ([#1951](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1951)) ([ff6f07b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ff6f07b98ad88fa12e9977d97a19ae116e9a4106))
* **web:** remove dead imports and preserve deferred chunks ([#1873](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1873)) ([6aa61ad](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6aa61ad6292c919acb46ac2b02f4423bdd1dfd5f))
* **web:** remove the dead Next-compat Link shim ([#1894](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1894)) ([64bb6d8](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/64bb6d8ca3049eae9b61e331b03d8f24a31c8d05)), refs [#1891](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1891)
</details>

<details><summary>contracts: 1.0.1</summary>

## [1.0.1](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/contracts-v1.0.0...contracts-v1.0.1) (2026-09-21)


### Bug Fixes

* app-route-cleanup-audit-comments ([#1940](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1940)) ([6cf99ad](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6cf99ada8d2b413f525b0a8ffc62ef2ac8a16b7a))


### Performance

* **app:** defer Blocknative notifications ([0d27409](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0d27409e8d6e64c949728362c0002df7ca395485))
* **app:** slim client contract deployments ([2c891c1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2c891c165c7cd09c03a9e1273a5cae5c8fa0b12f))
* **ui:** exclude test sources from production css ([ccc7f82](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ccc7f829394a60439c33b71e85c846fe3cde652c))
</details>

<details><summary>astro-config: 1.0.1</summary>

## [1.0.1](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/astro-config-v1.0.0...astro-config-v1.0.1) (2026-09-21)


### Bug Fixes

* app-route-cleanup-audit-comments ([#1940](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1940)) ([6cf99ad](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6cf99ada8d2b413f525b0a8ffc62ef2ac8a16b7a))
* **web:** scope responsive hero preload ([#1941](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1941)) ([1a57c6d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1a57c6db08c9ac31ecb5f9fd30d9c6034199a3cf))


### Performance

* complete M5 follow-up audit ([#1943](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1943)) ([7a79f14](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7a79f14bb2e27701317fc97c59da1caeddb31bc2))


### Maintenance

* **docs:** dedupe the GTM loader and Astro app config (M4.0) ([#1892](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1892)) ([4fd12c6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4fd12c6e124b0fa03bcd6a0ead4a1f0f05e6ee4b)), refs [#1881](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1881)
</details>

<details><summary>playfab: 2.0.0</summary>

## [2.0.0](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/playfab-v1.0.8...playfab-v2.0.0) (2026-09-21)


###   BREAKING CHANGES

* **lint:** adopt strict @shadcn/lint, Kobalte primitives, and React-era cleanup ([#1961](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1961))
* migrate monorepo from React to SolidJS ([#1955](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1955))

### Features

* migrate monorepo from React to SolidJS ([#1955](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1955)) ([1e54f2c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1e54f2c1c1b4460f9711fa09b485dbebac29afa1))
* **smashers:** migrate from Next.js to Astro SSR without next-auth ([#1869](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1869)) ([fd81af2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/fd81af23cb791bf8db3ebf6bf4e1016638dca2a8))


### Bug Fixes

* app-route-cleanup-audit-comments ([#1940](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1940)) ([6cf99ad](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6cf99ada8d2b413f525b0a8ffc62ef2ac8a16b7a))
* **playfab:** await wallet signature validation ([#1994](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1994)) ([cba1934](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cba1934c568020b158102d195ed7af703eb88604))
* **playfab:** gate the user-session fetch to the client ([#1960](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1960)) ([d5b3e36](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d5b3e36ee3086a545e8b3e450b08764b497fa9ee))
* **playfab:** resolve crypto off globalThis so server-side signup can generate usernames ([#1947](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1947)) ([73b8c5b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/73b8c5bf1ae4f344372aad4f8ef9299f13bdf2c5))


### Maintenance

* **lint:** adopt strict @shadcn/lint, Kobalte primitives, and React-era cleanup ([#1961](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1961)) ([d08c29f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d08c29f96cce9fa51f30ab082c68d3415a0d7500))
</details>

<details><summary>typescript-config: 2.0.0</summary>

## [2.0.0](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/typescript-config-v1.0.1...typescript-config-v2.0.0) (2026-09-21)


###   BREAKING CHANGES

* migrate monorepo from React to SolidJS ([#1955](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1955))

### Features

* **app:** migrate from Next.js to TanStack Start ([#1870](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1870)) ([5576b04](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5576b04272582a000fc996770ef79e5fa6f257d2))
* migrate monorepo from React to SolidJS ([#1955](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1955)) ([1e54f2c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1e54f2c1c1b4460f9711fa09b485dbebac29afa1))


### Bug Fixes

* app-route-cleanup-audit-comments ([#1940](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1940)) ([6cf99ad](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6cf99ada8d2b413f525b0a8ffc62ef2ac8a16b7a))


### Maintenance

* **astro:** adopt the shared app config and Astro tsconfig base ([#1896](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1896)) ([dd2d546](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dd2d546183e2dcc8d668ac4f61c11c04a5098716)), refs [#1888](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1888)
</details>

<details><summary>ui: 2.0.0</summary>

## [2.0.0](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/ui-v1.0.19...ui-v2.0.0) (2026-09-21)


###   BREAKING CHANGES

* **lint:** adopt strict @shadcn/lint, Kobalte primitives, and React-era cleanup ([#1961](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1961))
* migrate monorepo from React to SolidJS ([#1955](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1955))

### Features

* **analytics:** unify the web-vitals payload and gate telemetry to production ([#1919](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1919)) ([ec77480](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ec77480181f9e90bbbb2f2eeb19a42e881297763))
* **app:** migrate from Next.js to TanStack Start ([#1870](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1870)) ([5576b04](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5576b04272582a000fc996770ef79e5fa6f257d2))
* migrate monorepo from React to SolidJS ([#1955](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1955)) ([1e54f2c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1e54f2c1c1b4460f9711fa09b485dbebac29afa1))
* **smashers:** M5.6 complete audit  SSR auth surfaces, cache policy, sitemap truthfulness, dialog wiring ([#1931](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1931)) ([cd1caac](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cd1caacbeb32ddc187639ef3d28165d8e912eb1b))
* **ui:** make the shared primitives accessible and pin the contracts ([#1900](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1900)) ([1c382c6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1c382c684aa9ad06536eb081a913d696f15c9638))
* **web:** migrate marketing site from Next.js to Astro static + Cloudflare Worker variant ([#1866](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1866)) ([eedea02](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/eedea02e0e49138988ff148f805546751805bd12))
* **web:** refresh marketing surfaces and navigation ([#1927](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1927)) ([1ed147f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1ed147f8bdd7d42c98d7bb110499cbf6e4690c62))
* **world:** add Nifty World scene browser ([#1928](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1928)) ([6e5f369](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6e5f369a4fd47a6ef022030aa34f941c179b0b3a))
* **world:** refine scene card navigation ([#1930](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1930)) ([8afd71c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/8afd71c504088b82f03bc9a7059fde483b4e46c4))


### Bug Fixes

* app-route-cleanup-audit-comments ([#1940](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1940)) ([6cf99ad](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6cf99ada8d2b413f525b0a8ffc62ef2ac8a16b7a))
* **fonts:** declare the shared faces once and repair web's special-face drift ([#1893](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1893)) ([3eda7c5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3eda7c5d2ac90b153236ed315cc737a8ef45f0fc)), refs [#1887](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1887)
* **global:** clean Nifty World routes and audit comments ([#1938](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1938)) ([0739b8e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0739b8e5ea8813681aecb08df1898335af6c6a44))
* **security:** add missing rel=noopener on target=_blank links, remove no-op BuyCard handler ([#1993](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1993)) ([2b8733f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2b8733fbd91de9e2a86276b11227347a7c724e11))
* **smashers:** preserve accessible auth interactions ([#1997](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1997)) ([9d08afb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9d08afb4a7ad441331b513fce6cb398c6df28513))
* **smashers:** repair the runtime regressions from the Astro migration ([#1874](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1874)) ([b2a2bff](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b2a2bff519ef9ac877807cc5536c7881f5fbfe2f))
* **ui:** harden auth forms against pre-hydration GET submits ([#1948](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1948)) ([64758d0](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/64758d0b7d91be19f2a8fc20922c30e91e78cb15))
* **ui:** hydrate the console game island via lazy + Suspense ([#1957](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1957)) ([02f1294](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/02f1294d4c456c8f91d49aa80a23f6be8ca60b05))
* **ui:** keep a minimum gutter on fluid containers at 2xl ([#1958](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1958)) ([b1d7ed4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b1d7ed4646786a22878ebce36d05520465309d14))
* **ui:** restore the console-game controller float offset ([#1965](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1965)) ([796c2b1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/796c2b188b4d1828e6209744baa936055e181963))
* **ui:** stop double-locking document scroll in dialogs ([#1963](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1963)) ([7ed217d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7ed217d679e92d6e91ac8bccccf758888413fbac))
* **web:** address marketing page layout and styling feedback ([#1936](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1936)) ([a70d2d2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a70d2d24aaa7cb5b5813e0418df84b380aa6010e))
* **web:** console-game load timing, seamless avatar marquee, roadmap cropping ([#1868](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1868)) ([2202aa4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2202aa4cd4e4f998c02d8533739e6b71a17596cd))
* **web:** scope responsive hero preload ([#1941](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1941)) ([1a57c6d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1a57c6db08c9ac31ecb5f9fd30d9c6034199a3cf))


### Performance

* **app:** drop React-era store/timer deps and fix dead effect cleanups ([#1967](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1967)) ([3763944](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/376394440b2e02755589a70c2e72b7c464fc9ecf))
* **app:** replace nuqs with local parsers, guard auth race, prefetch leaderboard ([#1968](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1968)) ([db7050a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/db7050aff29dbc6f33beb3996d42e7c120f4fa83))
* **app:** SolidJS architecture audit  shared state, cached contract reads, intent preloading ([#1971](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1971)) ([44d5e97](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/44d5e9792b7765a23cd37f1f5908ab56d3b90ce1))
* complete M5 follow-up audit ([#1943](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1943)) ([7a79f14](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7a79f14bb2e27701317fc97c59da1caeddb31bc2))


### Maintenance

* **docs:** dedupe the GTM loader and Astro app config (M4.0) ([#1892](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1892)) ([4fd12c6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4fd12c6e124b0fa03bcd6a0ead4a1f0f05e6ee4b)), refs [#1881](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1881)
* **images:** share the image attribute contract across surfaces ([#1905](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1905)) ([0ca7745](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0ca7745350736df945cd39f77cf8acfbc79da08f)), refs [#1836](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1836)
* **lint:** adopt strict @shadcn/lint, Kobalte primitives, and React-era cleanup ([#1961](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1961)) ([d08c29f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d08c29f96cce9fa51f30ab082c68d3415a0d7500))
* **telemetry:** share the activation primitive and container loader ([#1897](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1897)) ([66f28cf](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/66f28cf8239433c91e81819843b0acbb7edbd52e)), refs [#1889](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/1889)
</details>

---
This PR was generated with [Release Please](https://github.com/googleapis/release-please). See [documentation](https://github.com/googleapis/release-please#release-please).
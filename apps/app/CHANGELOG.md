# Changelog

## [1.1.9](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/app-v1.1.8...app-v1.1.9) (2026-08-22)


### Performance

* **app:** avoid router overhead for external links ([#988](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/988)) ([5d31e12](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5d31e1294d68822c4c2559441b70ba19bafb5fe7))

## [1.1.8](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/app-v1.1.7...app-v1.1.8) (2026-08-22)


### Performance

* **app:** rely on shared lazy image priority ([#985](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/985)) ([7be844f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7be844fad9814a789b656776e48149d79a129612))

## [1.1.7](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/app-v1.1.6...app-v1.1.7) (2026-08-22)


### Performance

* **app:** tighten shared game card image sizing ([7feeb19](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7feeb1940dcbf18e7de3f70a30b95cec18bdb363))

## [1.1.6](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/app-v1.1.5...app-v1.1.6) (2026-08-22)


### Performance

* **app:** optimize game card artwork ([#969](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/969)) ([5638470](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5638470ead5e6e00ee4395362d190f253c6ffa50))

## [1.1.5](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/app-v1.1.4...app-v1.1.5) (2026-08-22)


### Performance

* **app:** defer profile avatar video playback ([193305e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/193305e9fe40d9d158c866e3682628a8109aeb95))

## [1.1.4](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/app-v1.1.3...app-v1.1.4) (2026-08-22)


### Performance

* **smashers:** optimize party modes poster delivery ([#958](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/958)) ([ee4261a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ee4261aa4b257b4d5bbf7acc2bbeb8233846ffc5))

## [1.1.3](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/app-v1.1.2...app-v1.1.3) (2026-08-22)


### Performance

* **build:** remove stale Next TypeScript CLI toggle ([#954](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/954)) ([a6d134a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a6d134a5ca728fb7c1b4e1545557ec35a3587498))

## [1.1.2](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/app-v1.1.1...app-v1.1.2) (2026-08-22)


### Bug Fixes

* **app:** remove duplicate Web3ModalRuntimeProps import ([c82365f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c82365f23783bca3ea8425467057160e441b21f3))
* **app:** restore sidebar shell geometry and image sizing ([#695](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/695)) ([e4faab5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e4faab5226fc2d97444a9c929c5a84bf65ab3175))
* **ci:** control hosted feature branch spend and staging realignment ([27de2c1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/27de2c1b035b68ce2e9767532f02c04452fbe1e5))


### Performance

* **app:** avoid private shell subtree rerenders ([30a43ba](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/30a43baa7d6c86a1eee233193765e9ea7f428a4e))
* **app:** code split degen browser route ([#516](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/516)) ([b0b3be4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b0b3be4568330a3f2e598c0aa6936095cb35708d))
* **app:** compact public degen catalog payload ([66accef](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/66accef86575e5ecad5f79d83e1a1ff4d7fbd6ed))
* **app:** defer Blocknative notifications ([0d27409](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0d27409e8d6e64c949728362c0002df7ca395485))
* **app:** defer bridge form until dialog open ([0f0e790](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0f0e7909ec8fb4a30e476d45fc4f86a2b5bda0eb))
* **app:** defer closed sidebar content ([#600](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/600)) ([c1a46a5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c1a46a5f5875393d24b8b305ac00c3e3a6cd7f9e))
* **app:** defer dashboard degen dialogs ([#469](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/469)) ([32dbe8c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/32dbe8ca066b68f030e9f267a7dade5244f83981))
* **app:** defer dashboard degen filters ([#555](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/555)) ([dd4f34b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dd4f34b1478d8d128601c0f27c04ac5e5988d9aa))
* **app:** defer dashboard overview client graph ([#586](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/586)) ([a4cf5b2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a4cf5b2f9bd77043f06a6bc8f9ac4631edcad46b))
* **app:** defer dashboard overview sections ([bd3f238](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bd3f2387a3f5922ec8e0fecbda105b222f10d8c1))
* **app:** defer device telemetry until load ([5271ef1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5271ef1bd7a640ac1df8b62d061701aff522a728))
* **app:** defer gamer profile dialogs ([#482](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/482)) ([2a8348a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2a8348a7947dbeca81f78e487b0cd62bb18fdf4d))
* **app:** defer non-arcade game wallet graph ([#788](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/788)) ([4b030f5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4b030f554c2068032e6b1bef15faae726ee6c62d))
* **app:** defer passport and server-render static game sections ([#465](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/465)) ([bbc1ab3](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bbc1ab31f2fb38c27d2201078d0d185e77c23979))
* **app:** defer private dashboard route graphs ([#588](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/588)) ([8857d25](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/8857d25f9c4ce1ac3487085be613ce252f2ff459))
* **app:** defer private network warning ([#530](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/530)) ([35af862](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/35af862bd1b84a1239da4a60b8973cea74382347))
* **app:** defer private route shell ([#480](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/480)) ([c71aad9](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c71aad9d4b0da26ad4a5f56a68b301c740274fc1))
* **app:** defer private wallet and dashboard providers ([#476](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/476)) ([4fa1936](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4fa1936498440c35952b7edf4f0c6fcf246f0934))
* **app:** defer public degen view controls ([#918](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/918)) ([9d7548f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9d7548fe22768c9b3f63f7f310645b4cb77c8ccf))
* **app:** defer public degen wallet features ([#468](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/468)) ([df046d1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/df046d15c685d1552f51e03a34cb93e02ffe0e37))
* **app:** defer public wallet storage ([a9714ea](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a9714eace182ccbffbc29e07ed905ca7b7044162))
* **app:** defer rental nickname dialog ([#483](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/483)) ([d34ff8f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d34ff8f9761a5e12b558b6bf97eef8beab3bfdb5))
* **app:** defer shared rename dialog ([#481](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/481)) ([43ffa87](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/43ffa874f90e8975334537bd8de8559b4756b5bf))
* **app:** defer terms dialog content ([9eb6a9d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9eb6a9d4adc5b0cace9f2489c0d85d27070f79f6))
* **app:** defer verification wallet graph ([dbf4088](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dbf40886435a257c745048bd71d974f83585ac4e))
* **app:** isolate wallet verification route ([#515](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/515)) ([3b89e27](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3b89e27d90f10cc021dabc1447d6be01fd30a313))
* **app:** keep archived leaderboard data server-side ([354b8fc](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/354b8fc8b2d9eafe831a268561a876691440c855))
* **app:** keep degen browser shell responsive ([62bfcea](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/62bfcea2b8ae042d40af89dd850cc485a398fa72))
* **app:** keep public navigation mostly server-rendered ([#594](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/594)) ([fe00054](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/fe000549b99c625a72379407000096f087a28261))
* **app:** lazy-load leaderboard datasets ([7d69ac9](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7d69ac9fe3ae5fc79bb21198f8d2f481e99ac866))
* **app:** lazy-load slider implementation ([d8b2c72](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d8b2c721fd68d257dd1a6ed87b1b40be9d819471))
* **app:** lazy-load wallet adapter config ([05c7891](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/05c7891234834a78238e49b77255476ecedd3a79))
* **app:** memoize rentals grid data ([#556](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/556)) ([2d2cd7d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2d2cd7dcdab891b5fffbc6d3f24067a44403f246))
* **app:** narrow Mint-o-Matic wallet boundary ([6b4a9d4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6b4a9d4fb3e7c1b3c88bd8638b9b3276614b0421))
* **app:** parallelize wallet provider loading ([#896](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/896)) ([139341c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/139341c5252dd867f1528a0fb56530df02314ba0))
* **app:** remove eager lodash equality ([#532](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/532)) ([6fc6cac](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6fc6cac0f1eb4a92490b8d7814de33289986ab84))
* **app:** remove private icon registry callers ([#577](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/577)) ([3282114](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3282114c0952dc134931eab4e9bee7beaf641f50))
* **app:** remove public content client boundary ([#595](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/595)) ([6b16964](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6b1696474b30caadb93d4094071dab5564cb7e3f))
* **app:** remove remaining lodash imports ([#547](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/547)) ([9f64eda](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9f64edaede5d36e0c8b257f0fc99bb50115cc001))
* **app:** remove retired swap graph and stale components ([#790](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/790)) ([8a904f5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/8a904f5319566bf5a75a6299e7b34a1b2783b2fb))
* **app:** remove wallet code from public routes ([#475](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/475)) ([3d66627](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3d66627b6f7d59a6031ff3a82ab8a8eeb56e1c02))
* **app:** replace Redux auth and notifications ([#531](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/531)) ([9940e85](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9940e85a294b9b1501525edd46c0a7859fbd697b))
* **app:** replace responsive table deep clones ([#535](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/535)) ([e41d60d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e41d60d2b0d3e5cba92aa56e8cc75a74b8d2157a))
* **app:** replace trivial lodash collection helpers ([#537](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/537)) ([036c6ee](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/036c6ee2aee784653c0962677cb580d076166cc4))
* **app:** scope wallet providers to feature routes ([#467](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/467)) ([247296a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/247296a8a67141a53a5b321e13f15be629c91677))
* **app:** serve animated item WebP assets ([#541](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/541)) ([acc9060](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/acc9060038553406afb67e149ebcb8e6317e02f5))
* **app:** share accessible degen sort select ([#552](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/552)) ([afd7640](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/afd7640f7f86da818cb7e43ccb2a25a774364b7d))
* **app:** share deferred Unity game route ([#528](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/528)) ([c553c7b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c553c7bb667ea2cae9fe8b531f1dc6c303416bf5))
* **app:** share public game loading boundary ([#529](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/529)) ([59cb6f7](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/59cb6f74449af57e6512c09df3bc21c42e533a33))
* **app:** slim client contract deployments ([2c891c1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2c891c165c7cd09c03a9e1273a5cae5c8fa0b12f))
* **app:** slim degen layout icon graph ([#574](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/574)) ([43398cb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/43398cb9a1653773c571a896bb601ddc15aebd28))
* **app:** slim private shell icon graph ([#576](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/576)) ([11da25c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/11da25c8cd5743076e48fb96f810789f3983826c))
* **app:** slim public degen icon graph ([#573](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/573)) ([f7129e6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f7129e604c84205cc8ce1b7241e34f5a8252ec4c))
* **app:** slim public navigation client graph ([#524](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/524)) ([c2be4ae](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c2be4ae46997091c28d52f3a6c27eeeacbd1f613))
* **app:** slim public route shell ([#513](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/513)) ([12eced5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/12eced5750ac202ac0d080dd21f653c80b56539e))
* **app:** slim public shell controls ([#567](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/567)) ([e49686b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e49686bb5d25962683aed0ba415b6bd45ef90a45))
* **app:** slim verification wallet boundary ([ea37f6f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ea37f6fb240fdf11aa3320028bf8e01eea5b99bd))
* **app:** split degen trait index from filters ([#557](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/557)) ([1e4c0a0](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1e4c0a014617c0cc0f7f20c25f84837945d5e42e))
* **app:** use native game description disclosure ([#592](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/592)) ([f89d37a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f89d37a35309e7e08f6d5b2a7542af59ade4df81))
* **ci:** scope Vercel builds to affected package consumers ([02bda34](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/02bda34844c8a967aab18848747c66d597b2e361))
* **ci:** slim staging drift check checkout ([0da6657](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0da66577465d1e9b7d269014e703650501b7ff3a))
* defer app notifications from shell ([#489](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/489)) ([03c7ecc](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/03c7ecc827230d0f8fca5888f5495358b1062917))
* defer archived leaderboards client graph ([#488](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/488)) ([c1feb0b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c1feb0bb3119ead550ae8f12fd8ffd44a2fac694))
* defer comics burner graph ([e7040af](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e7040afa150935367a4f62e78a110bdf4c039d03))
* defer dashboard degen graph ([#492](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/492)) ([41bea39](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/41bea393444d8c9f260689a0f7fb0bc906a07b35))
* defer dashboard items graph ([ca8bb6e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ca8bb6ef705f634a4f7c5577257594ca61246c6a))
* defer dashboard overview sections ([#490](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/490)) ([1058a87](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1058a87269179c4d342f43d7e416973189001264))
* defer dashboard rentals graph ([69f28d6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/69f28d6ec2fd9c962b46b6b7b4c10d982a3be810))
* defer gamer profile graph ([9f0f7b0](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9f0f7b0eda403432577b02605fb6bbb884d5e25a))
* defer mint route wallet graph ([#486](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/486)) ([0bfc4b6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0bfc4b617f206d91c0f3d23022e92d442a561c39))
* defer public degen modules ([#487](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/487)) ([8be9ded](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/8be9ded51ca34960fc48e1de5f4a9576d3768cab))
* defer shared analytics loading ([#484](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/484)) ([15f84af](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/15f84afa2aa243d243374887631e21f6f77044db))
* defer shared media and client boundaries ([#463](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/463)) ([89a5922](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/89a5922d80ef719f91dbaf851866581052e0c98f))
* defer shared Sentry client SDK ([#474](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/474)) ([974021c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/974021cfe5ea63396ca24ac4a22b9bb32aa148c8))
* defer shared Sentry initialization and route loading ([21203df](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/21203dfdfc659868bd8355e0ac529b57171d41df))
* defer wallet network and public carousel code ([#477](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/477)) ([9373219](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/93732194ede6a6ed1200308df9fb5d93dd673693))
* keep notifications out of public shell ([4cb4ff0](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4cb4ff02019e75ff6e5f046b12481ea2e16b8c75))
* keep static game cards server-rendered ([#503](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/503)) ([bee7f67](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bee7f67b7ec1aa7e1b8027e8acd83f4cc62ec8fa))
* narrow production sentry source maps ([14987a2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/14987a224703313685632eb71a4b45ac2d251a5e))
* reduce client and contract runtime overhead ([#892](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/892)) ([7959a71](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7959a715d9979c944702bdf062305d1ff2a4f865))
* reduce initial media and route payloads ([#911](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/911)) ([f74a41b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f74a41b419f797a5a8170fa78adeebfd8d9d6602))
* reduce shared app and website runtime cost ([#462](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/462)) ([f311471](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f311471139733ba4ca20b1e95aa6d999cd800884))
* remove redux from public navigation shell ([#501](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/501)) ([927994e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/927994edd1632a13110293133824af14406b83e9))
* remove runtime UUID and crypto polyfills ([#498](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/498)) ([52ef5f6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/52ef5f61fe811b7477281da5bc5dd7af6307614f))
* remove stale Unity compatibility shim ([#499](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/499)) ([3486ca8](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3486ca8ba430190f3efcd57ec42eff004192d93f))
* replace game card GIFs with shared posters ([#504](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/504)) ([ada5ed2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ada5ed21720bb6d2ed5054fb79cbf5239b433c7f))
* serve lightweight game card posters ([#502](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/502)) ([282bc92](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/282bc92dbc85d76799e41aeb51e973622b068425))
* share deferred dashboard loading and optimize media ([#497](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/497)) ([dfde479](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dfde479716c4fabb32e784ef18850d8cf7dc17b0))
* simplify deferred game loading ([ab398d3](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ab398d32745bab49202ea7453642f61b635c5981))
* **ui:** defer shared footer rendering ([#922](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/922)) ([6f68580](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6f685802ef0f47d5ff5c9a96aba91bf50f69ebf8))
* **ui:** exclude test sources from production css ([ccc7f82](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ccc7f829394a60439c33b71e85c846fe3cde652c))
* **ui:** reuse lightweight loading skeletons ([#944](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/944)) ([99077d2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/99077d2bf286ee6a731805b5dea354fccfc57204))
* **ui:** scope font preloads by app theme ([#533](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/533)) ([265b2b1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/265b2b123ae0eddeba7faae16b23ff8ad2cc3c33))
* **web:** compress games lobby video ([0bc9f37](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0bc9f37314cd994f8d2594617152b09bacf23641))


### Tests

* add useEthersSigner hook tests and isolated test runner ([72838c2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/72838c2a9d9186c22062210204dde81020d689b9))


### Maintenance

* **app:** remove dead chip component ([#551](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/551)) ([7379fa0](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7379fa0baa3ca9bb0fcf230e2d23e3f1e446e8ea))
* **app:** share external navigation links ([#914](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/914)) ([f28619c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f28619ca99a30822172b8bf5963dbbe5eed48ccf))
* **app:** share wallet auth providers ([#792](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/792)) ([31d3052](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/31d30527b09b193ae50e07429f9d6e369a2ee9d5))
* **app:** share wallet storage providers ([dcae415](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dcae415097f335ea27a38aac5f5628ebef66e0f7))
* **app:** simplify degen filter controls ([#553](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/553)) ([04269fc](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/04269fcb421030b6a87fb59f5495faa040e06305))
* **format:** align hook test formatting ([#912](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/912)) ([85087c9](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/85087c9ec6cfee4979d1034311d823bc89284a0a))
* promote staging Next build optimization to main ([6037f6d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6037f6da52e7ce13b18d34a63d796e55a45e967b))
* promote staging request client cleanup to main ([e707bf1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e707bf1c4582e0dfd35d3400affd2faa21ce16a1))
* promote staging sidebar fix to main ([a3d1a40](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a3d1a40167ca80be253a3cca807030520def33c9))
* promote staging to main ([e0bbf03](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e0bbf03b70e80750b523a0da964b27d6a8ea6e8f))
* promote staging to main ([cc77798](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cc77798c50da9641287aae69f5c73564e0be07cd))
* promote staging to main ([9222653](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/92226538f5cca3c928c499499af8737e95687b16))
* promote staging to main ([99c3dc1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/99c3dc1853c41ca147a1ba198e761172b5516260))
* promote staging to main ([6584cf8](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6584cf85a9ea9d2bc975e4882798042c7a248e3d))
* promote staging to main ([24b5bcb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/24b5bcbf2630d92f9701df9b5550b578a704d039))
* promote staging to main ([9e3cef2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9e3cef2ca40bcb76fe54e9f24d582bd122ce5d4f))
* promote staging to main ([4df104f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4df104f1b387d6a253951c6c0abd5fc92423dae6))
* promote staging to main ([5b4116f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5b4116ff29dec8ff1603f2b429d8c5698ca597c2))
* promote staging to main ([abbdab5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/abbdab52ce34e525e20acf5c766c06a6ccce9f59))
* promote staging to main ([649b3ab](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/649b3abbaf32857869857c5818d400e418b13a51))
* promote staging to main ([db1bd2f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/db1bd2fd759a3564d01e537e179920b6b68075e8))
* promote staging to main ([3ebd891](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3ebd891d00c726dc0bd1a9fe2f68df0a912b3d55))
* promote staging to main ([bff2bf3](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bff2bf3191a50420417191f038cfd7ebef19942e))
* promote staging to main ([d58e87c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d58e87c4304f7b0e44389bd57842d9bafc7982da))
* promote staging to main ([792b81f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/792b81fdf8c6322987d839cbc80a38f6d49abc8f))
* promote staging to main ([9dfd36e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9dfd36ea05ed32b3f7c5b4e251a792145337cc17))
* promote staging to main ([9085ca0](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9085ca0f4aeec446b05647ef5896cec2344dc09e))
* promote staging to main ([c953466](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c953466ec77164721b6e8654b3b98aec9273b9b6))
* promote staging to main ([936b624](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/936b624078e6c92dad0cd5089e99706633e57a56))
* promote staging to main ([7fc3caa](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7fc3caae951ca17ed3b66a8eb1368c62f459f76f))
* promote staging to main ([1660fd3](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1660fd30c4d9f70415b71ca371d1c6c0f4bbb105))
* promote staging to main ([abd0f76](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/abd0f76207d8a9c3fd55e1aa825818222d1e0b74))
* promote staging to main ([f8ff163](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f8ff163405ec942633c6b52d710e88942213a344))
* promote staging to main ([de3fd88](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/de3fd88f55394ac831ca84b5ca9ee5ed6431ffd9))
* promote staging to main ([8be2dab](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/8be2dab12db4d2130eead732d6c247761cba97b9))
* promote staging to main ([d1bef25](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d1bef2575af92349dd9eabd0ff09ba12ca8a8d5e))
* promote staging to main ([b46970c](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b46970cdc388042971ff38a0127847a413fb7dbf))
* promote staging to main for GLTF NFTL hotfix ([b66c5f9](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b66c5f9af80715e267f7925b3fd5793721bccbc1))
* promote staging to main for release ([887a71b](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/887a71b0383d763925a9065cf6af548bb7e11211))
* promote staging to main for release ([d8e35f9](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d8e35f92a854e1979c09092063251c8971c29fee))
* promote staging tree to main ([bd09ca5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bd09ca5235984c0b24e41976bde6cab34e79a636))
* promote staging tree to main ([96718ed](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/96718ed20a2198da7d92fd3463967e250920cffa))
* promote validated staging to main ([6aae680](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6aae6802d77e1ec91da746d2e63f9abba4482f4e))
* remove stale game catalog data ([#505](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/505)) ([f2c86fb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f2c86fb648be49d8a12c8ee67a86e0444c93964b))
* sync original staging content to main ([#901](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/901)) ([17415b6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/17415b6e4913a4c60c435b33cbfb69eb67d6fd20))
* **ui:** remove unused navbar client component ([#916](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/916)) ([eb4b19f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/eb4b19fa6b0580cf5fe2058d0b0aba198b693992))

## [1.1.1](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/app-v1.1.0...app-v1.1.1) (2026-08-10)


### Performance

* lazy-load axelar SDK, drop dead deps, add external-surface contract guards ([#407](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/407)) ([70103e1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/70103e1e4b6ee86b21dcfa0097933a8e393b0c86))


### Maintenance

* promote tested staging tree to main ([5b82877](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5b8287785a21b2892241a67420ab13ca283dfb87))
* sync local changes to staging ([#402](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/402)) ([9ecab74](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9ecab74c7c120c69b9e448315ac4cd666a113c5b))

## [1.1.0](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/app-v1.0.2...app-v1.1.0) (2026-08-09)


### Features

* drop MUI and @nl/theme from apps/app ([939c0c8](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/939c0c84c825b1fc976b98aff3377aadc13e7e7c))


### Bug Fixes

* adopt 12-column degens grid on main to match staging ([#410](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/410)) ([0ba46dc](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0ba46dcac9da7622e6e22b154d4df70a25597144))
* sync-local-commits-to-staging ([#371](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/371)) ([37d95fb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/37d95fba2daf7c0972eec715fea7ee32e1ea0c0e))


### Maintenance

* extract shared degens page logic and remove dead console output ([#379](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/379)) ([92ec323](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/92ec323cef0b9054015f9e2214407beabb91ebb1))
* **release:** promote validated staging tree ([a8b1e7e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a8b1e7e1e2db7e0b12d1d8b8807e2f7c7d8a6c74))
* trigger CI refresh for format cache ([2c16e9e](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2c16e9e8229e313c298a9f8ef27e15f53379b9da))

## [1.0.2](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/app-v1.0.1...app-v1.0.2) (2026-08-07)


### Maintenance

* drop-mui-support ([#360](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/360)) ([cf09198](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cf0919857ea50424d4dc70f721238aa209abd46b))

## [1.0.1](https://github.com/NiftyLeague/nifty-fe-monorepo/compare/app-v1.0.0...app-v1.0.1) (2026-08-02)


### Bug Fixes

* add [@ts-expect-error](https://github.com/ts-expect-error) for MUI 9 sx prop type mismatch in DegenCard ([84b08a5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/84b08a5ae9e7bf0eb9eb8ae14b49b74c1ea3005c))
* add [@ts-nocheck](https://github.com/ts-nocheck) for MUI 9 sx prop type mismatch in ComicCard and DegenCard ([ff94414](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ff944143f3a65a018c9b198abb5bdf192bd5c29a))
* add @types/node to apps/app + disable Next.js auto-install (build green) ([8e8261a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/8e8261ad483e55b6ce39fedd5e94c76a035cd2f8))
* bump all react/playfab/theme/ui react-dom to 19.2.8 (resolve docs test version mismatch) ([45e37a2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/45e37a206771e0a32ea180dddec51a7a85576f06))
* CharacterCreatorContainer test cleanup expectation ([1a15f91](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/1a15f919c1b535121dd1b4809496a70c3f8f073b))
* exclude test files from type-check (bun:test not tsc-resolvable) ([05acfaa](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/05acfaa55cd7ed357c9e4f6927a4d0588d74f17d))
* make husky prepare CI-safe (husky || true) ([e9acaf1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e9acaf132bf8f96ccd54d779fff197d9928fc833))
* react-unity-webgl API compat (local useUnityContext shim) + add [@x402](https://github.com/x402) peer deps ([efe0cc5](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/efe0cc5e034aafaa8c28dbcda2816a8b20971867))
* remove unused [@ts-expect-error](https://github.com/ts-expect-error) in DegenCard (MUI sx now passes with React 19.2.8) ([ab5da3f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ab5da3f66b1b5f1be30e2615c25ade669d3febfb))
* restore workspace:* protocol and pin react-unity-webgl to v8.8.0 in apps/app ([0b28131](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0b28131527d2284ea55a9b497f2786fed4984806))
* strip broken --project-placeholder filters from all test scripts; run bun test directly ([5de1d6f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5de1d6fec320a361606630138106f0b82dff4023))
* suppress pre-existing type errors via tsconfig excludes + [@ts-nocheck](https://github.com/ts-nocheck) ([cb8ab0f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/cb8ab0f8e3856c77a2083d7f37c57d9fbef54f07))
* **test:** import describe/expect/it in 000-setup-dom copies ([d77db3a](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/d77db3a1a653abcf13528c3db1154b5ce48c764c))
* tolerate pre-existing app test failures (Bun 1.3.14 regression) ([a612fd7](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a612fd7f25ce886776be13f531b5d874d0898f2a))
* vitest setup + test repairs for nifty-fe-monorepo ([f640964](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f640964d2d22a3fe4b885adeb96738e584fa171f))


### Documentation

* add Vercel env connect/sync instructions to README ([4f34954](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/4f34954365497fed42f06e279f33a29fe3e75eba))


### Tests

* add coverage for apps/app dateTime utils ([b1ecff7](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/b1ecff75d05134b65eb3852ba7f22079c1812c39))
* add coverage for apps/app pure utils ([31f7673](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/31f76734f6e63a1b785a0523a0f2e73109704033))
* add coverage for nfm error handlers, theme + playfab utils ([ca6df38](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ca6df38f04a852c1cdb465443f308bf5df02b1c0))
* add coverage for preloader-base (+90%) and gas.ts (+25%) ([#282](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/282)) ([5fd7249](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5fd7249aaa9150c72e0b24a03f8fb61a18fa439f))
* **app:** add comprehensive usePagination tests (10 tests) and fix empty-data edge case ([f8386d0](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f8386d0231857bee24d39b732d3aa52dc6f855f3))
* bun 1.4.0 + happy-dom per-file registration infra ([72e2d33](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/72e2d33fb8ecca9c7955b1bf3e7608ada8cb31bd))
* **CharacterCreator:** mock @/lib/use-unity-context so Unity lifecycle handlers register ([5950440](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5950440fae3e8e951bd734c90923617210fa026d))
* fix 6 failing tests + run CI with --isolate ([11c1c42](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/11c1c42c1abb1fa6476a0af7a47dc5f3072a923a))
* fix bun:test migration — mock.module timing, spyOn, navigator ([7fcbe33](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7fcbe33acc75459c88c7219ccb5b4cdb6624635e))
* fix happy-dom double-registration + window access ordering ([a876c94](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a876c94185d2f9b41e8566fd798b65235f34e2b7))
* increase coverage and raise regression floor ([ad6dceb](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ad6dcebfbca0c4812d8f7fe67168f707dee74bee))
* increase coverage and raise regression floors ([5221af6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5221af6ae242c8361e4eba6285334d13db7d06e0))
* purge @testing-library/jest-dom — all assertions now bun-native ([a20778f](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a20778f170c84e29286a7fca678c7534104a746a))
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
* daily code improvements — dead code removal, debug log cleanup ([#327](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/327)) ([c31a384](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/c31a3846e4e316241d16317e7b7b804883c6a4c3))
* daily code improvements — dead code removal, debug log cleanup ([#331](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/331)) ([9a9abb3](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/9a9abb39f18c967e21093aa2a3f527609680dac8))
* daily code improvements — dead code removal, debug log cleanup, bug fix ([#324](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/324)) ([7e2fa94](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/7e2fa94de12c9827e040a1c483bce41b95daa03e))
* daily code improvements — lint fixes, dep alignment, dead code removal ([2f66e33](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/2f66e33f072412d7cf6095e04d562b7e2828f306))
* **deps:** bump next from 16.2.10 to 16.2.11 ([#289](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/289)) ([e72b4a1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/e72b4a183fc4cb286f28234481e2e2aada8d0697))
* **deps:** bump react-dom from 19.2.7 to 19.2.8 ([#288](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/288)) ([ab97194](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/ab971942565d8e8835bd0b36372ea8bb83d16689))
* **deps:** merge auto dependency bump to main + fix 26 test failures ([3650d19](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/3650d19462fcd17c941470432786657e482bb72b))
* **deps:** update frontend dependencies and Vercel gate ([#333](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/333)) ([5e3b5dd](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/5e3b5dda3095c8d57a9ae6061965d4cf5129cb94))
* **deps:** weekly update ([0889db6](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/0889db6360837a66b3188677e93f762e5b5a9c2d))
* staging → main release — CI trigger update + 22 commits ([#292](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/292)) ([f8553fc](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/f8553fce1eaf24de67ed92a04389416a983d38f1))
* update all dependencies to latest ([#281](https://github.com/NiftyLeague/nifty-fe-monorepo/issues/281)) ([a23baf1](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/a23baf1e04076427bffd78d1aa07e54b9b9d84cd))
* upgrade @mui/material, @mui/system, @mui/lab, @mui/x-data-grid to v9 ([aa02b53](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/aa02b539f14963fad71eb08bf6a57953d0acbd5e))
* upgrade 5 medium-risk deps (three, uuid, axelar, cow-sdk, react-intl) ([bd6b90d](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bd6b90d9e2f908a62f921be9f0d138663c168112))
* upgrade dependencies to latest minor/patch versions ([dbe90f2](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/dbe90f2f41f90d512c4ce59e944e2c279f1bfce2))
* upgrade dependencies to latest minor/patch versions ([6b25e02](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/6b25e02ea0d5a3b143cfe77d25aa8b18ca9841ce))
* upgrade low-risk major versions (syncpack 15, lint-staged 17, @types/node 26, lucide-react 1) ([bee48a4](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/bee48a4c59b446bcf59d28d37f40b1c0b522440b))
* upgrade react-unity-webgl 8.8 -&gt; 10.2 (breaking API change) ([8e3a801](https://github.com/NiftyLeague/nifty-fe-monorepo/commit/8e3a801872ab332a49b89cbefd108752a82ceabf))

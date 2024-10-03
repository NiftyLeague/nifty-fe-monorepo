import Image from 'next/image';
import styles from './index.module.scss';

export const ROADMAP_CARDS = [
  {
    completed: true,
    completionDate: 'Sept 24th - 30th, 2021',
    image: {
      height: 350,
      src: '/img/mint-o-matic/creation.webp',
      style: { top: '-90px' },
      width: 661,
    },
    title: 'DEGEN Minting',
    body: (
      <p className="mb-0">
        Nifty League{' '}
        <strong>
          <a href="https://opensea.io/collection/niftydegen" target="_blank" rel="noreferrer">
            DEGEN NFTs
          </a>
        </strong>{' '}
        were brought to life by our community in Sept 2021. The minting process was a one-of-a-kind spectacle that
        allowed minters the ability to design their own DEGEN using Satoshi&apos;s{' '}
        <strong>
          <a href="https://app.niftyleague.com/mint-o-matic" target="_blank" rel="noreferrer">
            Mint-O-Matic
          </a>
        </strong>
        !
      </p>
    ),
  },
  {
    completed: true,
    completionDate: 'Sept 24th, 2021',
    image: {
      height: 272,
      src: '/img/misc/smash_200.webp',
      style: { top: '-80px', right: '-50px' },
      width: 518,
    },
    title: '2D Nifty Smashers - PC Early-Access',
    body: (
      <>
        <p>
          Our NFT launch coincided with the immediate availability of our first of many games,{' '}
          <strong>
            <a href="https://niftysmashers.com" target="_blank" rel="noreferrer">
              Nifty Smashers
            </a>
          </strong>
          .
        </p>
        <p className="mb-0">
          Nifty Smashers stands as one of the earliest NFT-enabled games on Ethereum. At the time, it was especially
          rare for a game to sell avatars or digital assets with a playable prototype.
        </p>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'Dec 2nd, 2021',
    image: {
      height: 350,
      src: '/img/roadmap/desktop-app_v02.webp',
      style: { top: '-115px' },
      width: 514,
    },
    title: 'Desktop App',
    body: (
      <>
        <p className="mb-0">
          Considering browser limitations with WebGL games, we made a point to focus our immediate efforts on creating a
          launcher to house our games going forward. Avoiding browser memory limits allows us to introduce additional
          animations, movesets, and other NFT integrations - all while significantly improving ping for our players.
        </p>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'Jan 22nd, 2022',
    image: {
      height: 364,
      src: '/img/roadmap/p2e_v02.webp',
      style: { top: '-95px' },
      width: 586,
    },
    title: 'Play-&-Earn (DEPRECATED)',
    body: (
      <>
        <p>
          How cool is it to earn rewards while playing games you actually enjoy? With the rollout of our P2E system
          players were able to accumulate <strong>NFTL</strong> through competitive matches in{' '}
          <strong>
            <a href="https://niftysmashers.com" target="_blank" rel="noreferrer">
              Nifty Smashers
            </a>
          </strong>
          .
        </p>
        <p className="mb-0">
          While the largest winnings went to those players who stood victorious, all participants were rewarded{' '}
          <strong>NFTL</strong> every match for their efforts in helping us playtest the game.
        </p>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'Feb 16th, 2022',
    image: {
      height: 412,
      src: '/img/roadmap/merch_02.webp',
      style: { top: '-100px' },
      width: 634,
    },
    title: 'Merch',
    body: (
      <>
        <p className="mb-0">
          We know our community couldn&apos;t wait to showcase their cool DEGENS on the streets! We are excited to
          unveil our{' '}
          <a href="https://niftyleague.com/shop" target="_blank" rel="noreferrer">
            merch
          </a>
          !
        </p>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'May 3rd, 2022',
    image: {
      height: 375,
      src: '/img/roadmap/rentals_v02.webp',
      style: { top: '-100px' },
      width: 609,
    },
    title: 'DEGEN Rentals (DEPRECATED)',
    body: (
      <>
        <p>
          Our initial player-base was limited to the number of unique <strong>DEGEN NFT</strong> holders. We introduced
          a rental system to scale our playerbase as much as possible without devaluing our genesis DEGEN NFT
          collection.
        </p>
        <p className="mb-0">
          We introduced a bespoke rental system allowing DEGEN holders to earn <strong>NFTL</strong> daily through fees.
          Each DEGEN could be rented indefinitely but the cost for doing so increased exponentially with each additional
          rental. This allowed the market to decide the price for each DEGEN individually while spreading out the
          rentals across the board as some equipped with precious items, wearables, or backgrounds had a higher earn
          rate with multipliers.
        </p>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'Jun 8th, 2022',
    image: {
      height: 450,
      src: '/img/roadmap/leaderboards_v02.webp',
      style: { top: '-120px' },
      width: 649,
    },
    title: 'Leaderboards',
    body: (
      <>
        <p>
          Our games are meant to be competitive; what better way to showcase this than a leaderboard with star players
          like FVSVY at the top? 😏
        </p>
        <p>
          We&apos;ll include game stats for daily, weekly, monthly, and of course all-time leaders for all of our games
          in the NiftyVerse. Some early honorary DEGENS:
        </p>
        <ul className={styles.content_skills}>
          <li>fvsvy 🌊</li>
          <li>SEIYA</li>
          <li>sacx</li>
          <li>RealDealMcKeel</li>
          <li>YoungParabolic</li>
          <li>I_M_I</li>
          <li>koa.eth</li>
        </ul>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'Jun 15th, 2022',
    image: {
      height: 1080,
      src: '/img/games/wen.gif',
      style: { top: '-130px' },
      width: 1440,
    },
    title: 'WEN Game',
    body: (
      <>
        <p>
          <strong>
            <a href="https://app.niftyleague.com/games/wen-game" target="_blank" rel="noreferrer">
              WEN
            </a>
          </strong>{' '}
          is a game of timing and reflex. The purpose of the mini-game is to try and hit as many baseballs (launched
          from a baseball machine) as possible in a row to get a high score.
        </p>
        <p className="mb-0">
          With this mini-game we introduced our Arcade Tokens system! Players earn Arcade Tokens every day they complete
          a Nifty Smashers match! This game marks our first Arcade Game launched and can be played without owning or
          renting a DEGEN.
        </p>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'Aug 4th, 2022',
    image: {
      height: 1080,
      src: '/img/games/mt-gawx.gif',
      style: { top: '-135px' },
      width: 1440,
    },
    title: 'Mt. Gawx',
    body: (
      <>
        <p className="mb-0">
          Hearing the DEGENs&apos; pleas to spend their hard-earned NFTL and with bigger sinks still under development,
          Satoshi suggests the DEGENs climb to the top of the{' '}
          <strong>
            <a href="https://app.niftyleague.com/games/mt-gawx" target="_blank" rel="noreferrer">
              Mt. Gawx
            </a>
          </strong>{' '}
          volcano to offer their NFTL sacrifices to the fiery depths to see who might burn the most, and to discover
          whether the rumors of Rugman offering interesting rewards to burners are true.
        </p>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'Sept 20th, 2022',
    image: {
      height: 1080,
      src: '/img/games/crypto-winter.gif',
      style: { top: '-120px' },
      width: 1440,
    },
    title: 'Crypto Winter',
    body: (
      <>
        <p className="mb-0">
          <strong>
            <a href="https://app.niftyleague.com/games/crypto-winter" target="_blank" rel="noreferrer">
              Crypto Winter
            </a>
          </strong>{' '}
          is a our second arcade style mini-game which also depends on skillful timing and reflex. Play this
          single-player dodgeball-inspired arcade game and rank as high as you can!
        </p>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'Nov 11th, 2022',
    image: {
      height: 250,
      src: '/img/logos/networks/imx.webp',
      style: { top: '-140px', padding: '20px' },
      width: 250,
    },
    title: 'L2 Migration',
    body: (
      <>
        <p>
          Selecting a suitable Layer 2 partner is crucial to scaling our ecosystem at Nifty League, and we couldn&apos;t
          be more excited to start rolling out products on{' '}
          <strong>
            <a href="https://www.immutable.com/" target="_blank" rel="noreferrer">
              Immutable X (IMX)
            </a>
          </strong>{' '}
          .
        </p>
        <p className="mb-0">
          IMX is solely focused on powering the next generation of Web3 games which positions Nifty League to capitalize
          on the upcoming wave of mainstream adoption.
        </p>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'Nov 16th, 2022',
    image: {
      height: 325,
      src: '/img/roadmap/comics_v01.webp',
      style: { top: '-160px', right: '-120px', padding: '20px' },
      width: 323,
    },
    title: 'Comics Burning',
    body: (
      <>
        <p>
          <strong>
            <a href="https://tokentrove.com/collection/NiftyLeagueComics" target="_blank" rel="noreferrer">
              Comic pages
            </a>
          </strong>{' '}
          were free gifts airdropped to early DEGEN NFT minters & holders. Our team eventually revealed that each comic
          page could be burned to receive rare game weapons or wearables. Alternatively, holders could burn all six
          comics at once for an exclusive key to the Citadel!
        </p>
        <p>
          <strong>Comic burning remains open until further notice!</strong>
        </p>
        <div className="d-flex flex-wrap">
          <div className="col-6 p-1">
            <Image
              alt="comic 1"
              height={500}
              src="/img/comics/thumbnail/1.webp"
              width={500}
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
          <div className="col-6 p-1">
            <Image
              alt="comic 2"
              height={500}
              src="/img/comics/thumbnail/2.webp"
              width={500}
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
          <div className="col-6 p-1">
            <Image
              alt="comic 3"
              height={500}
              src="/img/comics/thumbnail/3.webp"
              width={500}
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
          <div className="col-6 p-1">
            <Image
              alt="comic 4"
              height={500}
              src="/img/comics/thumbnail/4.webp"
              width={500}
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
          <div className="col-6 p-1">
            <Image
              alt="comic 5"
              height={500}
              src="/img/comics/thumbnail/5.webp"
              width={500}
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
          <div className="col-6 p-1">
            <Image
              alt="comic 6"
              height={500}
              src="/img/comics/thumbnail/6.webp"
              width={500}
              sizes="100vw"
              style={{
                width: '100%',
                height: 'auto',
              }}
            />
          </div>
        </div>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'Feb 13th, 2023',
    image: {
      height: 400,
      src: '/img/games/smashers/nifty-smashers.gif',
      style: { top: '-135px' },
      width: 544,
    },
    title: '2D Nifty Smashers - PC Alpha',
    body: (
      <p className="mb-0">
        We implemented a new deterministic roll-back netcode solution which improved lag considerably. This netcode also
        enables some cool features such as broadcasting live games and having replays readily available through our
        archive.
      </p>
    ),
  },
  {
    completed: true,
    completionDate: 'Feb 17th, 2023',
    image: {
      height: 384,
      src: '/img/degens/hydra.webp',
      style: { top: '-160px' },
      width: 384,
    },
    title: 'The Hatching',
    body: (
      <>
        <p>
          The ultimate sacrifice was made on this day to bring the ancient Hydras back from extinction. Community
          members lined up to send 8 DEGENs through a portal forever burning their existence from the blockchain. In
          return? A claim at one of 98 rare Hydra eggs.
        </p>
        <p className="mb-0">
          Hydras are amphibious water dragons that roam freely underwater or on land. Their cuteness belies their wise
          and fighting prowess. They pack a punch with their tridents, spears, and ranged attacks and bring a wealth of
          lore knowledge to Nifty League, being the oldest tribe.
        </p>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'May 10th, 2023',
    image: {
      height: 400,
      src: '/img/roadmap/free2play_v02.webp',
      style: { top: '-140px' },
      width: 507,
    },
    title: 'Free-2-Play',
    body: (
      <>
        <p>
          Scaling our platform is a high priority. Part of this process is onboarding new users who may not be able to
          afford expensive digital assets.
        </p>
        <p className="mb-0">
          Our new free-2-play focus allows players to experience our games using generic characters of each tribe while
          more premium access is still restricted to DEGEN holders.
        </p>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'Sept 2nd, 2023',
    image: {
      height: 1070,
      src: '/img/games/smashers/apartment.webp',
      style: { top: '-90px' },
      width: 1618,
    },
    title: 'Nifty Smashers - Progression Design',
    body: (
      <>
        <p>
          We designed several fundamental tools for our games including progression and marketplace systems. These
          systems incentivize players to stick around by rewarding them for milestones that drive engagement and
          retention.
        </p>
        <p className="mb-0">
          Nifty Smashers is the first game we integrated with live ops tooling as part of its mobile launch. In
          addition, we are training Smashers AI to keep lobbies full and accomodate multiple skill levels.
        </p>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'Oct 11th, 2023',
    image: {
      src: '/img/logos/other/pocket-whale.webp',
      style: { top: '-155px' },
      width: 387,
      height: 300,
    },
    title: 'PocketWhale Partnership',
    body: (
      <>
        <p className="mb-0">
          Video game creative and marketing agency focusing on mobile, PC and console games. With offices in USA,
          Germany, France and Japan,{' '}
          <a href="https://www.pocketwhale.com/" target="_blank" rel="noreferrer">
            PocketWhale
          </a>{' '}
          plans and executes our global game marketing campaigns.
        </p>
        <p className="mb-0">
          Their team designs tailor-made creative assets and has a holistic approach to media. They operate marketing
          campaigns online and offline through PR, influencer marketing, TV advertising, digital advertising, and
          events.
        </p>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'Dec 10th, 2023',
    image: {
      src: '/img/roadmap/mobile_v02.webp',
      style: { top: '-155px' },
      width: 387,
      height: 300,
    },
    title: 'Nifty Smashers - Mobile Alpha',
    body: (
      <>
        <p className="mb-0">
          Porting Smashers to{' '}
          <a href="https://niftysmashers.com" target="_blank" rel="noreferrer">
            Android & iOS
          </a>
          !
        </p>
        <p className="mb-0">
          Going forward all of our games will be mobile compatible. With a high concentration of gamers using mobile
          platforms, this release was pivotal for the direction of Nifty League.
        </p>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'July 15th, 2024',
    image: {
      src: '/img/roadmap/beta_v02.webp',
      style: { top: '-125px' },
      width: 387,
      height: 300,
    },
    title: 'Nifty Smashers - Mobile Beta',
    body: (
      <>
        <p>
          <a href="https://niftysmashers.com" target="_blank" rel="noreferrer">
            Nifty Smashers Mobile
          </a>{' '}
          is now feature complete and available in multiple countries!
        </p>
        <p>
          After months of refining complex in-game progression and metasystem mechanics, we&apos;ve crafted a top-tier
          mobile experience that players will love.
        </p>
        <p className="mb-0">We are now in the final stages of testing and polishing before the global launch!</p>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'Sept 13th, 2024',
    image: {
      src: '/img/roadmap/niftyroyale_v01.webp',
      style: { top: '-110px' },
      width: 541,
      height: 381,
    },
    title: (
      <>
        Nifty Royale - <br />
        Early-Access
      </>
    ),
    body: (
      <>
        <p>
          The first game set in the NiftyVerse is an action-packed battle royale! Initial development kicked off in
          August 2023 as part of a case study into our decentalized vision. Nifty League is managing an external game
          studio responsible for development.
        </p>
        <p className="mb-0">
          Early-access is available for playtesting! Find the latest build{' '}
          <a href="https://app.niftyleague.com" target="_blank" rel="noreferrer">
            on our webapp
          </a>
          .
        </p>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'Sept 24th, 2024',
    image: {
      height: 166,
      src: '/img/logos/networks/imx_polygon.webp',
      style: { top: '-115px' },
      width: 250,
    },
    title: 'Immutable zkEVM',
    body: (
      <>
        <p>
          In partnership with Polygon, Immutable introduced the{' '}
          <strong>
            <a href="https://www.immutable.com/products/immutable-zkevm" target="_blank" rel="noreferrer">
              Immutable zkEVM
            </a>
          </strong>{' '}
          - a chain for games that offers EVM compatibility, low cost, massive scale, and Ethereum security. The most
          cutting-edge technology in gaming with the largest ecosystem in web3.
        </p>
        <p className="mb-0">
          We migrated NFTL along with our Items & Comics collections, allowing our users to benefit from low fees and
          scalability for our platform.
        </p>
      </>
    ),
  },
  {
    completed: true,
    completionDate: 'Oct 1st, 2024 - Present',
    image: {
      src: '/img/roadmap/dao_v02.webp',
      style: { top: '-80px' },
      width: 532,
      height: 302,
    },
    title: 'Nifty DAO',
    body: (
      <>
        <p>
          With our migration to Immutable zkEVM, we launched our DAO including on-chain NFTL token governance on{' '}
          <a href="https://niftyleague.com/tally" target="_blank" rel="noreferrer">
            Tally
          </a>
          !
        </p>
        <p>
          Our team will gradually transfer responsibilities to our DAO in order to decentralize the platform and
          encourage others to build with us! Our vision is to power rapid growth and development through community
          contributions enabling us to build a gaming platform like no other.
        </p>
        <p className="mb-0">
          Read our{' '}
          <a href="https://niftyleague.com/docs/overview/nifty-dao/guidelines" target="_blank" rel="noreferrer">
            DAO Guidelines
          </a>{' '}
          to learn more!
        </p>
      </>
    ),
  },
  {
    current: true,
    image: {
      src: '/img/logos/smashers/app_wordmark_logo.webp',
      style: { top: '-115px' },
      width: 387,
      height: 300,
    },
    title: 'Nifty Smashers - Global Launch',
    body: (
      <>
        <p>We&apos;ve achieved an exceptional 55% CVR (app unit/page views), and Day 1 Retention of over 30%!</p>
        <p className="mb-0">
          We are very close! After a few more iterations and monetization testing we look forward to releasing Smashers
          worldwide! Smashers will be available on multiple platforms (Android, iOS, Epic, Steam, and maybe Switch???)
        </p>
      </>
    ),
  },
  {
    image: {
      height: 375,
      src: '/img/roadmap/marketplace_v02.webp',
      style: { top: '-90px' },
      width: 609,
    },
    title: 'Items Marketplace',
    body: (
      <>
        <p>
          We are working with the Immutable team to seamlessly integrate our items marketplace in-game. Offerings will
          include cool skins, weapons, consumable items, and more to enhance your DEGENs. Our items are currently
          available on{' '}
          <a href="https://tokentrove.com/collection/NiftyLeague" target="_blank" rel="noreferrer">
            TokenTrove
          </a>
          !
        </p>
        <p className="mb-0">
          Future items will be provided to community testers as well as found in our games. Free-2-play mobile players
          that includes you! Players may get lucky and find rare wearables or weapons in game that are mintable on IMX!
        </p>
      </>
    ),
  },
  {
    image: {
      src: '/img/roadmap/niftyroyale_v01.webp',
      style: { top: '-110px' },
      width: 541,
      height: 381,
    },
    title: 'Nifty Royale - Alpha/Beta',
    body: (
      <>
        <p>
          An upcoming battle royale game set in the NiftyVerse, a virtual world our team strategically designed for
          limitless creativity. Building on the success of Nifty Smashers, Nifty Royale delivers an immersive and
          competitive experience.
        </p>
        <p className="mb-0">
          Early-access is now available for playtesting! Additional polish and work is needed to get the game in Alpha
          state. Follow our latest updates on Twitter & Discord and find the latest build{' '}
          <a href="https://app.niftyleague.com" target="_blank" rel="noreferrer">
            on our webapp
          </a>
          .
        </p>
      </>
    ),
  },
  {
    image: {
      src: '/img/roadmap/niftyverse_v02.webp',
      style: { top: '-145px' },
      width: 757,
      height: 675,
    },
    title: 'NiftyVerse',
    body: (
      <>
        <p>
          Welcome to the NiftyVerse; a world filled with DEGENs and NFT communities alike with a shared vision to have
          fun and build a thriving gaming ecosystem. What makes the Niftyverse stand apart from other metaverses is our
          games being the centerpiece. Walk into our arcade room filled with fun mini-games or venture to destinations
          on the map to jump into our classic titles like Nifty Smashers and Nifty Kart.
        </p>
        <p>
          While Nifty League focuses on building a decentralized game platform with titles such as Nifty Smashers and
          other Nintendo-inspired games, NiftyVerse stands at the heart of our ecosystem tying everything together.
          It&apos;s not only the central lobby system or launch point for many of these games, but the main hub for all
          social interactions (and quite frankly our biggest game in and of itself).
        </p>
        <p className="mb-0">
          If you&apos;re a creative type, don&apos;t miss this opportunity - we will have an asset store for you to
          design assets such as buildings or trees and list them for sale based on your defined limits and pricing. Do
          you want a cool DEGEN theme park or Cyber Kongz meetup? Build out the NiftyVerse to whatever your heart
          desires!
        </p>
      </>
    ),
  },
  {
    divider: true,
    image: {
      src: '/img/logos/niftyverse/app_logo.webp',
      style: { top: '-90px' },
      width: 1920,
      height: 1080,
    },
    title: 'Land',
    body: (
      <>
        <p>
          Land parcels give you ownership in the NiftyVerse. Each DEGEN NFT will recieve 1 free plot of land if and when
          the mint goes live. As a land holder you can build freely on your parcels as long as they meet platform
          guidelines. For larger developments that span across a region we will introduce an HOA model for build
          proposals.
        </p>
        <p className="mb-0">
          Oh... and it&apos;s probably worth noting the land and assets will be sold with <strong>NFTL</strong>.
        </p>
      </>
    ),
  },
  {
    image: {
      src: '/img/roadmap/pets_v02.webp',
      style: { top: '-140px' },
      width: 379,
      height: 325,
    },
    title: 'DEGEN Pets',
    body: (
      <>
        <p>
          Following our NiftyVerse launch we want to introduce cool pets for your DEGENS! A lot of community members
          have asked us to dust off and bring back Satoshi&apos;s{' '}
          <strong>
            <a href="https://app.niftyleague.com/mint-o-matic" target="_blank" rel="noreferrer">
              Mint-O-Matic
            </a>
          </strong>
          , and we couldn&apos;t agree more!
        </p>
        <p className="mb-0">
          DEGEN NFT holders would receive whitelist spots so our community can create pets at their leisure. A public
          offering will follow for any remaining pets. If you missed the first minting experience be sure to keep this
          one on your calendar!
        </p>
      </>
    ),
  },
  {
    image: {
      src: '/img/games/nifty-tennis.webp',
      style: { top: '-135px' },
      width: 500,
      height: 281,
    },
    title: 'Nifty Tennis',
    body: (
      <p className="mb-0">
        It&apos;s important to note that any subsequent games will be voted upon by the DAO. Early development of Nifty
        Tennis started in 2022, making Tennis a top release candidate. We plan to accommodate all playstyles whether
        playing competitively or just for fun.
      </p>
    ),
  },
  {
    image: {
      src: '/img/roadmap/niftykart_v01.webp',
      style: { top: '-160px' },
      width: 494,
      height: 462,
    },
    title: 'Nifty Kart',
    body: (
      <p className="mb-0">
        Old school classics are core to our game offerings as we recognize the power of reliving childhood favorites
        with a Web3 twist. Own your characters &amp; karts and get ready to race for <strong>NFTL</strong>!
      </p>
    ),
  },
  {
    image: {
      src: '/img/roadmap/gen2_v01.webp',
      style: { top: '-120px' },
      width: 550,
      height: 451,
    },
    title: 'Gen2 DEGENs',
    body: (
      <p className="mb-0">
        As our platform grows and demand increases for DEGENs - we may consider introducing new tribes. Do note that the
        final decision to go this route will rest with the DAO.
      </p>
    ),
  },
];

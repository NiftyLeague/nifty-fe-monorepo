import Link from 'next/link';

export const FAQS = [
  {
    question: 'What is Nifty League?',
    answer: (
      <>
        Nifty League is a decentralized game studio & publisher at the cutting edge of Web3. Our mission is to create an
        open & efficient path for indie studios to develop & publish groundbreaking games. Read our{' '}
        <Link href="/docs/overview/intro" target="_blank" rel="noreferrer">
          docs
        </Link>{' '}
        to learn more!
      </>
    ),
  },
  {
    question: 'What is the NiftyVerse?',
    answer: (
      <>
        The NiftyVerse is a digital world centered around nostalgia. It not only acts as a social hub for connecting
        with friends online, but is THE ultimate Nifty League game hub with fun missions and launch points into our
        other game titles. Land parcels will be available to build custom areas for holders, and players can show off
        their digital assets from Nifty League or other partner communities to stand out.{' '}
        <Link href="/niftyverse" target="_blank" rel="noreferrer">
          Learn more
        </Link>
      </>
    ),
  },
  {
    question: 'What is NFTL and what is it used for?',
    answer: (
      <>
        NFTL is our platform-wide governance and utility token. The token was distributed freely to DEGEN NFT holders
        and Nifty Smashers players through special events. The team has never, nor will ever, sell NFTL to the public.
        It is available for trading on decentralized exchanges such as QuickSwap (Immutable zkEVM) & Uniswap (Ethereum).
        <br />
        <br />
        Utility includes, but is not limited to:
        <ol>
          <li>Governance: on-chain DAO governance available on Tally.xyz</li>
          <li>NFT drops: Raffles, NiftyVerse Land, special weapons/wearables, others TBA</li>
          <li>Ecosystem currency: Redemption of in-game currencies, compete-2-earn wagering (deprecated)</li>
          <li>Platform fees: Renaming DEGENs, DEGEN rentals (deprecated), Mini-Games (deprecated), etc</li>
        </ol>
        Read our{' '}
        <Link href="/docs/overview/nifty-dao/nftl/overview" target="_blank" rel="noreferrer">
          docs
        </Link>{' '}
        to learn more.
        <br />
      </>
    ),
  },
  {
    question: 'What is Nifty Smashers?',
    answer: (
      <>
        <a href="https://niftysmashers.com" target="_blank" rel="noreferrer">
          Nifty Smashers
        </a>{' '}
        is the first title offered by Nifty League based off of the popular game Super Smash Bros.
        <br />
        <br />
        Battle it out amongst the community and get in as many bat bonks on your friends as you can! Nifty Smashers
        takes inspiration from the classic Super Smash Bros game where the objective is to knock your opponents off the
        map to score points.
        <br />
        <br />
        Nifty Smashers is available on mobile! Download the app for iOS or Android on{' '}
        <a href="https://niftysmashers.com" target="_blank" rel="noreferrer">
          NiftySmashers.com
        </a>
      </>
    ),
  },
  {
    question: 'Does it cost money to play your games?',
    answer: (
      <>
        Nope! Our games such as{' '}
        <a href="https://niftysmashers.com" target="_blank" rel="noreferrer">
          Nifty Smashers
        </a>{' '}
        are free-to-play. If you own a DEGEN or hold a partner NFT from CyberKongz, Forgotten Runes, or Degods your
        avatars will be available once you create an account and connect your wallet.
      </>
    ),
  },
];

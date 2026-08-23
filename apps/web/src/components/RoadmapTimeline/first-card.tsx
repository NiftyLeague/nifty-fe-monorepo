import { DEGEN_COLLECTION_URL } from '@/constants/degen-assets'

export const FIRST_ROADMAP_CARD = {
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
        <a href={DEGEN_COLLECTION_URL} target="_blank" rel="noreferrer">
          DEGEN NFTs
        </a>
      </strong>{' '}
      were brought to life by our community in Sept 2021. The minting process was a one-of-a-kind
      spectacle that allowed minters the ability to design their own DEGEN using Satoshi&apos;s{' '}
      <strong>
        <a href="https://app.niftyleague.com/mint-o-matic" target="_blank" rel="noreferrer">
          Mint-O-Matic
        </a>
      </strong>
      !
    </p>
  ),
}

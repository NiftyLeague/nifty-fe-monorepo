import { NIFTY_APP_URL, NIFTY_WORLD_APP_URL } from '@/constants/links'

export interface NiftyGame {
  name: string
  description: string
  image: string
  tag: string
  link: string
}

export const NIFTY_GAMES: NiftyGame[] = [
  {
    name: 'NIFTY SMASHERS',
    description:
      'A flagship brawler for fast, chaotic matches with friends and rivals across the Nifty League.',
    image: 'https://cdn.niftyleague.com/media/img/home/smashers-spotlight.webp',
    tag: 'MOBILE / PC',
    link: 'https://niftysmashers.com',
  },
  {
    name: 'NIFTY WORLD',
    description:
      'An open world to explore, meet the community, and create player-made games together.',
    image: 'https://cdn.niftyleague.com/media/img/home/niftyworld-marina.webp',
    tag: 'OPEN WORLD',
    link: NIFTY_WORLD_APP_URL,
  },
  {
    name: 'NIFTY ROYALE',
    description:
      'A competitive battle royale where DEGENs outplay rivals and chase victory in Nifty World.',
    image: 'https://cdn.niftyleague.com/media/img/games/video-posters/nifty-royale.webp',
    tag: 'MOBILE / PC',
    link: NIFTY_APP_URL,
  },
  {
    name: '2D SMASHERS',
    description:
      'The original browser brawler, preserved in the app for classic Nifty Smashers competition.',
    image: 'https://cdn.niftyleague.com/media/img/games/smashers/nifty-smashers-poster.webp',
    tag: 'BROWSER',
    link: `${NIFTY_APP_URL}/games/smashers`,
  },
  {
    name: 'DEGEN DODGE',
    description:
      'Dodge danger, swing your bat, and survive a fast-paced Nifty World arcade challenge.',
    image: 'https://niftyworld.gg/assets/maps/degen-dodge.webp',
    tag: 'MINI-GAME',
    link: `${NIFTY_APP_URL}/games/degen-dodge`,
  },
  {
    name: 'WEN 2D',
    description:
      'A timing-based baseball mini-game where every hit builds your score and tests your reflexes.',
    image: 'https://cdn.niftyleague.com/media/img/games/video-posters/wen-game.webp',
    tag: 'MINI-GAME',
    link: `${NIFTY_APP_URL}/games/wen-2d`,
  },
  {
    name: 'WEN 3D',
    description:
      'A 3D baseball adventure built for quick matches, sharp timing, and competitive browser play.',
    image: 'https://niftyworld.gg/assets/maps/wen-3d.webp',
    tag: 'MINI-GAME',
    link: `${NIFTY_APP_URL}/games/wen-3d`,
  },
  {
    name: 'MT. GAWX',
    description:
      'Climb an active volcano, burn NFTL, and see how much you can sacrifice in this arcade challenge.',
    image: 'https://cdn.niftyleague.com/media/img/games/video-posters/mt-gawx.webp',
    tag: 'MINI-GAME',
    link: `${NIFTY_APP_URL}/games/mt-gawx`,
  },
  {
    name: 'DEGEN DIVE',
    description: 'Dive, dodge hazards, and chase the high score in a fast arcade challenge.',
    image: 'https://niftyworld.gg/assets/maps/degen-dive.webp',
    tag: 'MINI-GAME',
    link: `${NIFTY_APP_URL}/games/degen-dive`,
  },
  {
    name: 'BRICK BREAKER',
    description:
      'Break through colorful bricks, clear every level, and climb the leaderboard for a high score.',
    image: 'https://niftyworld.gg/assets/maps/brick-breaker.webp',
    tag: 'MINI-GAME',
    link: `${NIFTY_APP_URL}/games/brick-breaker`,
  },
  {
    name: 'NIFTY TENNIS',
    description:
      'Serve, rally, and return the ball in a fast-paced match built for quick, competitive play.',
    image: 'https://niftyworld.gg/assets/maps/tennis.webp',
    tag: 'MINI-GAME',
    link: `${NIFTY_APP_URL}/games/tennis`,
  },
]

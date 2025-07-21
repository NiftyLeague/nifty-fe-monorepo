import type { Game } from '@/types/games';

const games: Game[] = [
  {
    title: 'The Witcher 3',
    description:
      'The Witcher 3 is a story-driven, next-generation open world role-playing game set in a visually stunning fantasy universe full.',
    onlineCounter: 292,
    image: 'https://berrydashboard.io/static/media/profile-back-5.5f9f39de.png',
    isComingSoon: false,
  },
  {
    title: 'Fallout 4',
    description:
      'Fallout 4 is a post-apocalyptic action role-playing game developed and published by Bethesda Game Studios.',
    onlineCounter: 12,
    image: 'https://berrydashboard.io/static/media/profile-back-7.d8ac257e.png',
    isComingSoon: false,
  },
  {
    title: 'The Witcher 3',
    description:
      'The Witcher 3 is a story-driven, next-generation open world role-playing game set in a visually stunning fantasy universe full.',
    onlineCounter: 0,
    image: 'https://berrydashboard.io/static/media/profile-back-8.86814b2f.png',
    isComingSoon: true,
  },
  {
    title: 'Fallout 4',
    description:
      'Fallout 4 is a post-apocalyptic action role-playing game developed and published by Bethesda Game Studios.',
    onlineCounter: 0,
    image: 'https://berrydashboard.io/static/media/profile-back-9.b5846921.png',
    isComingSoon: true,
  },
  {
    title: 'The Witcher 3',
    description:
      'The Witcher 3 is a story-driven, next-generation open world role-playing game set in a visually stunning fantasy universe full.',
    onlineCounter: 0,
    image: 'https://berrydashboard.io/static/media/profile-back-10.c597e179.png',
    isComingSoon: true,
  },
  {
    title: 'The Witcher 3',
    description:
      'The Witcher 3 is a story-driven, next-generation open world role-playing game set in a visually stunning fantasy universe full.',
    onlineCounter: 0,
    image: 'https://berrydashboard.io/static/media/profile-back-10.c597e179.png',
    isComingSoon: true,
  },
  {
    title: 'The Witcher 3',
    description:
      'The Witcher 3 is a story-driven, next-generation open world role-playing game set in a visually stunning fantasy universe full.',
    onlineCounter: 0,
    image: 'https://berrydashboard.io/static/media/profile-back-10.c597e179.png',
    isComingSoon: true,
  },
  {
    title: 'The Witcher 3',
    description:
      'The Witcher 3 is a story-driven, next-generation open world role-playing game set in a visually stunning fantasy universe full.',
    onlineCounter: 0,
    image: 'https://berrydashboard.io/static/media/profile-back-10.c597e179.png',
    isComingSoon: true,
  },
  {
    title: 'The Witcher 3',
    description:
      'The Witcher 3 is a story-driven, next-generation open world role-playing game set in a visually stunning fantasy universe full.',
    onlineCounter: 0,
    image: 'https://berrydashboard.io/static/media/profile-back-10.c597e179.png',
    isComingSoon: true,
  },
];

export const getGameViewedAnalyticsContentId = (pathname: string) => {
  if (pathname.includes('smashers')) {
    return 'nifty_smashers';
  } else if (pathname.includes('wen-game')) {
    return 'wen_game';
  } else if (pathname.includes('mt-gawx')) {
    return 'mt_gawx';
  } else if (pathname.includes('crypto-winter')) {
    return 'crypto_winter';
  }
  return null;
};

export default games;

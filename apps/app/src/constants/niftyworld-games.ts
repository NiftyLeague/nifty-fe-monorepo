export const NIFTY_WORLD_ORIGIN = 'https://niftyworld.gg'

export const NIFTY_WORLD_GAMES = [
  {
    id: 'degen-dodge',
    title: 'Degen Dodge',
    description:
      'Dodge danger, swing your bat, and survive this fast-paced Nifty World arcade game.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/degen-dodge.webp`,
  },
  {
    id: 'wen-2d',
    title: 'Wen 2D',
    description: 'Run, jump, and swing your way through the classic Wen 2D mini-game.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/wen-2d.webp`,
  },
  {
    id: 'degen-dive',
    title: 'Degen Dive',
    description: 'Dive through the sky and chase the highest score in Degen Dive.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/degen-dive.webp`,
  },
  {
    id: 'brick-breaker',
    title: 'Brick Breaker',
    description: 'Smash through the bricks and climb the levels in Brick Breaker.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/brick-breaker.webp`,
  },
  {
    id: 'tennis',
    title: 'Nifty Tennis',
    description: 'Serve, rally, and return the ball in Nifty Tennis.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/tennis.webp`,
  },
  {
    id: 'wen-3d',
    title: 'Wen 3D',
    description: 'Take Wen into a 3D baseball adventure built for the browser.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/wen-3d.webp`,
  },
] as const

export type NiftyWorldGame = (typeof NIFTY_WORLD_GAMES)[number]

export const getNiftyWorldGame = (id: string) => NIFTY_WORLD_GAMES.find((game) => game.id === id)

export const getNiftyWorldGameUrl = (
  game: NiftyWorldGame,
  embedded = false,
  attempt = 0,
  visitId?: string
) => {
  const params = embedded ? ['embed=1'] : []
  if (visitId) params.push(`visit=${encodeURIComponent(visitId)}`)
  if (embedded && attempt > 0) params.push(`attempt=${attempt}`)

  return `${NIFTY_WORLD_ORIGIN}/games/${game.id}${params.length > 0 ? `?${params.join('&')}` : ''}`
}

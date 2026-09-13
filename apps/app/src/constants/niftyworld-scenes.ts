import { NIFTY_WORLD_ORIGIN } from './niftyworld-games'

export const NIFTY_WORLD_SCENES = [
  {
    id: 'isla-azul',
    title: 'Isla Azul',
    description: 'Explore the beaches, boardwalks, and bright waters of Isla Azul.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/isla-azul.webp`,
    path: '/scenes/isla-azul',
  },
  {
    id: 'dungeon',
    title: 'Dungeon',
    description: 'Descend below Isla Azul and uncover the secrets of the Dungeon.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/dungeon.webp`,
    path: '/scenes/isla-azul?zone=dungeon',
  },
  {
    id: 'party-cove',
    title: 'Party Cove',
    description: 'Bring the party to a colorful cove built for Nifty World adventures.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/party-cove.webp`,
    path: '/scenes/party-cove',
  },
  {
    id: 'little-tokyo',
    title: 'Little Tokyo',
    description: 'Take in the lights and energy of Little Tokyo after dark.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/little-tokyo.webp`,
    path: '/scenes/little-tokyo',
  },
  {
    id: 'mansion',
    title: 'Mansion',
    description: 'Step inside the Mansion and explore one of Nifty World’s landmarks.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/mansion.webp`,
    path: '/scenes/mansion',
  },
  {
    id: 'exchange',
    title: 'Nifty Exchange',
    description: 'Visit the Nifty Exchange, a central hub for the world’s bustling activity.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/exchange.webp`,
    path: '/scenes/exchange',
  },
  {
    id: 'marina',
    title: 'Marina',
    description: 'Wander the waterfront and docks of the Nifty World Marina.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/marina.webp`,
    path: '/scenes/marina',
  },
  {
    id: 'rugmans-peak',
    title: "Rugman's Peak",
    description: 'Climb toward Rugman’s Peak for a view across Nifty World.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/rugmans-peak.webp`,
    path: '/scenes/rugmans-peak',
  },
  {
    id: 'arcade',
    title: 'Nifty Arcade',
    description: 'Drop into the Nifty Arcade for a neon-lit stop in the city.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/arcade.webp`,
    path: '/scenes/arcade',
  },
] as const

export type NiftyWorldScene = (typeof NIFTY_WORLD_SCENES)[number]

export const getNiftyWorldScene = (id: string) =>
  NIFTY_WORLD_SCENES.find((scene) => scene.id === id)

export const getNiftyWorldSceneUrl = (
  scene: NiftyWorldScene,
  embedded = false,
  attempt = 0,
  visitId?: string
) => {
  const url = new URL(scene.path, NIFTY_WORLD_ORIGIN)

  if (embedded) url.searchParams.set('embed', '1')
  if (visitId) url.searchParams.set('visit', visitId)
  if (embedded && attempt > 0) url.searchParams.set('attempt', String(attempt))

  return url.toString()
}

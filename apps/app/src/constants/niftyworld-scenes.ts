import { NIFTY_WORLD_ORIGIN } from './niftyworld-games'

export const NIFTY_WORLD_SCENES = [
  {
    id: 'isla-azul',
    title: 'Isla Azul',
    description: "Explore Isla Azul's bright beaches.",
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/isla-azul.webp`,
    path: '/scenes/isla-azul',
  },
  {
    id: 'dungeon',
    title: 'Dungeon',
    description: 'Uncover the secrets below Isla Azul.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/dungeon.webp`,
    path: '/scenes/isla-azul?zone=dungeon',
  },
  {
    id: 'party-cove',
    title: 'Party Cove',
    description: 'A colorful cove for Nifty adventures.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/party-cove.webp`,
    path: '/scenes/party-cove',
  },
  {
    id: 'little-tokyo',
    title: 'Little Tokyo',
    description: 'Explore Little Tokyo after dark.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/little-tokyo.webp`,
    path: '/scenes/little-tokyo',
  },
  {
    id: 'mansion',
    title: 'Mansion',
    description: "Explore Nifty World's grand Mansion.",
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/mansion.webp`,
    path: '/scenes/mansion',
  },
  {
    id: 'exchange',
    title: 'Nifty Exchange',
    description: "The hub of Nifty World's activity.",
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/exchange.webp`,
    path: '/scenes/exchange',
  },
  {
    id: 'marina',
    title: 'Marina',
    description: 'Wander the Nifty World waterfront.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/marina.webp`,
    path: '/scenes/marina',
  },
  {
    id: 'rugmans-peak',
    title: "Rugman's Peak",
    description: "Climb Rugman's Peak for the view.",
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/rugmans-peak.webp`,
    path: '/scenes/rugmans-peak',
  },
  {
    id: 'arcade',
    title: 'Nifty Arcade',
    description: 'A neon-lit stop in the city.',
    image: `${NIFTY_WORLD_ORIGIN}/assets/maps/arcade.webp`,
    path: '/other/arcade',
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

import { DEGEN_TRIBES, type DegenTribeName } from '@nl/ui/degen-tribes'

export interface DegenSpecial {
  name: string
  description: string
  specialName: string
  gif: { link: string; width: number; height: number }
  image: { link: string; width: number; height: number }
}

type DegenSpecialDetails = Omit<DegenSpecial, 'image'> & { name: DegenTribeName }

const DEGEN_SPECIAL_DETAILS = [
  {
    name: 'APE',
    description: `If this ape is not eating bananas, he's throwing them. And those bananas hurt!`,
    specialName: 'Banana Boomerang',
    gif: { link: '/img/degens/specials/ape.gif', width: 512, height: 512 },
  },
  {
    name: 'HUMAN',
    description: `The primitive human's special move is dropping bombs… typical.`,
    specialName: 'Bomb',
    gif: { link: '/img/degens/specials/human.gif', width: 512, height: 512 },
  },
  {
    name: 'DOGE',
    description: `Doge performs a Doge Roll by rolling up into a Doge coin token and rolling left and right at high speed.`,
    specialName: 'Doge Roll',
    gif: { link: '/img/degens/specials/doge.gif', width: 512, height: 512 },
  },
  {
    name: 'FROG',
    description: `Watch out for that sticky tongue! If it tags another player, they'll be reeled in for a bonk. Plus, that tongue can cling to ceilings, walls, and even some platforms.`,
    specialName: 'Sticky Tongue',
    gif: { link: '/img/degens/specials/frog.gif', width: 500, height: 500 },
  },
  {
    name: 'CAT',
    description: `Charging up Cat's wiggle results in a temporary speed and power buff. The longer the charge-up, the longer and more powerful the buffs. Me-OW!`,
    specialName: 'Charge Up',
    gif: { link: '/img/degens/specials/cat.gif', width: 512, height: 512 },
  },
  {
    name: 'ALIEN',
    description: `Keep your eyes peeled because these aliens can teleport across the game screen quickly. Also a great way to avoid falling off the map.`,
    specialName: 'Teleport',
    gif: { link: '/img/degens/specials/alien.gif', width: 512, height: 512 },
  },
  {
    name: 'HYDRA',
    description: `The Hydras use a trident spear. They are an ancient tribe with a deep combat lineage and a VERY vicious special move!`,
    specialName: 'Trident Dash',
    gif: { link: '/img/degens/specials/hydra.gif', width: 512, height: 512 },
  },
] satisfies DegenSpecialDetails[]

const tribeByName = new Map(DEGEN_TRIBES.map((tribe) => [tribe.name, tribe]))

export const DEGEN_SPECIALS = DEGEN_SPECIAL_DETAILS.map((special) => {
  const tribe = tribeByName.get(special.name)
  if (!tribe) throw new Error(`Missing tribe artwork for ${special.name}`)
  return { ...tribe, ...special }
}) as DegenSpecial[]

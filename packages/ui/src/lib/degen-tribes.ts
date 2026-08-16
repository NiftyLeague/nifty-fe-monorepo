export interface DegenTribe {
  name: string
  image: {
    link: string
    width: number
    height: number
  }
}

export const DEGEN_TRIBES = [
  { name: 'APE', image: { link: '/icons/tribes/ape.svg', width: 91, height: 100 } },
  { name: 'HUMAN', image: { link: '/icons/tribes/human.svg', width: 120, height: 100 } },
  { name: 'DOGE', image: { link: '/icons/tribes/doge.svg', width: 115, height: 100 } },
  { name: 'FROG', image: { link: '/icons/tribes/frog.svg', width: 120, height: 95 } },
  { name: 'CAT', image: { link: '/icons/tribes/cat.svg', width: 120, height: 100 } },
  { name: 'ALIEN', image: { link: '/icons/tribes/alien.svg', width: 100, height: 100 } },
  { name: 'HYDRA', image: { link: '/icons/tribes/hydra.svg', width: 120, height: 120 } },
] as const satisfies readonly DegenTribe[]

export type DegenTribeName = (typeof DEGEN_TRIBES)[number]['name']

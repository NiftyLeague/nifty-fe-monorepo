/** Static route metadata; replaces the Next.js `Metadata` object shape. */
export type RouteMetadata = {
  title?: string
  description?: string
  image?: string
  noindex?: boolean
}

export const SITE_URL = 'https://niftysmashers.com'

export const DEFAULT_METADATA = {
  title: 'Nifty Smashers',
  description:
    'Free-to-play online multiplayer 3D party platform fighter. Play on iOS, Android, and Steam with full cross-play support! Jump in and brawl anytime, anywhere!',
  image: '/img/console-game/classic-gaming-reinvented.webp',
  keywords: [
    'Nifty League',
    'Nifty Smashers',
    'Gaming',
    'Web3',
    'Mobile Games',
    'Steam Games',
    'PC Games',
    'Platform Fighter',
  ],
}

export interface MetadataValues {
  title: string
  description: string
  canonical: string
  images: string[]
  noindex: boolean
}

export function metadataValues(meta: RouteMetadata, canonical: string): MetadataValues {
  const title = meta.title ? `${meta.title} | Nifty Smashers` : DEFAULT_METADATA.title
  const description = meta.description ?? DEFAULT_METADATA.description
  const image = new URL(meta.image ?? DEFAULT_METADATA.image, SITE_URL).href
  return {
    title,
    description,
    canonical: new URL(canonical, SITE_URL).href,
    images: [image],
    noindex: meta.noindex ?? false,
  }
}

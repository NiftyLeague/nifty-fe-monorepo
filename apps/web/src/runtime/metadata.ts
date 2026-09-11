/** Static marketing route metadata; replaces the Next.js `Metadata` shape. */
export type RouteMetadata = Record<string, unknown>

export const DEFAULT_METADATA = {
  title: 'Nifty League',
  description:
    'A decentralized game studio & publisher creating an open & efficient path for indie studios to develop & publish groundbreaking games.',
  keywords: ['Nifty League', 'NFT', 'Gaming', 'Web3', 'Metaverse', 'Mobile Gaming'],
  image: '/img/console-game/classic-gaming-reinvented.webp',
}
export function metadataValues(meta: Record<string, unknown>, canonical: string) {
  const titleValue = typeof meta.title === 'string' ? meta.title : ''
  const title = titleValue ? `${titleValue} | Nifty League` : DEFAULT_METADATA.title
  const description =
    typeof meta.description === 'string' ? meta.description : DEFAULT_METADATA.description
  const og = (meta.openGraph ?? {}) as Record<string, unknown>
  const candidates = Array.isArray(og.images) ? og.images : [og.images ?? DEFAULT_METADATA.image]
  const images = candidates
    .map((entry) => (typeof entry === 'string' ? entry : entry?.url))
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => new URL(entry, 'https://niftyleague.com').href)
  return {
    title,
    description,
    canonical: new URL(canonical, 'https://niftyleague.com').href,
    ogTitle:
      typeof og.title === 'string'
        ? og.title
        : titleValue || 'Nifty League: Community-Governed Game Studio & Publisher',
    ogDescription: typeof og.description === 'string' ? og.description : description,
    images: images.length
      ? images
      : [new URL(DEFAULT_METADATA.image, 'https://niftyleague.com').href],
  }
}

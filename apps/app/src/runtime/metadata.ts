import type { MetaDescriptor } from '@tanstack/react-router'

type MetaTag =
  | Extract<MetaDescriptor, { name?: string }>
  | Extract<MetaDescriptor, { title: string }>

const ROBOTS_DEFAULT = 'index, follow'

/**
 * Route metadata in the shape the app already used for `next`'s `Metadata`
 * export, flattened into the tags TanStack Router renders through `head()`.
 */
export interface RouteMetadata {
  title: string
  description?: string
  /** Overrides the parent document title instead of using the `%s | App` template. */
  absoluteTitle?: boolean
  keywords?: readonly string[]
  images?: readonly string[]
  /** Set for private or duplicate surfaces that should stay out of the index. */
  noindex?: boolean
}

const APP_ORIGIN = 'https://app.niftyleague.com'
const DEFAULT_IMAGE = 'https://niftyleague.com/img/backgrounds/banner-dark.webp'
const SITE_NAME = 'NiftyLeagueApp'
const TWITTER_CREATOR = '@NiftyLeague'

export const APP_TITLE = 'Nifty League App'
export const APP_DESCRIPTION = 'Web3 gaming app brought to you by Nifty League'
export const TITLE_TEMPLATE = `%s | ${APP_TITLE}`

export const metadataBase = new URL(APP_ORIGIN)

export function formatTitle(title: string, metadata?: RouteMetadata): string {
  if (metadata?.absoluteTitle) return title
  return title === APP_TITLE ? title : `${title} | ${APP_TITLE}`
}

const absoluteUrl = (value: string) => {
  try {
    return new URL(value, APP_ORIGIN).toString()
  } catch {
    return value
  }
}

/**
 * Builds the full tag set for a route: title, description, keywords, canonical
 * Open Graph, and Twitter cards. Defaults come from the app-level metadata so
 * each route only supplies what differs.
 */
export function buildMeta(metadata: RouteMetadata): Array<MetaDescriptor> {
  const description = metadata.description ?? APP_DESCRIPTION
  const images = (metadata.images ?? [DEFAULT_IMAGE]).map(absoluteUrl)

  const tags: Array<MetaDescriptor> = [
    { title: formatTitle(metadata.title, metadata) },
    { name: 'description', content: description },
    { name: 'robots', content: metadata.noindex ? 'noindex, nofollow' : ROBOTS_DEFAULT },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: metadata.title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: APP_ORIGIN },
    { property: 'og:locale', content: 'en_US' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: TWITTER_CREATOR },
    { name: 'twitter:creator', content: TWITTER_CREATOR },
    { name: 'twitter:title', content: metadata.title },
    { name: 'twitter:description', content: description },
  ]

  if (metadata.keywords?.length) {
    tags.push({ name: 'keywords', content: metadata.keywords.join(', ') })
  }

  for (const image of images) {
    tags.push({ property: 'og:image', content: image }, { name: 'twitter:image', content: image })
  }

  if (images[0]) tags.push({ name: 'twitter:image:alt', content: metadata.title })

  return tags
}

/** Root-level tags shared by every route. */
export function buildRootMeta(): Array<MetaDescriptor> {
  return [
    { charSet: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'theme-color', content: '#18181b', media: '(prefers-color-scheme: dark)' },
    { name: 'theme-color', content: '#fafafa', media: '(prefers-color-scheme: light)' },
    { name: 'color-scheme', content: 'dark light' },
    { name: 'referrer', content: 'origin-when-cross-origin' },
    { name: 'author', content: 'NiftyAndy' },
    { name: 'format-detection', content: 'telephone=no, address=no, email=no' },
    { title: APP_TITLE },
    { name: 'description', content: APP_DESCRIPTION },
  ]
}

export const buildHead = (metadata: RouteMetadata) => ({ meta: buildMeta(metadata) })

export const DEGEN_IMAGE_ORIGIN = APP_ORIGIN

/**
 * Share tags for a single DEGEN deep link. The token id resolves to a `.gif`
 * for the animated legendaries and a `.webp` otherwise.
 */
export function degenShareMeta(tokenId: string, imageUrl: string): Array<MetaDescriptor> {
  const title = `NL DEGEN #${tokenId}`

  return [
    { title: `${title} | ${APP_TITLE}` },
    { property: 'og:title', content: title },
    { property: 'og:image', content: imageUrl },
    { name: 'twitter:title', content: title },
    { name: 'twitter:image', content: imageUrl },
    { name: 'twitter:card', content: 'summary_large_image' },
  ]
}

export const siteMeta = {
  description: APP_DESCRIPTION,
  keywords: ['Nifty League', 'NFT', 'Gaming', 'Web3', 'Metaverse'],
  title: APP_TITLE,
} as const

export type { MetaTag }

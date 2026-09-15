export const BASE_API_URL = 'https://odgwhiwhzb.execute-api.us-east-1.amazonaws.com/prod'

// Cloudflare R2 bucket behind cdn.niftyleague.com — migrated public assets.
// Remaining S3 dependencies (Unity builds, degen glTFs) are tracked separately.
export const CDN_BASE_URL = 'https://cdn.niftyleague.com'
export const PUBLIC_DEGENS_API_URL = '/api/degens'
export const getPublicDegensByIdsUrl = (ids: string[]) =>
  `${PUBLIC_DEGENS_API_URL}?ids=${ids.map(encodeURIComponent).join(',')}`

export const MY_PROFILE_API_URL = `${BASE_API_URL}/stats/profile`
export const PROFILE_FAV_DEGENS_API = `${BASE_API_URL}/profiles/favorites`
export const GET_GAMER_PROFILE_API = `${BASE_API_URL}/profiles/profile?include_stats=true`

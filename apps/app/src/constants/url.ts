import {
  BASE_API_URL,
  DEGEN_BASE_API_URL,
  GET_GAMER_PROFILE_API,
  MY_PROFILE_API_URL,
  PROFILE_FAV_DEGENS_API,
  getPublicDegensByIdsUrl,
} from './api'
export {
  BASE_API_URL,
  DEGEN_BASE_API_URL,
  GET_GAMER_PROFILE_API,
  MY_PROFILE_API_URL,
  PROFILE_FAV_DEGENS_API,
  getPublicDegensByIdsUrl,
} from './api'
export {
  ADDRESS_VERIFICATION,
  GET_PROFILE_AVATARS_AND_COST_API,
  PROFILE_RENAME_API,
  WALLET_VERIFICATION,
} from './auth-urls'
export { DEGEN_PURCHASE_URL, NFTL_PURCHASE_URL } from './public-urls'

const NEXT_PUBLIC_NETWORK = process.env.NEXT_PUBLIC_NETWORK as string

// Degen API url
// Rentals API url
export const DISABLE_RENT_API_URL = `${BASE_API_URL}/rentals/rentable/`
export const DEGEN_ASSETS_DOWNLOAD_URL = `${BASE_API_URL}/assets/degen`
export const MY_RENTAL_API_URL = `${BASE_API_URL}/rentals/my-rentals?active=true`
export const MY_RENTAL_API_URL_INACTIVE = `${BASE_API_URL}/rentals/my-rentals?active=false`
export const ALL_RENTAL_API_URL = `${BASE_API_URL}/rentals/all-rentals?active=true`
export const ALL_RENTAL_API_URL_INACTIVE = `${BASE_API_URL}/rentals/all-rentals?active=false`
export const RENTED_FROM_ME_API_URL = `${BASE_API_URL}/rentals/rented-from-me`
export const TERMINATE_RENTAL_API_URL = `${BASE_API_URL}/rentals/rental/terminate`
export const RENAME_RENTAL_API_URL = `${BASE_API_URL}/rentals/rental/rename`
export const RENTAL_PASS_INVENTORY_URL = `${BASE_API_URL}/accounts/account/inventory?id=rental-pass-base`
export const RENT_URL = `${BASE_API_URL}/rentals/rent`
export const GET_DEGEN_DETAIL_URL = (degenId: string): string =>
  `${BASE_API_URL}/rentals/rentables?degen_id=${encodeURIComponent(degenId)}`

// Gamer Account API
export const GAMER_ACCOUNT_API = `${BASE_API_URL}/accounts/account`

// Gamer Profile API
const GAMER_PROFILE_BASE = 'profiles/profile'
export const UPDATE_PROFILE_AVATAR_API = `${BASE_API_URL}/${GAMER_PROFILE_BASE}/avatar`

// Arcade API
export const GET_ARCADE_TOKEN_BALANCE_API = `${BASE_API_URL}/accounts/account/inventory?id=arcade-token`

// Marketplace API
export const PURCHASE_ARCADE_TOKEN_BALANCE_API = `${BASE_API_URL}/marketplace/product/purchase`
export const GET_PRODUCT = (productId: string, currency: string) =>
  `${BASE_API_URL}/marketplace/product?id=${productId}&currency=${currency}`

// Leaderboards
export const GET_RANK_BY_USER_ID_API = `${BASE_API_URL}/GetRank`
export const LEADERBOARD_USERNAMES_API_URL = `${BASE_API_URL}/profiles/public/profiles`

// DEGEN URLs
export const DEGEN_COLLECTION_URL = 'https://opensea.io/collection/niftydegen'
// Marketplace URLs
export const COMICS_PURCHASE_URL = 'https://tokentrove.com/collection/NiftyLeague'
export const ITEM_PURCHASE_URL = 'https://tokentrove.com/collection/NiftyLeague'

// NFTL
export const CONVERT_TOKEN_TO_USD_URL = 'https://price-api.crypto.com/price/v1/exchange/'
export const COW_PROTOCOL_URL = 'https://cow.fi/'
export const IMX_SQUID_BRIDGE_URL = 'https://toolkit.immutable.com/squid-bridge/'
export const AXELAR_TRANSACTIONS_URL = (address: `0x${string}`) =>
  `https://${NEXT_PUBLIC_NETWORK === 'sepolia' ? 'testnet.' : ''}axelarscan.io/address/${address}?transfersType=gmp`
export const SNAPSHOT_PORTAL_URL = 'https://snapshot.niftyleague.com'
export const GOVERNANCE_PORTAL_URL = 'https://niftyleague.com/tally'

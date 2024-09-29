import { mainnet, immutableZkEvm } from 'viem/chains';
import { getContractAddress, DEGEN_CONTRACT, NFTL_IMX_CONTRACT } from './contracts';

export const BASE_API_URL = 'https://odgwhiwhzb.execute-api.us-east-1.amazonaws.com/prod';

export const CONTRACTS_API_BASE_URL = 'https://api.niftyleague.com';

export const SUBGRAPH_CACHE_URL = `${BASE_API_URL}/info?network=${process.env.NEXT_PUBLIC_NETWORK as string}&version=${
  process.env.NEXT_PUBLIC_SUBGRAPH_VERSION as string
}&characters=false`;

// Authentication
export const WALLET_VERIFICATION = `${BASE_API_URL}/verification`;
export const ADDRESS_VERIFICATION = `${BASE_API_URL}/verification/address`;

// Degen API url
export const DEGEN_BASE_API_URL = 'https://nifty-league.s3.amazonaws.com';
export const DEGEN_BASE_IMAGE_URL = `${DEGEN_BASE_API_URL}/degens`;

// Rentals API url
export const DISABLE_RENT_API_URL = `${BASE_API_URL}/rentals/rentable/`;
export const DEGEN_ASSETS_DOWNLOAD_URL = `${BASE_API_URL}/assets/degen`;
export const MY_RENTAL_API_URL = `${BASE_API_URL}/rentals/my-rentals?active=true`;
export const MY_RENTAL_API_URL_INACTIVE = `${BASE_API_URL}/rentals/my-rentals?active=false`;
export const ALL_RENTAL_API_URL = `${BASE_API_URL}/rentals/all-rentals?active=true`;
export const ALL_RENTAL_API_URL_INACTIVE = `${BASE_API_URL}/rentals/all-rentals?active=false`;
export const RENTED_FROM_ME_API_URL = `${BASE_API_URL}/rentals/rented-from-me`;
export const TERMINATE_RENTAL_API_URL = `${BASE_API_URL}/rentals/rental/terminate`;
export const RENAME_RENTAL_API_URL = `${BASE_API_URL}/rentals/rental/rename`;
export const RENTAL_PASS_INVENTORY_URL = `${BASE_API_URL}/accounts/account/inventory?id=rental-pass-base`;
export const RENTAL_RENAME_URL = (rentalId: string): string =>
  `${BASE_API_URL}/rentals/rental/rename?id=${encodeURIComponent(rentalId)}`;
export const RENT_URL = `${BASE_API_URL}/rentals/rent`;
export const GET_DEGEN_DETAIL_URL = (degenId: string): string =>
  `${BASE_API_URL}/rentals/rentables?degen_id=${encodeURIComponent(degenId)}`;

// Gamer Account API
export const GAMER_ACCOUNT_API = `${BASE_API_URL}/accounts/account`;

// Gamer Profile API
export const MY_PROFILE_API_URL = `${BASE_API_URL}/stats/profile`;
export const PROFILE_FAV_DEGENS_API = `${BASE_API_URL}/profiles/favorites`;

const GAMER_PROFILE_BASE = 'profiles/profile';
export const GET_GAMER_PROFILE_API = `${BASE_API_URL}/${GAMER_PROFILE_BASE}?include_stats=true`;
export const PROFILE_RENAME_API = `${BASE_API_URL}/${GAMER_PROFILE_BASE}/rename`;
export const GET_PROFILE_AVATARS_AND_COST_API = `${BASE_API_URL}/${GAMER_PROFILE_BASE}/avatars`;
export const UPDATE_PROFILE_AVATAR_API = `${BASE_API_URL}/${GAMER_PROFILE_BASE}/avatar`;

// Arcade API
export const GET_ARCADE_TOKEN_BALANCE_API = `${BASE_API_URL}/accounts/account/inventory?id=arcade-token`;

// Marketplace API
export const PURCHASE_ARCADE_TOKEN_BALANCE_API = `${BASE_API_URL}/marketplace/product/purchase`;
export const GET_PRODUCT = (productId: string, currency: string) =>
  `${BASE_API_URL}/marketplace/product?id=${productId}&currency=${currency}`;

// Leaderboards
export const GET_RANK_BY_USER_ID_API = `${BASE_API_URL}/GetRank`;
export const LEADERBOARD_USERNAMES_API_URL = `${BASE_API_URL}/profiles/public/profiles`;
export const LEADERBOARD_SCORE_API_URL = `${BASE_API_URL}/scores`;

// QUICKSWAP URL FOR NFTL PURCHASE
export const NFTL_PURCHASE_URL = `https://quickswap.exchange/#/analytics/v3/token/${getContractAddress(
  immutableZkEvm.id,
  NFTL_IMX_CONTRACT,
)}`;

// DEGEN URLs
export const DEGEN_COLLECTION_URL = 'https://opensea.io/collection/niftydegen';
export const DEGEN_PURCHASE_URL = (id: string | number) =>
  `https://opensea.io/assets/${getContractAddress(mainnet.id, DEGEN_CONTRACT)}/${id}`;

// Marketplace URLs
export const COMICS_PURCHASE_URL = 'https://tokentrove.com/collection/NiftyLeague';
export const ITEM_PURCHASE_URL = 'https://tokentrove.com/collection/NiftyLeague';

// NFTL
export const CONVERT_TOKEN_TO_USD_URL = 'https://price-api.crypto.com/price/v1/exchange/';
export const COW_PROTOCOL_URL = 'https://cow.fi/';
export const IMX_SQUID_BRIDGE_URL = 'https://toolkit.immutable.com/squid-bridge/';
export const IMX_AXELAR_BRIDGE_URL = 'https://toolkit.immutable.com/ethereum-bridge/';
export const SNAPSHOT_PORTAL_URL = 'https://niftyleague.com/snapshot';
export const GOVERNANCE_PORTAL_URL = 'https://niftyleague.com/tally';

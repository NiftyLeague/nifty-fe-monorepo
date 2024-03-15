import { mainnet, goerli } from 'viem/chains';
import { IMX_NL_ITEMS, NFTL_TOKEN_ADDRESS } from './contracts';

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
export const WITHDRAW_NFTL_LIST = `${BASE_API_URL}/accounts/withdrawals`;
export const WITHDRAW_NFTL_SIGN = `${BASE_API_URL}/accounts/withdraw/sign`;
export const WITHDRAW_NFTL_CONFIRM = `${BASE_API_URL}/accounts/withdraw/confirm`;
export const WITHDRAW_NFTL_REFRESH = `${BASE_API_URL}/accounts/withdraw/refresh/2`;
export const WITHDRAW_NFTL_AVAILABILITY = `${BASE_API_URL}/accounts/withdraw/availability`;

// Gamer Profile API
export const MY_PROFILE_API_URL = `${BASE_API_URL}/stats/profile`;
const GAMER_PROFILE_BASE = 'profiles/profile';
export const PROFILE_FAV_DEGENS_API = `${BASE_API_URL}/profiles/favorites`;
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

// SUSHISWAP URL FOR NFTL PURCHASE
export const NFTL_PURCHASE_URL = `https://app.sushi.com/swap?inputCurrency=ETH&outputCurrency=${
  NFTL_TOKEN_ADDRESS[mainnet.id]
}`;

// DEGEN Purchase URL
export const DEGEN_OPENSEA_URL = 'https://opensea.io/collection/niftydegen';

// Comic Purchase URL
export const COMICS_OPENSEA_URL = 'https://opensea.io/collection/nifty-league-comics';

export const ITEM_PURCHASE_URL = {
  [mainnet.id]: `https://market.immutable.com/collections/${IMX_NL_ITEMS[mainnet.id]}`,
  [goerli.id]: `https://market.sandbox.immutable.com/collections/${IMX_NL_ITEMS[goerli.id]}`,
};

export const CONVERT_TOKEN_TO_USD_URL = 'https://price-api.crypto.com/price/v1/exchange/';

export const COW_PROTOCOL_URL = 'https://cow.fi/';

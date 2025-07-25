import { mainnet, sepolia } from 'viem/chains';

enum ChainId {
  MAINNET = mainnet.id,
  SEPOLIA = sepolia.id,
}

// MY ALCHEMY_ID, SWAP IN YOURS FROM https://dashboard.alchemyapi.io/
export const ALCHEMY_ID: { [key in ChainId]?: string } = {
  [mainnet.id]: process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_API as string,
  [sepolia.id]: process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_API as string,
};

export const SUBGRAPH_URI = `https://gateway.thegraph.com/api/subgraphs/id/${process.env.NEXT_PUBLIC_GRAPH_ID}`;

export const SUBGRAPH_DEV_URI = 'https://api.studio.thegraph.com/query/7093/nifty-league-sepolia/version/latest';

export const DEBUG = process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || process.env.NEXT_PUBLIC_DEBUG === 'true';

// Request polling intervals

export const REMOVED_TRAITS_INTERVAL = DEBUG ? 20000 : 60000;
export const BALANCE_INTERVAL = DEBUG ? 300000 : 10000;

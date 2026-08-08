export const SUBGRAPH_URI = `https://gateway.thegraph.com/api/subgraphs/id/${process.env.NEXT_PUBLIC_GRAPH_ID}`

export const SUBGRAPH_DEV_URI =
  'https://api.studio.thegraph.com/query/7093/nifty-league-sepolia/version/latest'

export const DEBUG =
  process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || process.env.NEXT_PUBLIC_DEBUG === 'true'

// Request polling intervals

export const REMOVED_TRAITS_INTERVAL = DEBUG ? 20000 : 60000

import { DEBUG as DEBUG_ENV, GRAPH_ID } from '@/runtime/env'

export const SUBGRAPH_URI = `https://gateway.thegraph.com/api/subgraphs/id/${GRAPH_ID}`

export const SUBGRAPH_DEV_URI =
  'https://api.studio.thegraph.com/query/7093/nifty-league-sepolia/version/latest'

export const DEBUG = DEBUG_ENV

// Request polling intervals

export const REMOVED_TRAITS_INTERVAL = DEBUG ? 20000 : 60000

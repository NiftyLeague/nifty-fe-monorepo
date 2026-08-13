import { type PublicClient, createPublicClient, fallback, http } from 'viem'
import { mainnet } from 'viem/chains'

const infuraProjectId =
  process.env.NEXT_PUBLIC_INFURA_ID ?? process.env.NEXT_PUBLIC_INFURA_PROJECT_ID

const rpcTransports = [
  ...(infuraProjectId ? [http(`https://mainnet.infura.io/v3/${infuraProjectId}`)] : []),
  // Keep public GLTF pages working when the optional Infura variable is missing,
  // rotated, or temporarily rate-limited.
  http('https://ethereum-rpc.publicnode.com'),
]

export const publicClient: PublicClient = createPublicClient({
  chain: mainnet,
  transport: fallback(rpcTransports),
})

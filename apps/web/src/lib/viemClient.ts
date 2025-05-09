import { type PublicClient, createPublicClient, http } from 'viem';
import { mainnet } from 'viem/chains';

export const publicClient: PublicClient = createPublicClient({
  chain: mainnet,
  transport: http(`https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`),
});

import { config } from 'node-config-ts'

import type { Signer, TargetNetwork } from '@/types'
import { getWallet } from '@/utils/wallet'
import { mintV2 } from '@/imx/client'

async function get_imx_client(network: TargetNetwork): Promise<Signer> {
  return getWallet<Signer>(network)
}

export async function mint(
  targetNetwork: TargetNetwork,
  contractAddress: string,
  to: string,
  tokenIds: string[],
  itemId: string
): Promise<unknown> {
  if (tokenIds.length === 0) return
  // Get configuration for the network
  const signer = await get_imx_client(targetNetwork)
  const { client } = config.imx[targetNetwork]

  console.log('Minting on L2...')
  const tokens = tokenIds.map((x) => ({ id: x.toString(), blueprint: itemId }))
  const mint_result = await mintV2(client.publicApiUrl, signer, {
    contractAddress,
    users: [{ ether_key: to, tokens }],
  })
  console.log(
    `✅ Minting of tokenId(s) ${tokenIds} for collection ${contractAddress.toLowerCase()} successful!`
  )

  return mint_result.results[0]
}

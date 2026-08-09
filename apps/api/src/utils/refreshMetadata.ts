import fetch from 'node-fetch'
import { config } from 'node-config-ts'
import type { ContractName, TargetNetwork } from '@/types'
import { DEGEN_CONTRACT_NAME } from '@/constants/contracts'
import { MARKETPLACE_ITEMS } from '@/constants/metadata'
import { getContractAddress } from '@/contracts'

export async function refreshOpenSea(
  targetNetwork: TargetNetwork,
  tokenId: string | number,
  contractName: ContractName = DEGEN_CONTRACT_NAME
) {
  console.log(`⚠️  Refreshing OpenSea data for tokenID:`, tokenId)
  const chain = targetNetwork === 'mainnet' ? 'ethereum' : 'sepolia'
  const contract = getContractAddress(targetNetwork, contractName)
  const baseURL = `https://${targetNetwork === 'sepolia' ? 'testnets-' : ''}api.opensea.io/api/v2`
  const refreshAPI = `${baseURL}/chain/${chain}/contract/${contract}/nfts/${tokenId}/refresh`
  const headers = { 'X-API-KEY': config.eth.opensea }
  const response = await fetch(refreshAPI, { method: 'POST', headers })
  if (response.status < 400) {
    console.log('✅ OpenSea metadata refreshed')
    return response.json()
  } else {
    console.error('❌ OpenSea metadata refresh failed:', response.statusText)
    return null
  }
}

export async function refreshImmutable(targetNetwork: TargetNetwork) {
  console.log(`⚠️  Refreshing Immutable metadata`)
  const { apiKey, collection, client } = config.imx[targetNetwork]
  const chain = targetNetwork === 'mainnet' ? 'imtbl-zkevm-mainnet' : 'imtbl-zkevm-testnet'

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'x-immutable-api-key': apiKey,
    },
    body: JSON.stringify({
      nft_metadata: MARKETPLACE_ITEMS.map((item) => ({
        ...item,
        // 400 if not provided
        animation_url: '',
        youtube_url: '',
      })),
    }),
  }

  const refreshAPI = `${client.publicApiUrl}/chains/${chain}/collections/${collection.contractAddress}/nfts/refresh-metadata`
  const response = await fetch(refreshAPI, options)

  if (response.status < 400) {
    console.log('✅ Immutable metadata refreshed')
    return response.json()
  } else {
    console.error('❌ Immutable metadata refresh failed:', response.statusText)
    return null
  }
}

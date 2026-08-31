import { config } from 'node-config-ts'
import { generateIMXAuthorisationHeaders } from '@/utils/sign'
import type { TargetNetwork } from '@/types'
import { getWallet } from '@/utils/wallet'
import { requestJson } from '@/utils/request-json'

const network = config.eth.network as TargetNetwork

;(async (): Promise<void> => {
  console.group('IMX-CREATE-COLLECTION')
  const { apiKey, client, collection, project } = config.imx[network]
  const collectionContractAddress = collection.contractAddress
  const projectId = project.legacyId
  const signer = getWallet()

  console.log('Creating collection...', collectionContractAddress)

  const { timestamp, signature } = await generateIMXAuthorisationHeaders(signer)

  const createCollectionRequest = {
    name: collection.name,
    description: collection.description,
    contract_address: collection.contractAddress,
    owner_public_key: signer.signingKey.publicKey,
    icon_url: collection.iconUrl,
    metadata_api_url: collection.metadataApiUrl,
    collection_image_url: collection.imageUrl,
    project_id: parseInt(projectId, 10),
  }

  const headers: Record<string, string> = {
    'Content-type': 'application/json',
    'IMX-Signature': signature,
    'IMX-Timestamp': timestamp,
    'x-immutable-api-key': apiKey,
  }

  const data = await requestJson<unknown>(`${client.publicApiUrl}/collections`, {
    body: createCollectionRequest,
    headers,
    method: 'POST',
  })

  console.log('✅ Created collection!')
  console.log(JSON.stringify(data, null, 2))
  console.groupEnd()
})().catch((e) => {
  console.error(`❌ ${e} - ${e.response?.data?.message}`)
  console.groupEnd()
  process.exit(1)
})

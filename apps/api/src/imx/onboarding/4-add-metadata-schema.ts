import { config } from 'node-config-ts'
import type { TargetNetwork } from '@/types'
import { addMetadataSchemaToCollection } from '@/imx/client'

const network = config.eth.network as TargetNetwork

;(async (): Promise<void> => {
  console.group('IMX-ADD-COLLECTION-METADATA-SCHEMA')
  const { collection, apiKey } = config.imx[network]
  const collectionContractAddress = collection.contractAddress

  console.log('Adding metadata schema to collection...', collectionContractAddress)

  /**
   * Edit your values here
   */
  const metadata = [
    { name: 'item_id', type: 'continuous', filterable: false },
    { name: 'name', type: 'enum', filterable: true },
    { name: 'type', type: 'enum', filterable: true },
    { name: 'tier', type: 'enum', filterable: true },
    { name: 'placement', type: 'enum', filterable: true },
    { name: 'image_url', type: 'text', filterable: false },
    { name: 'description', type: 'text', filterable: false },
  ]

  const newCollection = await addMetadataSchemaToCollection(
    config.imx[network].client.publicApiUrl,
    collectionContractAddress,
    metadata,
    apiKey
  )

  console.log('✅ Added metadata schema to collection', collectionContractAddress)
  console.log(JSON.stringify(newCollection, null, 2))
  console.groupEnd()
})().catch((e) => {
  console.error(`❌ ${e} - ${e.response?.data?.message}`)
  console.groupEnd()
  process.exit(1)
})

import { config } from 'node-config-ts'
import { parse } from 'ts-command-line-args'
import type { TargetNetwork } from '@/types'
import { updateMetadataSchemaByName } from '@/imx/client'

const network = config.eth.network as TargetNetwork

;(async (): Promise<void> => {
  console.group('IMX-UPDATE-COLLECTION-METADATA-SCHEMA')
  const { collection, apiKey, client } = config.imx[network]
  const collectionContractAddress = collection.contractAddress

  const { name } = parse<{ name: string }>({
    name: {
      type: String,
      alias: 'n',
      description: 'Name of the metadata property you want to update',
    },
  })

  console.log(`Updating metadata schema for ${name}...`, collectionContractAddress)

  /**
   * Edit your values here
   */
  const params = {
    name: 'NEW_NAME',
    type: 'enum',
    filterable: false,
  }

  const message = await updateMetadataSchemaByName(
    client.publicApiUrl,
    collectionContractAddress,
    name,
    params,
    apiKey
  )

  console.log(`✅ Updated metadata schema for ${name}.`)
  console.log(JSON.stringify(message, null, 2))
  console.groupEnd()
})().catch((e) => {
  console.error(e)
  console.groupEnd()
  process.exit(1)
})

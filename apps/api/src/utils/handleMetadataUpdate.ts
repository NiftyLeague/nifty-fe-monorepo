import { colorize } from 'json-colorizer'
import { COLORIZE_OPTIONS } from '@/constants/commandLine'
import { TargetNetwork } from '@/types'
import { MakeDegen } from '@/classes/degen'

export default async function handleMetadataUpdate(targetNetwork: TargetNetwork, tokenId: number) {
  const minty = await MakeDegen(targetNetwork)
  const { exists, metadata } = await minty.checkTokenMetadataExists(tokenId)
  if (exists) {
    console.log(`⚠️  Updating Metadata for tokenID:`, tokenId)
    const { newMetadata } = await minty.updateDegenMetadata(tokenId, metadata)
    console.log('')
    console.log('Updated NFT Metadata:')
    console.log(colorize(JSON.stringify(newMetadata), COLORIZE_OPTIONS))
    return { metadata: newMetadata }
  }
}

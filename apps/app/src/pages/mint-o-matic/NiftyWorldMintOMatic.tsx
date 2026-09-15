import { NIFTY_WORLD_ORIGIN } from '@/constants/niftyworld-games'
import NiftyWorldEmbed from '@/pages/world/NiftyWorldEmbed'

const MINT_O_MATIC_PATH = '/other/mint-o-matic'

export const getMintOMaticUrl = (embedded = false, attempt = 0, visitId?: string) => {
  const url = new URL(MINT_O_MATIC_PATH, NIFTY_WORLD_ORIGIN)

  if (embedded) url.searchParams.set('embed', '1')
  if (visitId) url.searchParams.set('visit', visitId)
  if (embedded && attempt > 0) url.searchParams.set('attempt', String(attempt))

  return url.toString()
}

export default function NiftyWorldMintOMatic() {
  return (
    <NiftyWorldEmbed
      title="Mint-o-Matic"
      eyebrow="Nifty World"
      backHref="/"
      backLabel="Back to home"
      frameTitle="Mint-o-Matic character creator"
      canonicalUrl={getMintOMaticUrl()}
      getEmbedUrl={(attempt, visitId) => getMintOMaticUrl(true, attempt, visitId)}
    />
  )
}

import DegenImage from '@/components/cards/DegenCard/DegenImage'

interface DegenModalMediaProps {
  tokenId: string
  loading?: 'eager' | 'lazy'
}

/** Keep the NFT artwork inside the modal column at its native portrait ratio. */
export default function DegenModalMedia(props: DegenModalMediaProps) {
  return (
    <div class="flex w-full min-w-0 justify-center">
      <div class="aspect-[584/640] w-full max-w-125 min-w-0 overflow-hidden">
        <DegenImage
          class="block size-full max-h-full max-w-full object-contain"
          loading={props.loading ?? 'eager'}
          tokenId={props.tokenId}
        />
      </div>
    </div>
  )
}

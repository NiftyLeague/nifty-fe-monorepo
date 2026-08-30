import DegenImage from '@/components/cards/DegenCard/DegenImage'
import type { SxProps } from '@/types'

interface DegenModalMediaProps {
  tokenId: string
  loading?: 'eager' | 'lazy'
  sx?: SxProps<{}>
}

/** Keep the NFT artwork inside the modal column at its native portrait ratio. */
export default function DegenModalMedia({ tokenId, loading = 'eager', sx }: DegenModalMediaProps) {
  return (
    <div className="flex w-full min-w-0 justify-center">
      <div className="aspect-[584/640] w-full max-w-[500px] min-w-0 overflow-hidden">
        <DegenImage
          sx={{
            ...sx,
            display: 'block',
            width: '100%',
            maxWidth: '100%',
            height: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
          loading={loading}
          tokenId={tokenId}
        />
      </div>
    </div>
  )
}

import { createMemo, type JSX } from 'solid-js'
import NativeImage from '@nl/ui/custom/native-image'
import { toast } from 'solid-sonner'
import { Heart } from 'lucide-solid'
import { Button } from '@nl/ui/base/button'
import { formatNumberToDisplay } from '@nl/ui/number-format'
import useClaimableNFTL from '@/hooks/balances/useClaimableNFTL'
import useAuth from '@/hooks/useAuth'
import { downloadDegenAsZip } from '@/utils/file'
import { errorMsgHandler } from '@/utils/errorHandlers'

interface DegenDashboardActionsProps {
  tokenId: string
  fav: boolean
  size: 'small' | 'normal'
  onClickFavorite?: JSX.EventHandlerUnion<HTMLButtonElement, Event>
}

const DegenClaimBal = (props: { tokenId: string; fontSizeClass: string }) => {
  const degenTokenIndices = createMemo(() => [parseInt(props.tokenId, 10)])
  const claimable = useClaimableNFTL(degenTokenIndices)
  const amountParsed = () => formatNumberToDisplay(claimable.balance, 0)
  return (
    <span
      class={`text-center ${props.fontSizeClass}`}
      style={props.fontSizeClass === 'text-(--tiny-fs)' ? { '--tiny-fs': '8px' } : undefined}
    >
      {`${amountParsed()} NFTL`}
    </span>
  )
}

const DegenDashboardActions = (props: DegenDashboardActionsProps) => {
  const auth = useAuth()

  const onClickDownload = async () => {
    if (!auth.authToken) return
    try {
      await downloadDegenAsZip(auth.authToken, props.tokenId)
    } catch (err) {
      toast.error(errorMsgHandler(err))
    }
  }

  return (
    <div class="flex flex-row items-center justify-between px-2 pt-2 leading-normal">
      <div class="flex flex-row items-center">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          class="mr-3 size-6 cursor-pointer p-0"
          onClick={props.onClickFavorite}
          aria-label={props.fav ? 'Remove degen from favorites' : 'Add degen to favorites'}
        >
          <Heart
            color="currentColor"
            stroke-width={props.fav ? 0 : 1.5}
            fill={props.fav ? 'var(--color-foreground)' : 'none'}
            size={props.size === 'small' ? 12 : 16}
            aria-hidden="true"
          />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          class="h-auto cursor-pointer gap-0 p-0"
          onClick={() => void onClickDownload()}
          aria-label="Download degen"
        >
          <span
            class={`pr-1 ${props.size === 'small' ? 'text-(--tiny-fs)' : 'text-xs'}`}
            style={props.size === 'small' ? { '--tiny-fs': '8px' } : undefined}
          >
            IP
          </span>
          <NativeImage
            src="/icons/download-solid.svg"
            alt=""
            width={props.size === 'small' ? 12 : 16}
            height={props.size === 'small' ? 12 : 16}
          />
        </Button>
      </div>
      <DegenClaimBal
        tokenId={props.tokenId}
        fontSizeClass={props.size === 'small' ? 'text-(--tiny-fs)' : 'text-xs'}
      />
    </div>
  )
}

export default DegenDashboardActions

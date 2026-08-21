import Link from 'next/link'
import NativeImage from '@nl/ui/custom/native-image'
import { buttonVariants } from '@nl/ui/base/button-variants'
import { Card, CardContent } from '@nl/ui/base/card'
import { Title } from '@nl/ui/custom/typography'
import { ExternalIcon } from '@nl/ui/custom/external-icon'
import { cn } from '@nl/ui/utils'
import type { SxProps, Theme } from '@/types'

interface GameDescriptionDisclosureProps {
  description?: string
}

const GameDescriptionDisclosure = ({ description }: GameDescriptionDisclosureProps) => (
  <details className="group flex flex-col">
    <summary className="order-2 cursor-pointer list-none text-left text-sm text-purple">
      <span className="group-open:hidden">more..</span>
      <span className="hidden group-open:inline">less</span>
    </summary>
    <p
      className="order-1 max-h-[42px] overflow-y-hidden text-sm text-muted-foreground group-open:max-h-none"
      style={{ whiteSpace: 'pre-wrap' }}
    >
      {description}
    </p>
  </details>
)

type CardGameContentProps = {
  actions?: React.ReactNode
  description?: string
  externalLink?: { title: string; src: string }
  isComingSoon?: boolean
  onPlayOnDesktopClick?: React.MouseEventHandler<HTMLButtonElement>
  onPlayOnWebClick?: React.MouseEventHandler<HTMLButtonElement>
  required?: string
  showMore?: boolean
  title?: string
}

const CardGameContent = ({
  actions,
  description,
  externalLink,
  isComingSoon,
  onPlayOnDesktopClick,
  onPlayOnWebClick,
  required,
  showMore,
  title,
}: CardGameContentProps) => {
  return (
    <div className="flex grow flex-col justify-between bg-card">
      <CardContent className="p-6 pb-0">
        <div className="flex flex-row flex-wrap items-center justify-between gap-x-2 gap-y-2">
          <Title
            level={3}
            className="min-w-0 text-xl font-normal font-subheader tracking-subheader"
          >
            {title}
          </Title>
          {externalLink ? (
            <Link
              href={externalLink.src}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ size: 'sm', className: 'shrink-0 px-3' })}
            >
              {externalLink.title} <ExternalIcon />
            </Link>
          ) : null}
        </div>
        {isComingSoon && <p className="text-sm text-warning">Coming 2023</p>}
        {required && <p className="text-sm text-warning">{required}</p>}
        {showMore ? (
          <GameDescriptionDisclosure description={description} />
        ) : (
          <p
            className="text-sm text-muted-foreground"
            style={{
              whiteSpace: 'pre-wrap',
              maxHeight: 42,
              overflowY: 'hidden',
            }}
          >
            {description}
          </p>
        )}
      </CardContent>
      <div className="flex items-center gap-2 px-6 pb-6">
        <div className="flex w-full flex-row flex-wrap gap-x-2 gap-y-4">
          {actions || (
            <>
              <button
                type="button"
                className={buttonVariants({
                  variant: 'default',
                  className: 'min-w-20 w-full flex-1',
                })}
                onClick={onPlayOnDesktopClick}
              >
                Play on Desktop
              </button>
              <button
                type="button"
                className={buttonVariants({
                  variant: 'outline',
                  className: 'min-w-20 w-full flex-1',
                })}
                onClick={onPlayOnWebClick}
              >
                Play on Web
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export interface GameCardProps {
  actions?: React.ReactNode
  autoHeight?: boolean
  contents?: React.ReactNode
  description?: string
  externalLink?: { title: string; src: string }
  image?: string
  imageContent?: React.ReactNode
  imageFetchPriority?: 'auto' | 'high' | 'low'
  imageLoading?: 'eager' | 'lazy'
  isComingSoon?: boolean
  onPlayOnDesktopClick?: React.MouseEventHandler<HTMLButtonElement>
  onPlayOnWebClick?: React.MouseEventHandler<HTMLButtonElement>
  required?: string
  showMore?: boolean
  sx?: SxProps<Theme>
  title?: string
}

const GameCard: React.FC<React.PropsWithChildren<React.PropsWithChildren<GameCardProps>>> = ({
  actions,
  autoHeight = false,
  contents,
  description,
  externalLink,
  image,
  imageContent,
  imageFetchPriority = 'auto',
  imageLoading = 'lazy',
  isComingSoon,
  onPlayOnDesktopClick,
  onPlayOnWebClick,
  required,
  showMore = false,
  sx,
  title,
}) => {
  return (
    <Card
      className={cn(
        'flex w-full flex-col gap-0 overflow-hidden border py-0',
        autoHeight ? 'h-auto' : 'h-full'
      )}
      style={sx as React.CSSProperties | undefined}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          paddingTop: '56.25%' /* 16:9 Aspect Ratio */,
        }}
      >
        {imageContent ??
          (image && (
            <NativeImage
              src={image}
              alt={title || 'Game artwork'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              loading={imageLoading}
              fetchPriority={imageFetchPriority}
              className="object-cover"
            />
          ))}
      </div>
      {contents || (
        <CardGameContent
          actions={actions}
          description={description}
          externalLink={externalLink}
          isComingSoon={isComingSoon}
          onPlayOnDesktopClick={onPlayOnDesktopClick}
          onPlayOnWebClick={onPlayOnWebClick}
          required={required}
          showMore={showMore}
          title={title}
        />
      )}
    </Card>
  )
}

export default GameCard

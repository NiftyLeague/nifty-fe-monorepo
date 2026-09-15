import OptimizedImage from '@nl/ui/custom/optimized-image'
import { buttonVariants } from '@nl/ui/base/button-variants'
import { Card, CardContent } from '@nl/ui/base/card'
import { Title } from '@nl/ui/custom/typography'
import { ExternalIcon } from '@nl/ui/custom/external-icon'
import { GAME_CARD_IMAGE_SIZES } from '@nl/ui/image-sizes'
import { cx } from '@nl/ui/class-names'

import Link from '@/runtime/Link'
import type { SxProps } from '@/types'

interface GameDescriptionDisclosureProps {
  description?: string
}

const GameDescriptionDisclosure = ({ description }: GameDescriptionDisclosureProps) => (
  <details class="group flex flex-col">
    <summary class="order-2 cursor-pointer list-none text-left text-sm text-purple">
      <span class="group-open:hidden">more..</span>
      <span class="hidden group-open:inline">less</span>
    </summary>
    <p
      class="order-1 max-h-[42px] overflow-y-clip text-sm text-muted-foreground group-open:max-h-none"
      style={{ whiteSpace: 'pre-wrap' }}
    >
      {description}
    </p>
  </details>
)

type CardGameContentProps = {
  actions?: JSX.Element
  actionsInteractive?: boolean
  description?: string
  externalLink?: { title: string; src: string }
  isComingSoon?: boolean
  linked?: boolean
  overlay?: boolean
  onPlayOnDesktopClick?: JSX.EventHandler<HTMLButtonElement>
  onPlayOnWebClick?: JSX.EventHandler<HTMLButtonElement>
  required?: string
  showMore?: boolean
  title?: string
}

const CardGameContent = ({
  actions,
  actionsInteractive = false,
  description,
  externalLink,
  isComingSoon,
  linked = false,
  overlay = false,
  onPlayOnDesktopClick,
  onPlayOnWebClick,
  required,
  showMore,
  title,
}: CardGameContentProps) => {
  return (
    <div
      class={cx(
        'flex grow flex-col justify-between',
        overlay ? 'absolute inset-x-0 bottom-0 z-10 bg-black/65 backdrop-blur-[2px]' : 'bg-card'
      )}
    >
      <CardContent
        class={cx(
          overlay ? 'px-4 pb-3 pt-4 md:px-5 md:pb-4 md:pt-5' : 'p-6',
          overlay ? undefined : linked ? 'pb-6' : 'pb-0'
        )}
      >
        <div class="flex flex-row flex-wrap items-center justify-between gap-x-2 gap-y-2 md:flex-nowrap">
          <Title
            level={3}
            class={cx(
              'min-w-0 flex-1 text-xl font-normal font-subheader tracking-subheader',
              overlay && 'text-white'
            )}
          >
            {title}
          </Title>
          {externalLink ? (
            <a
              href={externalLink.src}
              target="_blank"
              rel="noreferrer"
              class={buttonVariants({ size: 'sm', className: 'shrink-0 px-3' })}
            >
              {externalLink.title} <ExternalIcon />
            </a>
          ) : null}
        </div>
        {isComingSoon && <p class="text-sm text-warning">Coming 2023</p>}
        {required && <p class="text-sm text-warning">{required}</p>}
        {showMore ? (
          <GameDescriptionDisclosure description={description} />
        ) : (
          <p
            class={cx(
              'text-sm text-muted-foreground',
              overlay ? 'truncate text-white/75' : undefined
            )}
            style={
              overlay
                ? { whiteSpace: 'nowrap' }
                : { whiteSpace: 'pre-wrap', maxHeight: 42, overflowY: 'clip' }
            }
          >
            {description}
          </p>
        )}
      </CardContent>
      {actions !== null && (
        <div
          class={cx(
            'flex items-center gap-2 px-6 pb-6',
            actionsInteractive && 'pointer-events-auto'
          )}
        >
          <div class="flex w-full flex-row flex-wrap gap-x-2 gap-y-4">
            {actions ?? (
              <>
                <button
                  type="button"
                  class={buttonVariants({
                    variant: 'default',
                    className: 'min-w-20 w-full flex-1',
                  })}
                  onClick={onPlayOnDesktopClick}
                >
                  Play on Desktop
                </button>
                <button
                  type="button"
                  class={buttonVariants({
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
      )}
    </div>
  )
}

interface GameCardProps {
  actions?: JSX.Element
  actionsInteractive?: boolean
  cardLinkLabel?: string
  autoHeight?: boolean
  contents?: JSX.Element
  description?: string
  externalLink?: { title: string; src: string }
  externalHref?: string
  hoverActionLabel?: string
  image?: string
  imageContent?: JSX.Element
  imageFetchPriority?: 'auto' | 'high' | 'low'
  imageLoading?: 'eager' | 'lazy'
  href?: string
  isComingSoon?: boolean
  overlayContent?: boolean
  onPlayOnDesktopClick?: JSX.EventHandler<HTMLButtonElement>
  onPlayOnWebClick?: JSX.EventHandler<HTMLButtonElement>
  prefetch?: boolean
  required?: string
  showMore?: boolean
  sx?: SxProps
  title?: string
}

const GameCard = (props: GameCardProps & { children?: JSX.Element }) => {
  const {
  actions,
  actionsInteractive = false,
  cardLinkLabel,
  autoHeight = false,
  contents,
  description,
  externalLink,
  externalHref,
  hoverActionLabel,
  image,
  imageContent,
  imageFetchPriority,
  imageLoading = 'lazy',
  href,
  isComingSoon,
  overlayContent = false,
  onPlayOnDesktopClick,
  onPlayOnWebClick,
  prefetch,
  required,
  showMore = false,
  sx,
  title,
} = props
  const resolvedImageFetchPriority =
    imageFetchPriority ?? (imageLoading === 'lazy' ? 'low' : undefined)
  const cardLink = href || externalHref
  const hasExternalCardLink = Boolean(externalHref)

  const card = (
    <Card
      class={cx(
        'flex w-full flex-col gap-0 overflow-hidden border py-0',
        cardLink &&
          'transition-[border-color,box-shadow] duration-200 hover:border-purple/70 hover:shadow-[0_18px_45px_-24px_rgb(124_58_237/0.9)] group-hover:border-purple/70 group-hover:shadow-[0_18px_45px_-24px_rgb(124_58_237/0.9)] group-focus-visible:border-purple group-focus-visible:ring-2 group-focus-visible:ring-purple/60',
        hasExternalCardLink && 'relative group',
        overlayContent ? 'relative aspect-[16/10]' : autoHeight ? 'h-auto' : 'h-full'
      )}
      style={sx as JSX.CSSProperties | undefined}
    >
      {externalHref && (
        <a
          href={externalHref}
          target="_blank"
          rel="noreferrer"
          aria-label={cardLinkLabel ?? `Open ${title ?? 'game'}`}
          class="absolute inset-0 z-0 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-purple/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <span class="sr-only">{cardLinkLabel ?? `Open ${title ?? 'game'}`}</span>
        </a>
      )}
      <div class={cx(hasExternalCardLink && 'relative z-10 pointer-events-none')}>
        <div
          class={cx('overflow-hidden', overlayContent ? 'absolute inset-0' : 'relative')}
          style={
            overlayContent
              ? undefined
              : {
                  width: '100%',
                  paddingTop: '56.25%' /* 16:9 Aspect Ratio */,
                }
          }
        >
          {imageContent ??
            (image && (
              <OptimizedImage
                src={image}
                alt={title || 'Game artwork'}
                fill
                sizes={GAME_CARD_IMAGE_SIZES}
                loading={imageLoading}
                fetchPriority={resolvedImageFetchPriority}
                class={cx(
                  'object-cover transition-transform duration-500',
                  cardLink && 'group-hover:scale-105 motion-reduce:transition-none'
                )}
              />
            ))}
          {cardLink && (
            <div
              class={cx(
                'pointer-events-none absolute inset-0 flex justify-end bg-gradient-to-t from-black/70 via-black/0 to-transparent p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none',
                overlayContent ? 'items-start' : 'items-end'
              )}
            >
              <span class="rounded-full bg-purple px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                {hoverActionLabel ?? (externalHref ? 'Open game' : 'Explore map')}{' '}
                <span aria-hidden="true">↗</span>
              </span>
            </div>
          )}
        </div>
        {contents || (
          <CardGameContent
            actions={href ? null : actions}
            actionsInteractive={actionsInteractive || hasExternalCardLink}
            description={description}
            externalLink={href ? undefined : externalLink}
            isComingSoon={isComingSoon}
            linked={Boolean(href)}
            overlay={overlayContent}
            onPlayOnDesktopClick={onPlayOnDesktopClick}
            onPlayOnWebClick={onPlayOnWebClick}
            required={required}
            showMore={showMore}
            title={title}
          />
        )}
      </div>
    </Card>
  )

  if (!href) return card

  return (
    <Link
      href={href}
      prefetch={prefetch}
      aria-label={title ? `Explore ${title}` : undefined}
      class="group block h-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-purple/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      {card}
    </Link>
  )
}

export default GameCard

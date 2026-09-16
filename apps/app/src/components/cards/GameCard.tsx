import { Show, type JSX } from 'solid-js'
import OptimizedImage from '@nl/ui/custom/optimized-image'
import { buttonVariants } from '@nl/ui/base/button-variants'
import { Card, CardContent } from '@nl/ui/base/card'
import { Title } from '@nl/ui/custom/typography'
import { ExternalIcon } from '@nl/ui/custom/external-icon'
import { GAME_CARD_IMAGE_SIZES } from '@nl/ui/image-sizes'
import { cx } from '@nl/ui/class-names'

import Link from '@/runtime/Link'

interface GameDescriptionDisclosureProps {
  description?: string
}

const GameDescriptionDisclosure = (props: GameDescriptionDisclosureProps) => (
  <details class="group flex flex-col">
    <summary class="order-2 cursor-pointer list-none text-left text-sm text-purple">
      <span class="group-open:hidden">more..</span>
      <span class="hidden group-open:inline">less</span>
    </summary>
    <p class="order-1 max-h-10.5 overflow-y-clip whitespace-pre-wrap text-sm text-muted-foreground group-open:max-h-none">
      {props.description}
    </p>
  </details>
)

type CardGameContentProps = {
  actions?: JSX.Element | null
  actionsInteractive?: boolean
  description?: string
  externalLink?: { title: string; src: string }
  isComingSoon?: boolean
  linked?: boolean
  overlay?: boolean
  onPlayOnDesktopClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>
  onPlayOnWebClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>
  required?: string
  showMore?: boolean
  title?: string
}

const CardGameContent = (props: CardGameContentProps) => {
  const actionsInteractive = () => props.actionsInteractive ?? false
  const linked = () => props.linked ?? false
  const overlay = () => props.overlay ?? false

  return (
    <div
      class={cx(
        'flex grow flex-col justify-between',
        overlay()
          ? 'absolute inset-x-0 bottom-0 z-10 bg-black/65 backdrop-blur-(--gc-blur)'
          : 'bg-card'
      )}
    >
      <CardContent
        class={cx(
          overlay() ? 'px-4 pb-3 pt-4 md:px-5 md:pb-4 md:pt-5' : 'p-6',
          overlay() ? undefined : linked() ? 'pb-6' : 'pb-0'
        )}
      >
        <div class="flex flex-row flex-wrap items-center justify-between gap-x-2 gap-y-2 md:flex-nowrap">
          <Title
            level={3}
            class={cx(
              'min-w-0 flex-1 text-xl font-normal font-subheader tracking-subheader',
              overlay() && 'text-white'
            )}
          >
            {props.title}
          </Title>
          <Show when={props.externalLink}>
            {(link) => (
              <a
                href={link().src}
                target="_blank"
                rel="noreferrer"
                class={buttonVariants({ size: 'sm', className: 'shrink-0 px-3' })}
              >
                {link().title} <ExternalIcon />
              </a>
            )}
          </Show>
        </div>
        <Show when={props.isComingSoon}>
          <p class="text-sm text-warning">Coming 2023</p>
        </Show>
        <Show when={props.required}>
          <p class="text-sm text-warning">{props.required}</p>
        </Show>
        <Show
          when={props.showMore}
          fallback={
            <p
              class={cx(
                'text-sm text-muted-foreground',
                overlay()
                  ? 'truncate text-white/75'
                  : 'whitespace-pre-wrap max-h-10.5 overflow-y-clip'
              )}
            >
              {props.description}
            </p>
          }
        >
          <GameDescriptionDisclosure description={props.description} />
        </Show>
      </CardContent>
      <Show when={props.actions !== null}>
        <div
          class={cx(
            'flex items-center gap-2 px-6 pb-6',
            actionsInteractive() && 'pointer-events-auto'
          )}
        >
          <div class="flex w-full flex-row flex-wrap gap-x-2 gap-y-4">
            {props.actions ?? (
              <>
                <button
                  type="button"
                  class={buttonVariants({
                    variant: 'default',
                    className: 'min-w-20 w-full flex-1',
                  })}
                  onClick={props.onPlayOnDesktopClick}
                >
                  Play on Desktop
                </button>
                <button
                  type="button"
                  class={buttonVariants({
                    variant: 'outline',
                    className: 'min-w-20 w-full flex-1',
                  })}
                  onClick={props.onPlayOnWebClick}
                >
                  Play on Web
                </button>
              </>
            )}
          </div>
        </div>
      </Show>
    </div>
  )
}

interface GameCardProps {
  actions?: JSX.Element | null
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
  onPlayOnDesktopClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>
  onPlayOnWebClick?: JSX.EventHandler<HTMLButtonElement, MouseEvent>
  required?: string
  showMore?: boolean
  title?: string
}

const GameCard = (props: GameCardProps & { children?: JSX.Element }) => {
  const autoHeight = () => props.autoHeight ?? false
  const imageLoading = () => props.imageLoading ?? 'lazy'
  const overlayContent = () => props.overlayContent ?? false
  const showMore = () => props.showMore ?? false
  const resolvedImageFetchPriority = () =>
    props.imageFetchPriority ?? (imageLoading() === 'lazy' ? 'low' : undefined)
  const cardLink = () => props.href || props.externalHref
  const hasExternalCardLink = () => Boolean(props.externalHref)

  const card = () => (
    <Card
      class={cx(
        'flex w-full flex-col gap-0 overflow-hidden border py-0',
        cardLink() &&
          'transition-(--gc-transition) duration-200 hover:border-purple/70 hover:shadow-(--game-card-shadow) group-hover:border-purple/70 group-hover:shadow-(--game-card-shadow) group-focus-visible:border-purple group-focus-visible:ring-2 group-focus-visible:ring-purple/60',
        hasExternalCardLink() && 'relative group',
        overlayContent() ? 'relative aspect-[16/10]' : autoHeight() ? 'h-auto' : 'h-full'
      )}
    >
      <Show when={props.externalHref}>
        {(href) => (
          <a
            href={href()}
            target="_blank"
            rel="noreferrer"
            aria-label={props.cardLinkLabel ?? `Open ${props.title ?? 'game'}`}
            class="absolute inset-0 z-0 rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-purple/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <span class="sr-only">{props.cardLinkLabel ?? `Open ${props.title ?? 'game'}`}</span>
          </a>
        )}
      </Show>
      <div class={cx(hasExternalCardLink() && 'relative z-10 pointer-events-none')}>
        <div
          class={cx(
            'overflow-hidden',
            overlayContent() ? 'absolute inset-0' : 'relative w-full pt-(--ratio-16-9)'
          )}
          style={overlayContent() ? undefined : { '--ratio-16-9': '56.25%' }}
        >
          {props.imageContent ?? (
            <Show when={props.image}>
              {(image) => (
                <OptimizedImage
                  src={image()}
                  alt={props.title || 'Game artwork'}
                  fill
                  sizes={GAME_CARD_IMAGE_SIZES}
                  loading={imageLoading()}
                  fetchpriority={resolvedImageFetchPriority()}
                  class={cx(
                    'object-cover transition-transform duration-500',
                    cardLink() && 'group-hover:scale-105 motion-reduce:transition-none'
                  )}
                />
              )}
            </Show>
          )}
          <Show when={cardLink()}>
            <div
              class={cx(
                'pointer-events-none absolute inset-0 flex justify-end bg-gradient-to-t from-black/70 via-black/0 to-transparent p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none',
                overlayContent() ? 'items-start' : 'items-end'
              )}
            >
              <span class="rounded-full bg-purple px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                {props.hoverActionLabel ?? (props.externalHref ? 'Open game' : 'Explore map')}{' '}
                <span aria-hidden="true">↗</span>
              </span>
            </div>
          </Show>
        </div>
        {props.contents || (
          <CardGameContent
            actions={props.href ? null : props.actions}
            actionsInteractive={props.actionsInteractive || hasExternalCardLink()}
            description={props.description}
            externalLink={props.href ? undefined : props.externalLink}
            isComingSoon={props.isComingSoon}
            linked={Boolean(props.href)}
            overlay={overlayContent()}
            onPlayOnDesktopClick={props.onPlayOnDesktopClick}
            onPlayOnWebClick={props.onPlayOnWebClick}
            required={props.required}
            showMore={showMore()}
            title={props.title}
          />
        )}
      </div>
    </Card>
  )

  return (
    <Show when={props.href} fallback={card()} keyed>
      {(href) => (
        <Link
          href={href}
          aria-label={props.title ? `Explore ${props.title}` : undefined}
          class="group block h-full rounded-md outline-none focus-visible:ring-2 focus-visible:ring-purple/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {card()}
        </Link>
      )}
    </Show>
  )
}

export default GameCard

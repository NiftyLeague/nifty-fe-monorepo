import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@nl/ui/base/button'
import { Card, CardContent } from '@nl/ui/base/card'
import { Title } from '@nl/ui/custom/typography'
import { ExternalIcon } from '@nl/ui/custom/external-icon'
import { cn } from '@nl/ui/utils'
import ExpandableGameDescription from './ExpandableGameDescription'
import type { SxProps, Theme } from '@/types'

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
        <div className="flex flex-row justify-between">
          <Title level={4}>{title}</Title>
          {externalLink ? (
            <Link href={externalLink.src} target="_blank" rel="noreferrer">
              <Button variant="default" className="-mt-2 w-full">
                {externalLink.title} <ExternalIcon />
              </Button>
            </Link>
          ) : null}
        </div>
        {isComingSoon && <p className="text-sm text-warning">Coming 2023</p>}
        {required && <p className="text-sm text-warning">{required}</p>}
        {showMore ? (
          <ExpandableGameDescription description={description} />
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
              <Button
                variant="default"
                className="min-w-20 w-full flex-1"
                onClick={onPlayOnDesktopClick}
              >
                Play on Desktop
              </Button>
              <Button
                variant="outline"
                className="min-w-20 w-full flex-1"
                onClick={onPlayOnWebClick}
              >
                Play on Web
              </Button>
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
        {image && (
          <Image
            src={image}
            alt={title || 'Game artwork'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            loading="lazy"
            className="object-cover"
          />
        )}
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

import { GAME_CARD_IMAGE_SIZES } from '@nl/ui/image-sizes'
import NativeImage from '@nl/ui/custom/native-image'
import OptimizedImage from '@nl/ui/custom/optimized-image'
import GameCard from '@/components/cards/GameCard'

import styles from '../grid-item.module.css'

const AppleBadge = ({ disabled = false }) => (
  <NativeImage
    src="/img/badges/apple-store-badge.svg"
    alt="Apple Store Badge"
    width={120}
    height={40}
    style={{
      width: '91%',
      'max-width': '100%',
      height: 'auto',
      display: 'flex',
      margin: 'auto',
      opacity: disabled ? 0.25 : 1,
    }}
  />
)

const GoogleBadge = ({ disabled = false }) => (
  <NativeImage
    src="/img/badges/google-play-badge.webp"
    alt="Get it on Google Play"
    width={564}
    height={169}
    style={{ width: '100%', 'max-width': '100%', height: 'auto', opacity: disabled ? 0.25 : 1 }}
  />
)

const SteamBadge = ({ disabled = false }) => (
  <NativeImage
    src="/img/badges/steam-badge.webp"
    alt="Steam Store Badge"
    width={564}
    height={168}
    style={{ width: '100%', 'max-width': '100%', height: 'auto', opacity: disabled ? 0.25 : 1 }}
  />
)

const GameArtwork = ({
  src,
  title,
  loading = 'lazy',
  fetchPriority,
}: {
  src: string
  title: string
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'auto' | 'high' | 'low'
}) => (
  <OptimizedImage
    src={src}
    alt={title}
    fill
    sizes={GAME_CARD_IMAGE_SIZES}
    quality={60}
    loading={loading}
    fetchpriority={fetchPriority}
    class="object-cover"
  />
)

type StoreButtonsProps = { android?: string; ios?: string; steam?: string }

const StoreButtons = ({ android, ios, steam }: StoreButtonsProps) => (
  <div class="grid grid-cols-12 gap-4" style={{ width: '100%' }}>
    <div class="col-span-4">
      {android ? (
        <a href={android} target="_blank" rel="noreferrer">
          <GoogleBadge />
        </a>
      ) : (
        <GoogleBadge disabled />
      )}
    </div>
    <div class="col-span-4">
      {ios ? (
        <a href={ios} target="_blank" rel="noreferrer">
          <AppleBadge />
        </a>
      ) : (
        <AppleBadge disabled />
      )}
    </div>
    <div class="col-span-4">
      {steam ? (
        <a href={steam} target="_blank" rel="noreferrer">
          <SteamBadge />
        </a>
      ) : (
        <SteamBadge disabled />
      )}
    </div>
  </div>
)

const FlagshipGameList = () => (
  <>
    <div class={`${styles.gridItem} col-span-12 md:col-span-6 xl:col-span-4`}>
      <GameCard
        title="Nifty Smashers (Beta)"
        externalHref="https://niftysmashers.com/"
        cardLinkLabel="Open Nifty Smashers"
        required="3D Party Platform Fighter"
        description="Free-to-play 3D party platform fighter with full cross-play."
        imageContent={
          <GameArtwork
            src="/img/games/smashers/smashers-poster.jpg"
            title="Nifty Smashers (Beta)"
            loading="eager"
            fetchPriority="high"
          />
        }
        autoHeight={false}
        actions={
          <StoreButtons
            android="https://niftysmashers.com/android"
            ios="https://niftysmashers.com/ios"
            steam="https://niftysmashers.com/steam"
          />
        }
      />
    </div>
    <div class={`${styles.gridItem} col-span-12 md:col-span-6 xl:col-span-4`}>
      <GameCard
        title="Party Royale (Early-Alpha)"
        externalHref="https://testflight.apple.com/join/VXxbaZrw"
        cardLinkLabel="Open Party Royale"
        required="Party Battle Royale"
        description="Playtest NiftyWorld's early-alpha party battle royale."
        imageContent={
          <GameArtwork
            src="/img/games/nifty-royale/nifty-royale-poster.jpg"
            title="Party Royale (Early-Alpha)"
          />
        }
        autoHeight={false}
        actions={<StoreButtons ios="https://testflight.apple.com/join/VXxbaZrw" />}
      />
    </div>
    <div class={`${styles.gridItem} col-span-12 md:col-span-6 xl:col-span-4`}>
      <GameCard
        title="Smashers Origins (Beta)"
        externalHref="https://store.steampowered.com/app/4297830/Nifty_Smashers_Origins/"
        cardLinkLabel="Open Smashers Origins"
        required="OG 2D Platform Fighter"
        description="The original 2D Nifty Smashers browser game."
        image="/img/games/smashers/nifty-smashers-poster.webp"
        autoHeight={false}
        actions={
          <StoreButtons steam="https://store.steampowered.com/app/4297830/Nifty_Smashers_Origins/" />
        }
      />
    </div>
  </>
)

export default FlagshipGameList

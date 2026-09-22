import { GAME_CARD_IMAGE_SIZES } from '@nl/ui/image-sizes'
import NativeImage from '@nl/ui/custom/native-image'
import OptimizedImage from '@nl/ui/custom/optimized-image'
import GameCard from '@/components/cards/GameCard'

import styles from '../grid-item.module.css'

const AppleBadge = () => (
  <NativeImage
    src="https://cdn.niftyleague.com/media/img/badges/apple-store-badge.svg"
    alt="Apple Store Badge"
    width={120}
    height={40}
    class="flex mx-auto w-91/100 max-w-full h-auto"
  />
)

const GoogleBadge = () => (
  <NativeImage
    src="https://cdn.niftyleague.com/media/img/badges/google-play-badge.webp"
    alt="Get it on Google Play"
    width={564}
    height={169}
    class="w-full max-w-full h-auto"
  />
)

const SteamBadge = () => (
  <NativeImage
    src="https://cdn.niftyleague.com/media/img/badges/steam-badge.webp"
    alt="Steam Store Badge"
    width={564}
    height={168}
    class="w-full max-w-full h-auto"
  />
)

const GameArtwork = (props: {
  src: string
  title: string
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'auto' | 'high' | 'low'
}) => (
  <OptimizedImage
    src={props.src}
    alt={props.title}
    fill
    sizes={GAME_CARD_IMAGE_SIZES}
    quality={60}
    loading={props.loading ?? 'lazy'}
    fetchpriority={props.fetchPriority}
    class="object-cover"
  />
)

type StoreButtonsProps = { android?: string; ios?: string; steam?: string }

const StoreButtons = (props: StoreButtonsProps) => (
  <div class="grid w-full grid-cols-12 gap-4">
    <div class="col-span-4">
      {props.android ? (
        <a href={props.android} target="_blank" rel="noopener noreferrer">
          <GoogleBadge />
        </a>
      ) : (
        <div class="opacity-25">
          <GoogleBadge />
        </div>
      )}
    </div>
    <div class="col-span-4">
      {props.ios ? (
        <a href={props.ios} target="_blank" rel="noopener noreferrer">
          <AppleBadge />
        </a>
      ) : (
        <div class="opacity-25">
          <AppleBadge />
        </div>
      )}
    </div>
    <div class="col-span-4">
      {props.steam ? (
        <a href={props.steam} target="_blank" rel="noopener noreferrer">
          <SteamBadge />
        </a>
      ) : (
        <div class="opacity-25">
          <SteamBadge />
        </div>
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
            src="https://cdn.niftyleague.com/media/img/games/smashers/smashers-poster.jpg"
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
            src="https://cdn.niftyleague.com/media/img/games/nifty-royale/nifty-royale-poster.jpg"
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
        image="https://cdn.niftyleague.com/media/img/games/smashers/nifty-smashers-poster.webp"
        autoHeight={false}
        actions={
          <StoreButtons steam="https://store.steampowered.com/app/4297830/Nifty_Smashers_Origins/" />
        }
      />
    </div>
  </>
)

export default FlagshipGameList

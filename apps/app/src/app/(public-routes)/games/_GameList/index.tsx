import Link from 'next/link'
import Image from 'next/image'
import GameCard from '@/components/cards/GameCard'

import styles from './grid-item.module.css'

const AppleBadge = ({ disabled = false }) => (
  <Image
    src="/img/badges/apple-store-badge.svg"
    alt="Apple Store Badge"
    width={120}
    height={40}
    style={{
      width: '91%',
      maxWidth: '100%',
      height: 'auto',
      display: 'flex',
      margin: 'auto',
      opacity: disabled ? 0.25 : 1,
    }}
  />
)

const GoogleBadge = ({ disabled = false }) => (
  <Image
    src="/img/badges/google-play-badge.webp"
    alt="Get it on Google Play"
    width={564}
    height={169}
    style={{ width: '100%', maxWidth: '100%', height: 'auto', opacity: disabled ? 0.25 : 1 }}
  />
)

const SteamBadge = ({ disabled = false }) => (
  <Image
    src="/img/badges/steam-badge.webp"
    alt="Steam Store Badge"
    width={564}
    height={168}
    style={{ width: '100%', maxWidth: '100%', height: 'auto', opacity: disabled ? 0.25 : 1 }}
  />
)

type StoreButtonsProps = { android?: string; ios?: string; steam?: string }

const StoreButtons = ({ android, ios, steam }: StoreButtonsProps) => (
  <div className="grid grid-cols-12 gap-4" style={{ width: '100%' }}>
    <div className="col-span-4">
      {android ? (
        <Link href={android} target="_blank" rel="noreferrer">
          <GoogleBadge />
        </Link>
      ) : (
        <GoogleBadge disabled />
      )}
    </div>
    <div className="col-span-4">
      {ios ? (
        <Link href={ios} target="_blank" rel="noreferrer">
          <AppleBadge />
        </Link>
      ) : (
        <AppleBadge disabled />
      )}
    </div>
    <div className="col-span-4">
      {steam ? (
        <Link href={steam} target="_blank" rel="noreferrer">
          <SteamBadge />
        </Link>
      ) : (
        <SteamBadge disabled />
      )}
    </div>
  </div>
)

const F2PGameList = () => (
  <>
    <div className={`${styles.gridItem} col-span-12 md:col-span-6 xl:col-span-4`}>
      <GameCard
        title="Nifty Smashers (Beta)"
        required="Party Platform Fighter"
        description="Our flagship game - free-to-play, online multiplayer, PARTY platform fighter. Play on iOS, Android, and Steam with full cross-play support!"
        image="/img/games/smashers/smashers.gif"
        onlineCounter={200}
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
    <div className={`${styles.gridItem} col-span-12 md:col-span-6 xl:col-span-4`}>
      <GameCard
        title="Party Royale (Early-Alpha)"
        required="Party Battle Royale"
        description="Step into NiftyWorld - our next hit game is ready to playtest! This game is still in early development so bugs are expected!"
        image="/img/games/nifty-royale/nifty-royale.gif"
        onlineCounter={200}
        autoHeight={false}
        actions={<StoreButtons ios="https://testflight.apple.com/join/VXxbaZrw" />}
      />
    </div>
  </>
)

export default F2PGameList

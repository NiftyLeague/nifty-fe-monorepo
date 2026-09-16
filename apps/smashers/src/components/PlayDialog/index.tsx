import { Dialog } from '@nl/ui/custom/dialog'
import NativeImage from '@nl/ui/custom/native-image'
import { Text } from '@nl/ui/custom/typography'
import useVersion from '@/hooks/useVersion'

const PlayContent = () => (
  <>
    <Text>
      This party platform fighter will have you on the edge of your seat as you and three other
      players grab your bats, unleash unique abilities, and smash each other out of the arena in a
      winner-takes-all battle!
    </Text>
    <div class="grid grid-cols-3 gap-2 items-center">
      <a
        href="/android/&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
        target="_blank"
        rel="noreferrer"
        class="w-full justify-items-center hover:scale-102 transition-transform duration-200"
      >
        <NativeImage
          src="/img/badges/google-play-badge.webp"
          alt="Get it on Google Play"
          width={234}
          height={70}
          priority
          class="h-auto w-full max-w-full"
        />
      </a>
      <a
        href="/ios"
        target="_blank"
        rel="noreferrer"
        class="w-full justify-items-center hover:scale-102 transition-transform duration-200"
      >
        <NativeImage
          src="/img/badges/apple-store-badge.svg"
          alt="Apple Store Badge"
          width={215}
          height={72}
          priority
          class="h-auto w-(--apple-badge-w) max-w-full"
          style={{ '--apple-badge-w': '92%' }}
        />
      </a>
      <a
        href="/steam"
        target="_blank"
        rel="noreferrer"
        class="w-full justify-items-center hover:scale-102 transition-transform duration-200"
      >
        <NativeImage
          src="/img/badges/steam-badge.webp"
          alt="Steam Store Badge"
          width={234}
          height={69}
          priority
          class="h-auto w-full max-w-full"
        />
      </a>
    </div>
  </>
)

const PlayDialog = (props: { open?: boolean; onOpenChange?: (open: boolean) => void }) => {
  const { message } = useVersion()
  return (
    <Dialog
      // Controlled, not `defaultOpen`: the group drives `open`, and an
      // uncontrolled dialog ignores the prop after mount, leaving the group's
      // state desynced after the first close. Keep `open` read through props:
      // destructuring freezes the deferred mount-time value and blocks closes.
      open={props.open}
      onOpenChange={props.onOpenChange}
      title="Let's Brawl!"
      description={message}
      triggerElement={
        <button id="play-dialog-trigger">
          <NativeImage
            src="/icons/controller.svg"
            alt="Game Icon"
            width={22}
            height={22}
            class="h-auto max-w-full"
          />
          Play
        </button>
      }
    >
      <PlayContent />
    </Dialog>
  )
}

export default PlayDialog

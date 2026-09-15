import { createEffect, createSignal, onCleanup, onMount } from 'solid-js'
import { Dialog } from '@nl/ui/custom/dialog'
import NativeImage from '@nl/ui/custom/native-image'

const TrailerContent = () => {
  const [isLoaded, setIsLoaded] = createSignal(false)
  let modalIframe: HTMLIFrameElement | undefined

  // Handle YouTube API messages
  onMount(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return
      try {
        const data = JSON.parse(event.data)
        if (data.event === 'onReady') {
          setIsLoaded(true)
        }
      } catch {
        // Ignore parsing errors from other messages
      }
    }

    window.addEventListener('message', handleMessage)
    onCleanup(() => window.removeEventListener('message', handleMessage))
  })

  // Handle video playback
  createEffect(() => {
    if (!modalIframe?.contentWindow) return

    try {
      const message = isLoaded()
        ? '{"event":"command","func":"playVideo","args":""}'
        : '{"event":"command","func":"pauseVideo","args":""}'
      modalIframe.contentWindow.postMessage(message, 'https://www.youtube.com')
    } catch (e) {
      console.error('Failed to control video:', e)
    }
  })

  return (
    <iframe
      ref={(el: HTMLIFrameElement) => (modalIframe = el)}
      id="trailer-modal-iframe"
      title="Nifty Smashers - Trailer"
      class="-m-6 mt-0 aspect-video w-[calc(100%+3rem)] border-0"
      src="https://www.youtube.com/embed/4lnDrx4aDq8?enablejsapi=1&html5=1&autoplay=1&playsinline=1&rel=0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      loading="eager"
    />
  )
}

const TrailerDialog = (props: { open?: boolean; onOpenChange?: (open: boolean) => void }) => (
  <Dialog
    open={props.open}
    onOpenChange={props.onOpenChange}
    title="Nifty Smashers - Trailer"
    description="3D free-to-play platform fighter"
    hideDescription
    hideTitle
    triggerElement={
      <button>
        <NativeImage
          src="/icons/socials/youtube.svg"
          alt="YouTube Logo"
          width={22}
          height={22}
          style={{ 'max-width': '100%', height: 'auto' }}
        />
        Trailer
      </button>
    }
  >
    <TrailerContent />
  </Dialog>
)

export default TrailerDialog

import { createSignal, onCleanup, onMount } from 'solid-js'
// Prefer the ESM build so the bundler can analyze the optional 3D graph instead
// of treating the prebundled UMD entry as opaque.
import '@google/model-viewer/dist/model-viewer-module.min.js'
import { CircularProgress } from '@nl/ui/custom/circular-progress'

import { DEGEN_3D_MODEL_URL } from '@/constants/degen-assets'
import { SRC } from '@/types/gltf'
import styles from '../gltf.module.css'

export default function ModelView(props: { source: SRC; tokenId: string }) {
  let modelViewerEl: HTMLElement | undefined
  const [loading, setLoading] = createSignal(true)
  const MODEL_SRC = () => `${DEGEN_3D_MODEL_URL}/${props.tokenId}.glb`

  const handleProgress = (event: Event) => {
    const progress = (event as CustomEvent<{ totalProgress?: number }>).detail?.totalProgress || 0
    if (progress === 1) setLoading(false)
  }

  // Solid does not reflect custom-element properties to attributes before
  // model-viewer upgrades. Set the source after the element is mounted so the
  // viewer starts loading the selected model in every browser.
  onMount(() => {
    const model = modelViewerEl
    if (!model) return
    model.setAttribute('src', MODEL_SRC())
    model.addEventListener('progress', handleProgress, { passive: true })
    onCleanup(() => model.removeEventListener('progress', handleProgress))
  })

  return (
    <div class={styles.model__wrapper}>
      {props.source === SRC.MODEL && loading() ? (
        <div class="absolute z-2 flex min-h-screen w-full">
          <CircularProgress size={75} color="light" class="m-auto" />
        </div>
      ) : null}
      <model-viewer
        ref={(el: HTMLElement) => (modelViewerEl = el)}
        // https://modelviewer.dev/docs/index.html#loading-attributes
        id="model-viewer"
        alt="Nifty League DEGEN 3D model"
        class={props.source === SRC.MODEL ? 'min-h-screen w-full' : 'hidden'}
        src={MODEL_SRC()}
        loading="lazy"
        exposure="0.72"
        shadow-intensity="1"
        shadow-softness="0.8"
        camera-controls="true"
        touch-action="pan-y"
        auto-rotate="true"
        auto-rotate-delay="1000"
        interaction-prompt="auto"
        interaction-prompt-threshold="10000"
        disable-tap="true"
      />
    </div>
  )
}

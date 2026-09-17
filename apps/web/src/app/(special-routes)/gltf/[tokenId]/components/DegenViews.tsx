import { Show, createEffect, createSignal, type JSX } from 'solid-js'

import { cx } from '@nl/ui/class-names'
import { ToggleGroup, ToggleGroupItem } from '@nl/ui/base/toggle-group'
import { CircularProgress } from '@nl/ui/custom/circular-progress'
import useDeferredComponent from '@nl/ui/hooks/useDeferredComponent'
import TokenMenuBoundary from './TokenMenuBoundary'
import { SRC, type Color } from '@/types/gltf'

import styles from '../gltf.module.css'

const loadModelView = () => import('./ModelView')
const loadModelActions = () => import('./ModelActions')

export interface DegenViewsProps {
  tokenId: string
  initialImage?: JSX.Element
  spriteImage?: JSX.Element
  logo?: JSX.Element
}

const GRADIENTS: Record<string, string> = {
  salmon: styles.gradient_salmon,
  purple: styles.gradient_purple,
  blue: styles.gradient_blue,
  bluegrey: styles.gradient_bluegrey,
  bluepurple: styles.gradient_bluepurple,
  green: styles.gradient_green,
  bluegreen: styles.gradient_bluegreen,
  brown: styles.gradient_brown,
  ochre: styles.gradient_ochre,
  palepink: styles.gradient_palepink,
  yellow: styles.gradient_yellow,
  greenish: styles.gradient_greenish,
  lightblue: styles.gradient_lightblue,
  ochretwo: styles.gradient_ochretwo,
}

export default function DegenViews(props: DegenViewsProps) {
  const [source, setSource] = createSignal<SRC>(SRC.IMAGE)
  const [color, setColor] = createSignal<Color>('purple')
  const tokenNumber = Number(props.tokenId)
  // The static poster doubles as the 2D view; keep it mounted so toggling back
  // does not refetch it, but hide it while the 3D model is active.
  createEffect(() => {
    document
      .querySelector('[data-gltf-poster]')
      ?.parentElement?.toggleAttribute('hidden', source() === SRC.MODEL)
  })
  const { Component: ModelView } = useDeferredComponent(loadModelView, () => source() === SRC.MODEL)
  const { Component: ModelActions } = useDeferredComponent(
    loadModelActions,
    () => source() === SRC.MODEL
  )

  return (
    <main
      class={cx(
        styles.main__wrapper,
        source() === SRC.IMAGE && styles.image__surface,
        source() === SRC.MODEL && GRADIENTS[color()]
      )}
    >
      <Show when={source() === SRC.IMAGE}>{props.initialImage}</Show>
      <Show when={source() === SRC.SPRITE}>{props.spriteImage}</Show>
      <Show when={source() === SRC.MODEL} fallback={null}>
        <Show
          when={ModelView()}
          fallback={
            <div class={styles.model__wrapper} role="status" aria-live="polite">
              <CircularProgress size={75} color="light" class="m-auto" />
              <span class="sr-only">Loading 3D viewer…</span>
            </div>
          }
        >
          {(View) => {
            const ModelViewComponent = View()
            return <ModelViewComponent source={source()} tokenId={props.tokenId} />
          }}
        </Show>
      </Show>
      <Show when={tokenNumber < 9999}>
        <div class={styles.menu__overlay}>
          <ToggleGroup
            type="single"
            variant="outline"
            value={source()}
            onValueChange={(value: string | string[] | null) => {
              if (typeof value === 'string' && value) setSource(value as SRC)
            }}
            class={styles.menu__overlay__toggle}
          >
            <ToggleGroupItem value={SRC.IMAGE} aria-label="Toggle 2D">
              2D
            </ToggleGroupItem>
            <ToggleGroupItem value={SRC.MODEL} aria-label="Toggle 3D">
              3D
            </ToggleGroupItem>
            <Show when={tokenNumber < 9901}>
              <ToggleGroupItem value={SRC.SPRITE} aria-label="Toggle Sprite" class="px-5">
                SPRITE
              </ToggleGroupItem>
            </Show>
          </ToggleGroup>
          <Show when={source() === SRC.MODEL && ModelActions()}>
            {(Actions) => {
              const ModelActionsComponent = Actions()
              return <ModelActionsComponent color={color()} setColor={setColor} />
            }}
          </Show>
        </div>
      </Show>
      <Show
        when={source() === SRC.IMAGE}
        fallback={<div class={styles.menu__logo}>{props.logo}</div>}
      >
        <TokenMenuBoundary tokenId={props.tokenId} />
      </Show>
    </main>
  )
}

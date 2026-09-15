import { splitProps, type ComponentProps, type ValidComponent } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { useParallax } from '@nl/ui/hooks/useParallax'
import type { ParallaxDirection, ParallaxIntensity } from '@nl/ui/hooks/useParallax'

export interface ParallaxWrapperProps extends ComponentProps<'div'> {
  parallaxDirection?: ParallaxDirection
  parallaxIntensity?: ParallaxIntensity
  component?: ValidComponent
}

export function ParallaxWrapper(props: ParallaxWrapperProps) {
  const [local, others] = splitProps(props, [
    'children',
    'parallaxDirection',
    'parallaxIntensity',
    'component',
  ])
  let ref: HTMLElement | undefined

  useParallax(() => ref, {
    enabled: true,
    direction: local.parallaxDirection ?? 'left',
    intensity: local.parallaxIntensity ?? 'normal',
  })

  return (
    <Dynamic component={local.component ?? 'div'} ref={(el: HTMLElement) => (ref = el)} {...others}>
      {local.children}
    </Dynamic>
  )
}

export default ParallaxWrapper

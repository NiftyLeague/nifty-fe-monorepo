import { For } from 'solid-js'

import { cx } from '@nl/ui/class-names'
import OptimizedImage from '@nl/ui/custom/optimized-image'
import { SOCIAL_LINKS } from './constants'

export const linkClass = 'font-medium text-foreground'
export const animateClass =
  'transition duration-200 ease-in-out hover:-translate-y-0.5 hover:scale-102 hover:opacity-70'

interface SocialsFooterProps {
  children?: import('solid-js').JSX.Element
  classes?: { footer?: string }
}

export function SocialsFooter(props: SocialsFooterProps) {
  return (
    <footer class={cx('deferred-footer my-10 px-5', props.classes?.footer)}>
      {props.children}
      <div class="flex flex-col gap-6">
        <div class="flex items-center justify-center gap-6">
          <a
            class={cx(linkClass, animateClass)}
            href="https://niftyleague.com/terms-of-service"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms
          </a>
          <a
            class={cx(linkClass, animateClass)}
            href="https://niftyleague.com/disclaimer"
            target="_blank"
            rel="noopener noreferrer"
          >
            Disclaimer
          </a>
          <a
            class={cx(linkClass, animateClass)}
            href="https://niftyleague.com/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </div>

        <div class="flex items-center justify-center gap-5 sm:gap-6">
          <For each={SOCIAL_LINKS}>
            {(social) => (
              <a href={social.link} target="_blank" rel="noopener noreferrer" class={animateClass}>
                <OptimizedImage
                  src={social.image}
                  width={20}
                  height={20}
                  alt={social.description}
                  class="w-5 h-5"
                />
              </a>
            )}
          </For>
        </div>
      </div>
    </footer>
  )
}

export default SocialsFooter

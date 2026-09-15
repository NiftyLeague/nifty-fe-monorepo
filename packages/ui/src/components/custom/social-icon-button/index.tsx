import { Loader } from 'lucide-solid'
import { Dynamic } from 'solid-js/web'

import { cn } from '@nl/ui/utils'
import { Button } from '@nl/ui/base/button'

import * as SocialIcons from './social-icons'
import buttonStyles from './socials.module.css'

interface ButtonProps {
  disabled?: boolean
  label?: string
  loading?: boolean
  onClick?: () => void
  provider: keyof typeof SocialIcons
  withColor?: boolean
}

export function SocialIconButton(props: ButtonProps) {
  return (
    <Button
      variant="outline"
      type="button"
      class={cn(
        'w-full cursor-pointer disabled:cursor-progress',
        props.withColor && buttonStyles[props.provider]
      )}
      disabled={props.disabled ?? false}
      onClick={props.onClick}
    >
      {props.loading ? (
        <Loader
          absoluteStrokeWidth
          class="animate-spin motion-reduce:animate-none"
          size={20}
          strokeWidth={1.5}
        />
      ) : (
        <Dynamic component={SocialIcons[props.provider]} />
      )}
      {props.label ?? ''}
      <span class="sr-only">{props.provider}</span>
    </Button>
  )
}

export default SocialIconButton

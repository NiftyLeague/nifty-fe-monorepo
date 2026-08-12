'use client'

import { Loader } from 'lucide-react'

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

export function SocialIconButton({
  disabled = false,
  label = '',
  loading = false,
  onClick,
  provider,
  withColor = false,
}: ButtonProps) {
  const AuthIcon = SocialIcons[provider]

  return (
    <Button
      key={provider}
      variant="outline"
      type="button"
      className={cn(
        'w-full cursor-pointer disabled:cursor-progress',
        withColor && buttonStyles[provider]
      )}
      disabled={disabled}
      onClick={onClick}
    >
      {loading ? (
        <Loader absoluteStrokeWidth className="animate-spin" size={20} strokeWidth={1.5} />
      ) : (
        <AuthIcon />
      )}
      {label && label}
      <span className="sr-only">{provider}</span>
    </Button>
  )
}

export default SocialIconButton

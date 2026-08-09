import { ReactNode } from 'react'

import { Avatar as BaseAvatar, AvatarImage, AvatarFallback } from '@nl/ui/base/avatar'
import type { LinkTarget } from '@/types'

// ==============================|| AVATAR ||============================== //

interface avatarProps {
  alt?: string
  src?: string
  className?: string
  color?: string
  target?: LinkTarget
  href?: string
  style?: React.CSSProperties
  children?: ReactNode
  outline?: boolean
  size?: 'badge' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const sizeClass: Record<string, string> = {
  badge: 'size-7', // 28px = spacing(3.5)
  xs: 'size-[34px]', // 34px = spacing(4.25)
  sm: 'size-10', // 40px = spacing(5)
  md: 'size-[60px]', // 60px = spacing(7.5)
  lg: 'size-[72px]', // 72px = spacing(9)
  xl: 'size-[82px]', // 82px = spacing(10.25)
}

const Avatar = ({ className, color, outline, size, style, ...others }: avatarProps) => {
  const colorStyle: React.CSSProperties | undefined =
    color && !outline
      ? { color: `var(--color-${color}-foreground)`, backgroundColor: `var(--color-${color})` }
      : undefined
  const outlineStyle: React.CSSProperties | undefined =
    outline && color
      ? {
          color: `var(--color-${color})`,
          backgroundColor: 'var(--color-muted)',
          border: '2px solid',
          borderColor: `var(--color-${color})`,
        }
      : outline
        ? {
            color: 'var(--color-purple)',
            backgroundColor: 'var(--color-muted)',
            border: '2px solid',
            borderColor: 'var(--color-purple)',
          }
        : undefined

  return (
    <BaseAvatar
      className={`${size ? sizeClass[size] : ''} ${className || ''}`}
      style={{ ...colorStyle, ...outlineStyle, ...style }}
      {...others}
    >
      {others.src ? (
        <AvatarImage src={others.src} alt={others.alt || ''} />
      ) : (
        <AvatarFallback>{others.children}</AvatarFallback>
      )}
    </BaseAvatar>
  )
}

export default Avatar

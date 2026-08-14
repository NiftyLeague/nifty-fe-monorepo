import type { HTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@nl/ui/utils'
import styles from './app-bar.module.css'

export type AppBarProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>

export function AppBar({ children, className, ...props }: AppBarProps) {
  return (
    <div
      data-slot="app-bar"
      data-layout="responsive"
      className={cn(
        styles.appBar,
        'box-border flex min-h-14 w-full items-center px-4 py-2 lg:h-[60px] lg:min-h-0 lg:px-6 lg:py-0',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export default AppBar

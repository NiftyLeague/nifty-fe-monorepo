import type { HTMLAttributes, PropsWithChildren } from 'react'

import { cn } from '@nl/ui/utils'
import styles from './app-bar.module.css'

export type AppBarProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>

export function AppBar({ children, className, ...props }: AppBarProps) {
  return (
    <div
      data-slot="app-bar"
      data-layout="responsive"
      className={cn(styles.appBar, className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default AppBar

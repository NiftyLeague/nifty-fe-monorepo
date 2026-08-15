import type { HTMLAttributes, PropsWithChildren } from 'react'

import { cx } from '@nl/ui/class-names'
import styles from './app-bar.module.css'

export type AppBarProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>

export function AppBar({ children, className, ...props }: AppBarProps) {
  return (
    <div
      data-slot="app-bar"
      data-layout="responsive"
      className={cx(styles.appBar, className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default AppBar

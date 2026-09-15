import { splitProps, type ComponentProps } from 'solid-js'

import { cx } from '@nl/ui/class-names'
import styles from './app-bar.module.css'

export type AppBarProps = ComponentProps<'div'> & { className?: string }

export function AppBar(props: AppBarProps) {
  const [local, others] = splitProps(props, ['class', 'className'])
  return (
    <div
      data-slot="app-bar"
      data-layout="responsive"
      class={cx(styles.appBar, local.class, local.className)}
      {...others}
    />
  )
}

export default AppBar

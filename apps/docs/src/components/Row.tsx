import { ComponentProps } from 'react'

import styles from './Row.module.css'

const cx = (...classNames: Array<string | undefined | null | false>) =>
  classNames.filter(Boolean).join(' ')

type RowProps = ComponentProps<'div'>

const Row: React.FC<RowProps> = ({ className, ...props }) => (
  <div className={cx(styles.row, className)} {...props} />
)

export const RowTwo: React.FC<RowProps> = ({ className, ...props }) => (
  <div className={cx(styles.row, styles.rowTwo, className)} {...props} />
)

export const RowThree: React.FC<RowProps> = ({ className, ...props }) => (
  <div className={cx(styles.row, styles.rowThree, className)} {...props} />
)

export default Row

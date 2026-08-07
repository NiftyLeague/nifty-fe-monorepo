import { ComponentProps } from 'react'

import styles from './Card.module.css'

const cx = (...classNames: Array<string | undefined | null | false>) =>
  classNames.filter(Boolean).join(' ')

type CardProps = ComponentProps<'div'>

const Card: React.FC<CardProps> = ({ className, ...props }) => (
  <div className={cx(styles.card, className)} {...props} />
)

export const CenterCard: React.FC<CardProps> = ({ className, ...props }) => (
  <div className={cx(styles.card, styles.centerCard, className)} {...props} />
)

export const ShadowCard: React.FC<CardProps> = ({ className, ...props }) => (
  <div className={cx(styles.card, styles.shadowCard, className)} {...props} />
)

export const WideCard: React.FC<CardProps> = ({ className, ...props }) => (
  <div className={cx(styles.card, styles.shadowCard, styles.wideCard, className)} {...props} />
)

export default Card

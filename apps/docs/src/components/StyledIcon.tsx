import { ComponentProps } from 'react'

import styles from './StyledIcon.module.css'

const StyledIcon: React.FC<ComponentProps<'div'>> = ({ className, ...props }) => (
  <div className={[styles.icon, className].filter(Boolean).join(' ')} {...props} />
)

export default StyledIcon

import ThemedImage from '@theme/ThemedImage'
import { ComponentProps } from 'react'

import styles from './StyledImage.module.css'

const StyledImage: React.FC<ComponentProps<typeof ThemedImage>> = ({ className, ...props }) => (
  <ThemedImage className={[styles.image, className].filter(Boolean).join(' ')} {...props} />
)

export default StyledImage

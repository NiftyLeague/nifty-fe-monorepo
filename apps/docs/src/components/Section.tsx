import { ComponentProps } from 'react'

import styles from './Section.module.css'

const Section: React.FC<ComponentProps<'section'>> = ({ className, ...props }) => (
  <section className={[styles.section, className].filter(Boolean).join(' ')} {...props} />
)

export default Section

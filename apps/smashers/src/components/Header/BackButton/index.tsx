import { CircleArrowLeft } from 'lucide-react'

import styles from '../Navbar/index.module.css'

export default function BackButton() {
  return (
    // Native navigation keeps the public auth shell free of Next's Link runtime.
    <a href="/">
      <div className={styles.logo_container}>
        <CircleArrowLeft
          aria-label="back"
          color="#fff"
          size={48}
          // absoluteStrokeWidth holds the stroke at a constant 2px rather than
          // scaling with the 48px box, matching the shared icon default. The
          // previous width of 4 rendered as 8px at this size and read as bold.
          strokeWidth={2}
          absoluteStrokeWidth
          className={styles.logo}
        />
      </div>
    </a>
  )
}

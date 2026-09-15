import { CircleArrowLeft } from 'lucide-solid'

import styles from '../Navbar/index.module.css'

export default function BackButton() {
  return (
    // Native navigation keeps the public auth shell free of any router runtime.
    <a href="/" aria-label="back">
      <div class={styles.logo_container}>
        <CircleArrowLeft
          color="#fff"
          size={48}
          // absoluteStrokeWidth holds the stroke at a constant 2.5px rather than
          // scaling with the 48px box, matching the shared icon default. The
          // previous width of 4 rendered as 8px at this size and read as bold.
          stroke-width={2.5}
          absoluteStrokeWidth
          class={styles.logo}
        />
      </div>
    </a>
  )
}

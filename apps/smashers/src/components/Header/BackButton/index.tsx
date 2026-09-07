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
          strokeWidth={4}
          className={styles.logo}
        />
      </div>
    </a>
  )
}

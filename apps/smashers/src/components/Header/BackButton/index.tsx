import Link from 'next/link'
import { CircleArrowLeft } from 'lucide-react'

import styles from '../Navbar/index.module.css'

export default function BackButton() {
  return (
    <Link href="/">
      <div className={styles.logo_container}>
        <CircleArrowLeft
          aria-label="back"
          color="#fff"
          size={48}
          strokeWidth={4}
          className={styles.logo}
        />
      </div>
    </Link>
  )
}

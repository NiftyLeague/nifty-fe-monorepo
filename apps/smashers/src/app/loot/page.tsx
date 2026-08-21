import { Metadata } from 'next'
import { Typography } from '@nl/ui/custom/typography'
import BackButton from '@/components/Header/BackButton'
import LootTablesBoundary from './LootTablesBoundary'

import styles from './page.module.css'

export const metadata: Metadata = { title: 'Loot' }

export default function Loot() {
  return (
    <div className={styles.pageContainer}>
      <BackButton />
      <div className="w-full text-center mb-6">
        <Typography.Title
          level={1}
          className="mb-2"
          style={{
            background: 'var(--gradient-brand)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Loot Tables
        </Typography.Title>
        <Typography.Title level={6} className="text-muted-foreground">
          Explore the drop rates and rewards for all available crates and loot boxes.
        </Typography.Title>
      </div>
      <LootTablesBoundary />
    </div>
  )
}

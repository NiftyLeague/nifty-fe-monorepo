import React from 'react'
import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import useBaseUrl from '@docusaurus/useBaseUrl'

import Heading from '@theme/Heading'
import SearchBar from '@theme-original/SearchBar'
import ThemedImage from '@theme/ThemedImage'

import styles from './index.module.css'

export default function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className={styles.header}>
      <div className={styles.banner}>
        <Heading as="h1">{siteConfig.title}</Heading>
        <p style={{ maxWidth: '550px', marginTop: '1rem', fontWeight: 500 }}>
          The pages that follow contain comprehensive documentation of the Nifty League ecosystem.
          If you are new to Nifty League, you might want to check out our{' '}
          <Link to="/docs/faq/general">FAQ</Link> first.
        </p>
        <div className={styles.hideMedium}>
          <SearchBar />
        </div>
      </div>
      <ThemedImage
        alt="Header Background Image"
        className={styles.titleImage}
        sources={{
          light: useBaseUrl('/img/games/smashers/2D-levels/mars.webp'),
          dark: useBaseUrl('/img/games/smashers/3D-levels/sushi_cropped.webp'),
        }}
      />
    </header>
  )
}

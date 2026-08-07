import React from 'react'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'

import HomepageFeatures from '@site/src/components/HomepageFeatures'
import HomepageGuides from '@site/src/components/HomepageGuides'
import HomepageHeader from '@site/src/components/HomepageHeader'
import HomepageSocials from '@site/src/components/HomepageSocials'
import styles from './index.module.css'

export default function Home(): React.ReactNode {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout title={siteConfig.title} description="Documentation & Guides For Nifty League">
      <HomepageHeader />
      <main className={styles.container}>
        <HomepageFeatures />
        <HomepageGuides />
        <HomepageSocials />
      </main>
    </Layout>
  )
}

import OptimizedImage from '@nl/ui/custom/optimized-image'
import { Separator } from '@nl/ui/base/separator'
import { cx } from '@nl/ui/class-names'
import { DeferredYouTubeEmbed } from '@nl/ui/custom/deferred-youtube-embed'
import ThemeBtnGroup from '@nl/ui/custom/theme-button-group'
import '@/styles/home.css'
import styles from './index.module.css'
import HomeCompeteSection from '@/components/HomeSections/HomeCompeteSection'
import HomeTokenSection from '@/components/HomeSections/HomeTokenSection'

const CompeteAndEarn = (slots: Record<string, React.ReactNode> = {}) => {
  return (
    <div className="container pt-20">
      {slots.webIsland2 ?? <HomeTokenSection />}

      <section className="section flex flex-col-reverse md:flex-row mt-3 md:mt-5 py-5 items-center relative">
        <div className={cx(styles.block, 'w-full md:w-1/2 pr-5')}>
          <OptimizedImage
            src="/img/compete-and-earn/splash.webp"
            alt="Compete and Earn logo"
            width={700}
            height={548}
            loading="lazy"
            sizes="(min-width: 768px) 35vw, 100vw"
            className="mb-4 w-full max-w-[28rem] h-auto"
          />
          <div className="mb-3">
            <h2 className="heading-look-3">HOW IT WORKS</h2>
          </div>
          <p>
            4–16 players pool NFTL together for a cut-throat battle. The top three finishers take
            home earnings from the pooled pot.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <div className="relative text-right mb-4 md:mb-0 ps-0 lg:ps-5">
            {slots.webIsland0 ?? (
              <DeferredYouTubeEmbed
                src="https://www.youtube.com/embed/wv_fI1PPBi0"
                title="Nifty League Compete & Earn"
                className={styles.video}
              />
            )}
          </div>
        </div>
        <div className="purple-bg-orb orb-bottom-right" />
      </section>

      {slots.webIsland1 ?? <HomeCompeteSection />}

      <section className="section">
        <h3 className="mt-3 mt-md-5 text-center">GAME MODES</h3>
        <div className={cx(styles.features, 'flex pt-3 md:pt-5 mx-auto relative')}>
          <div className="w-1/3">
            <h4 className={cx(styles.headerCell, 'heading-look-6')}>FEATURES:</h4>
            <p className={styles.cell}>Requires an invite:</p>
            <p className={styles.cell}>Buy-in:</p>
            <p className={styles.cell}>Region:</p>
            <p className={styles.cell}>Player Number:</p>
          </div>
          <Separator
            orientation="vertical"
            style={{
              height: 'inherit',
              width: 3,
              backgroundColor: 'var(--color-foreground)',
              marginRight: 50,
            }}
          />
          <div className="w-1/3">
            <h4 className={cx(styles.headerCell, 'heading-look-6')}>PUBLIC</h4>
            <p className={styles.cell}>No</p>
            <p className={styles.cell}>1000 NFTL</p>
            <p className={styles.cell}>Decided by the Host</p>
            <p className={styles.cell}>Decided by the Host</p>
          </div>
          <div className="w-1/3">
            <h4 className={cx(styles.headerCell, 'heading-look-6')}>PRIVATE</h4>
            <p className={styles.cell}>Yes</p>
            <p className={styles.cell}>Decided by the Host</p>
            <p className={styles.cell}>Decided by the Host</p>
            <p className={styles.cell}>Decided by the Host</p>
          </div>
        </div>

        <ThemeBtnGroup
          className="mt-6 xl:mt-10"
          primary={{ href: 'https://app.niftyleague.com', title: 'PLAY NOW', external: true }}
        />
      </section>
    </div>
  )
}

export default CompeteAndEarn

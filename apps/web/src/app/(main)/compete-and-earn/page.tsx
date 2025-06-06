import cn from 'classnames';
import Image from 'next/image';
import type { NextPage } from 'next';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import styles from './index.module.css';

const CompeteAndEarn: NextPage = () => {
  return (
    <div className={cn(styles.container, 'overview mx-auto px-3')}>
      <div className="flex flex-col-reverse md:flex-row items-center justify-center relative">
        <div className={cn(styles.block, 'flex flex-col w-full md:w-1/2 pr-0 md:pr-5 relative')}>
          <div className="mb-2 mb-md-4">
            <AnimatedWrapper>
              <h1 className="animated-fade-slow animated-fade-start">COMPETE &amp; EARN</h1>
            </AnimatedWrapper>
          </div>
          <div className="mb-0">
            <AnimatedWrapper>
              <p className={cn(styles.heroDesc, 'animated-fade-slow animated-fade-start transition-delay-small')}>
                Adrenaline fueled, fast-paced brawl mode where the winner takes ALL
              </p>
            </AnimatedWrapper>
          </div>
          <div className={cn(styles.gradient1, 'purple-bg-orb')} />
        </div>
        <div className="w-full md:w-1/2">
          <div className="mb-3">
            <AnimatedWrapper>
              <div className="relative animated-fade-slow animated-fade-start transition-delay-medium ps-0 lg:ps-5">
                <Image
                  src="/img/compete-and-earn/splash.webp"
                  alt="Nifty League Compete & Earn"
                  width={3343}
                  height={2615}
                  priority
                  sizes="100vw"
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </AnimatedWrapper>
          </div>
        </div>
      </div>
      <div className={cn(styles.content, 'mx-auto')}>
        <div className="flex flex-col-reverse md:flex-row mt-3 md:mt-5 py-5 items-center relative">
          <div className={cn(styles.block, 'w-full md:w-1/2 pr-5')}>
            <div className="mb-3">
              <AnimatedWrapper>
                <h3 className="animated-header-text animated-header-text-start transition-delay-small">HOW IT WORKS</h3>
              </AnimatedWrapper>
            </div>
            <AnimatedWrapper>
              <p className="animated-header-text animated-header-text-start transition-delay-medium">
                4 - 16 Players pool NFTL together in a cuththroat battle for the survuval of the fittest. Only the
                first, second and third positions will take home earnings from the pooled pot!
              </p>
            </AnimatedWrapper>
          </div>
          <div className="w-full md:w-1/2">
            <AnimatedWrapper>
              <div className="relative text-right animated-fade-slow animated-fade-start transition-delay-medium mb-4 md:mb-0 ps-0 lg:ps-5">
                <iframe
                  src="https://www.youtube.com/embed/wv_fI1PPBi0"
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Nifty League Compete & Earn"
                  className={styles.video}
                />
              </div>
            </AnimatedWrapper>
          </div>
          <div className={cn(styles.gradient3, 'purple-bg-orb')} />
        </div>
        <AnimatedWrapper>
          <h3 className="mt-3 mt-md-5 text-center animated-fade animated-fade-start transition-delay-medium">
            GAME MODES
          </h3>
        </AnimatedWrapper>
        <AnimatedWrapper>
          <div
            className={cn(
              styles.features,
              'flex pt-3 md:pt-5 mx-auto animated-fade animated-fade-start transition-delay-medium relative',
            )}
          >
            <div className="w-1/3">
              <h5 className={styles.headerCell}>FEATURES:</h5>
              <p className={styles.cell}>Requires an invite:</p>
              <p className={styles.cell}>Buy-in:</p>
              <p className={styles.cell}>Region:</p>
              <p className={styles.cell}>Player Number:</p>
            </div>
            <hr style={{ height: 'inherit', border: '3px solid var(--color-light)', marginRight: 50 }} />
            <div className="w-1/3">
              <h5 className={styles.headerCell}>PUBLIC BRAWL</h5>
              <p className={styles.cell}>No</p>
              <p className={styles.cell}>1000 NFTL</p>
              <p className={styles.cell}>Decided by the Host</p>
              <p className={styles.cell}>Decided by the Host</p>
            </div>
            <div className="w-1/3">
              <h5 className={styles.headerCell}>PRIVATE BRAWL</h5>
              <p className={styles.cell}>Yes</p>
              <p className={styles.cell}>Decided by the Host</p>
              <p className={styles.cell}>Decided by the Host</p>
              <p className={styles.cell}>Decided by the Host</p>
            </div>
          </div>
        </AnimatedWrapper>

        <div className="flex justify-center mt-8 pb-8">
          <AnimatedWrapper>
            <a href="https://app.niftyleague.com/" target="_blank" rel="noreferrer">
              <button className="theme-btn-primary animated-fade animated-fade-start transition-delay-small">
                START PLAYING NOW
              </button>
            </a>
          </AnimatedWrapper>
        </div>
      </div>
    </div>
  );
};

export default CompeteAndEarn;

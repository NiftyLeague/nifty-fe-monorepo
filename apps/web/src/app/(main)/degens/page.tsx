'use client';

import cn from 'classnames';
import type { NextPage } from 'next';
import Image from 'next/image';
import { Container, Grid, useMediaQuery } from '@mui/material';
import AnimatedWrapper from '@/components/AnimatedWrapper';
import { NIFTY_DEGENS, NIFTY_DEGENS_ALL } from '@/constants/degens';
import ExternalIcon from '@/components/ExternalIcon';
import ConsoleGame from '@/components/ConsoleGame';
import styles from './index.module.scss';

const DegensSection = () => {
  const desktop = useMediaQuery('(min-width:768px)');
  return (
    <div className={styles.section}>
      <AnimatedWrapper>
        <Grid container spacing={0} style={{ marginBottom: 20 }}>
          <Grid size={{ xs: 6, sm: 4 }}>
            <h3 className="text-align-center animated-header-text animated-header-text-start transition-delay-small">
              TRIBE
            </h3>
          </Grid>
          <Grid size={{ xs: 6, sm: 8 }}>
            <h3 className="text-align-center animated-header-text animated-header-text-start transition-delay-small">
              SPECIAL
            </h3>
          </Grid>
        </Grid>
        <div className={styles.table}>
          <hr className={styles.divider} />
          {NIFTY_DEGENS.map(({ name, description, specialName, gif, image }) => (
            <Grid container spacing={0} key={name} style={{ marginBottom: 20 }}>
              <Grid size={{ xs: 6, sm: 4 }} className={styles.grid_col}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <AnimatedWrapper>
                    <div
                      style={{ position: 'relative' }}
                      className="text-align-center animated-fade-slow animated-fade-start transition-delay-small"
                    >
                      <Image
                        src={image.link}
                        alt={name}
                        width={desktop ? image.width : image.width / 2}
                        height={desktop ? image.height : image.height / 2}
                      />
                    </div>
                  </AnimatedWrapper>
                  <AnimatedWrapper>
                    <h5
                      style={{ marginTop: 8 }}
                      className="text-align-center animated-fade-slow animated-fade-start transition-delay-small"
                    >
                      {name}
                    </h5>
                  </AnimatedWrapper>
                </div>
              </Grid>
              {desktop && (
                <Grid size={{ xs: 5 }} className={styles.grid_col}>
                  <AnimatedWrapper>
                    <p className="animated-header-text animated-header-text-start transition-delay-medium">
                      {description}
                    </p>
                  </AnimatedWrapper>
                </Grid>
              )}
              <Grid size={{ xs: 6, sm: 3 }} className={styles.grid_col_end}>
                <AnimatedWrapper>
                  <div
                    style={{ position: 'relative' }}
                    className="text-align-center animated-fade-slow animated-fade-start transition-delay-small"
                  >
                    <Image
                      src={gif.link}
                      unoptimized
                      alt={name}
                      width={desktop ? gif.width : gif.width * 0.7}
                      height={desktop ? gif.height : gif.height * 0.7}
                      sizes="100vw"
                      style={{ width: '95%', height: 'auto' }}
                    />
                  </div>
                </AnimatedWrapper>
                <h6 className="text-align-center">{specialName}</h6>
              </Grid>
            </Grid>
          ))}
        </div>
      </AnimatedWrapper>
    </div>
  );
};

const Degens: NextPage = () => {
  const desktop = useMediaQuery('(min-width:768px)');
  return (
    <>
      <div className="row m-0 p-0 position-relative">
        <ConsoleGame src="/video/unboxing.mp4" />
      </div>
      <div className={cn(styles.container, 'overview mx-auto px-3')}>
        <Container>
          <div className="d-flex align-items-center justify-content-center flex-wrap mb-4 mb-md-5">
            <div className="col-12 col-md-6 pe-md-4">
              <div className="mb-4">
                <AnimatedWrapper>
                  <h1 className="text-align-center animated-header-text animated-header-text-start transition-delay-small">
                    DEGENs
                  </h1>
                </AnimatedWrapper>
              </div>
              <div className="mb-4">
                <AnimatedWrapper>
                  <h6 className="text-align-center animated-header-text animated-header-text-start transition-delay-medium">
                    COMMUNITY DESIGNED DEGEN NFTs
                  </h6>
                </AnimatedWrapper>
              </div>
              <div className="position-relative">
                <AnimatedWrapper>
                  <p className="text-align-center animated-header-text animated-header-text-start transition-delay-medium">
                    The Nifty League DEGENs were specially crafted by the community with members pitching in and
                    deciding how THEY wanted their DEGENs to look. This involved selecting special features that they
                    wanted including selection of cothing, tribe, and weapons among a few others. This led to the birth
                    of 10,000 Nifty League NFTs on the Ethereum blockchain. The NFTs are all sold out however they are
                    forever tradable on secondary markets such as OpenSea.
                  </p>
                </AnimatedWrapper>
                <div className={cn(styles.gradient1, 'radial-gradient-piece')} />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <AnimatedWrapper>
                <div className="position-relative text-align-right animated-fade-slow animated-fade-start transition-delay-medium mb-4 mb-md-0 ps-0 ps-lg-5">
                  <iframe
                    width="100%"
                    height="315"
                    src="https://www.youtube.com/embed/WWLqE1tnf6U"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </AnimatedWrapper>
            </div>
          </div>

          <div className="d-flex justify-content-center">
            <AnimatedWrapper>
              <a href="https://app.niftyleague.com/degens" target="_blank" rel="noreferrer">
                <button className="btn theme-btn-primary px-4 animated-fade-slow animated-fade-start transition-delay-large">
                  SEE ALL DEGENS
                  <ExternalIcon />
                </button>
              </a>
            </AnimatedWrapper>
          </div>

          <div className={cn(styles.section, 'position-relative')}>
            <div className={cn(styles.gradient2, 'radial-gradient-piece')} />
            <div
              className={cn(
                styles.list,
                'd-flex flex-wrap align-items-center flex-md-row full-width justify-content-between',
              )}
            >
              {NIFTY_DEGENS_ALL.map(({ name, image }) => (
                <div className="mb-3 px-3 col-4" key={name}>
                  <div className="d-flex flex-column">
                    <AnimatedWrapper>
                      <div className="text-align-center position-relative animated-fade-slow animated-fade-start transition-delay-small">
                        <Image
                          src={image.link}
                          alt={name}
                          width={desktop ? image.width : image.width / 2}
                          height={desktop ? image.height : image.height / 2}
                        />
                      </div>
                    </AnimatedWrapper>
                    <AnimatedWrapper>
                      <h6 className="text-align-center px-3 mt-3 animated-fade-slow animated-fade-start transition-delay-small">
                        {name}
                      </h6>
                    </AnimatedWrapper>
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <AnimatedWrapper>
                <h3 className="mt-2 text-align-center animated-header-text animated-header-text-start transition-delay-small">
                  DEGEN TRIBES
                </h3>
              </AnimatedWrapper>
            </div>
            <div className="mb-0 position-relative">
              <AnimatedWrapper>
                <p className="text-align-center animated-header-text animated-header-text-start transition-delay-medium">
                  There are 7 genesis DEGEN tribes each with their own special abilities in our games. These NFTs are
                  digital assets that represent special game avatars inside the Nifty League ecosystem. Owners can also
                  use their DEGEN NFTs in several other partner projects such as WORLDWIDE WEBB or CRYPTO FOXES.
                </p>
              </AnimatedWrapper>
              <div className={cn(styles.gradient1, 'radial-gradient-piece')} />
            </div>
          </div>
        </Container>

        <DegensSection />

        <div className="d-flex justify-content-center my-5">
          <AnimatedWrapper>
            <a href="/docs/overview/nfts/degens/about" target="_blank" rel="noreferrer">
              <button
                className={cn(
                  styles.button,
                  'btn theme-btn-primary px-3 animated-fade-slow animated-fade-start transition-delay-medium',
                )}
              >
                View Docs
                <ExternalIcon />
              </button>
            </a>
          </AnimatedWrapper>
        </div>
      </div>
    </>
  );
};

export default Degens;

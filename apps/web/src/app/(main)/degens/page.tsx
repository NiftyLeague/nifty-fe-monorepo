'use client';

import type { NextPage } from 'next';
import Image from 'next/image';
import { Container, Grid, useMediaQuery } from '@mui/material';
import { cn } from '@nl/ui/lib/utils';
import AnimatedWrapper from '@nl/ui/custom/AnimatedWrapper';
import { NIFTY_DEGENS, NIFTY_DEGENS_ALL } from '@/constants/degens';
import ExternalIcon from '@/components/ExternalIcon';
import ConsoleGame from '@/components/ConsoleGame';
import styles from './index.module.css';

const DegensSection = () => {
  const desktop = useMediaQuery('(min-width:768px)');
  return (
    <div className={styles.section}>
      <AnimatedWrapper>
        <Grid container spacing={0} style={{ marginBottom: 20 }}>
          <Grid size={{ xs: 6, sm: 4 }}>
            <h3 className="text-center transition-vertical-fade transition-vertical-fade-start delay-lite">TRIBE</h3>
          </Grid>
          <Grid size={{ xs: 6, sm: 8 }}>
            <h3 className="text-center transition-vertical-fade transition-vertical-fade-start delay-lite">SPECIAL</h3>
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
                      className="text-center transition-fade-slow transition-fade-start delay-lite"
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
                      className="text-center transition-fade-slow transition-fade-start delay-lite"
                    >
                      {name}
                    </h5>
                  </AnimatedWrapper>
                </div>
              </Grid>
              {desktop && (
                <Grid size={{ xs: 5 }} className={styles.grid_col}>
                  <AnimatedWrapper>
                    <p className="transition-vertical-fade transition-vertical-fade-start delay-normal">
                      {description}
                    </p>
                  </AnimatedWrapper>
                </Grid>
              )}
              <Grid size={{ xs: 6, sm: 3 }} className={styles.grid_col_end}>
                <AnimatedWrapper>
                  <div
                    style={{ position: 'relative' }}
                    className="text-center transition-fade-slow transition-fade-start delay-lite"
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
                <h6 className="text-center">{specialName}</h6>
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
      <div className="flex m-0 p-0 relative w-full">
        <ConsoleGame src="/video/unboxing.mp4" />
      </div>
      <div className={cn(styles.container, 'overview mx-auto px-3 w-full')}>
        <Container>
          <div className="flex items-center justify-center flex-wrap mb-4 md:mb-5">
            <div className="w-full md:w-1/2 md:pr-4">
              <div className="mb-4">
                <AnimatedWrapper>
                  <h1 className="text-center transition-vertical-fade transition-vertical-fade-start delay-lite">
                    DEGENs
                  </h1>
                </AnimatedWrapper>
              </div>
              <div className="mb-4">
                <AnimatedWrapper>
                  <h6 className="text-center transition-vertical-fade transition-vertical-fade-start delay-normal">
                    COMMUNITY DESIGNED DEGEN NFTs
                  </h6>
                </AnimatedWrapper>
              </div>
              <div className="relative">
                <AnimatedWrapper>
                  <p className="text-center transition-vertical-fade transition-vertical-fade-start delay-normal">
                    The Nifty League DEGENs were specially crafted by the community with members pitching in and
                    deciding how THEY wanted their DEGENs to look. This involved selecting special features that they
                    wanted including selection of cothing, tribe, and weapons among a few others. This led to the birth
                    of 10,000 Nifty League NFTs on the Ethereum blockchain. The NFTs are all sold out however they are
                    forever tradable on secondary markets such as OpenSea.
                  </p>
                </AnimatedWrapper>
                <div className={cn(styles.gradient1, 'purple-bg-orb')} />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <AnimatedWrapper>
                <div className="relative text-right transition-fade-slow transition-fade-start delay-normal mb-4 md:mb-0 ps-0 lg:pl-5">
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

          <div className="flex justify-center">
            <AnimatedWrapper>
              <a href="https://app.niftyleague.com/degens" target="_blank" rel="noreferrer">
                <button className="theme-btn-primary transition-fade-slow transition-fade-start delay-long">
                  SEE ALL DEGENS
                  <ExternalIcon />
                </button>
              </a>
            </AnimatedWrapper>
          </div>

          <div className={cn(styles.section, 'relative')}>
            <div className={cn(styles.gradient2, 'purple-bg-orb')} />
            <div className={cn(styles.list, 'flex flex-wrap items-center md:flex-row w-full justify-between')}>
              {NIFTY_DEGENS_ALL.map(({ name, image }) => (
                <div className="mb-3 px-3 w-1/3" key={name}>
                  <div className="flex flex-col">
                    <AnimatedWrapper>
                      <div className="text-center relative transition-fade-slow transition-fade-start delay-lite">
                        <Image
                          src={image.link}
                          alt={name}
                          width={desktop ? image.width : image.width / 2}
                          height={desktop ? image.height : image.height / 2}
                        />
                      </div>
                    </AnimatedWrapper>
                    <AnimatedWrapper>
                      <h6 className="text-center px-3 mt-3 transition-fade-slow transition-fade-start delay-lite">
                        {name}
                      </h6>
                    </AnimatedWrapper>
                  </div>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <AnimatedWrapper>
                <h3 className="mt-2 text-center transition-vertical-fade transition-vertical-fade-start delay-lite">
                  DEGEN TRIBES
                </h3>
              </AnimatedWrapper>
            </div>
            <div className="mb-0 relative">
              <AnimatedWrapper>
                <p className="text-center transition-vertical-fade transition-vertical-fade-start delay-normal">
                  There are 7 genesis DEGEN tribes each with their own special abilities in our games. These NFTs are
                  digital assets that represent special game avatars inside the Nifty League ecosystem. Owners can also
                  use their DEGEN NFTs in several other partner projects such as WORLDWIDE WEBB or CRYPTO FOXES.
                </p>
              </AnimatedWrapper>
              <div className={cn(styles.gradient1, 'purple-bg-orb')} />
            </div>
          </div>
        </Container>

        <DegensSection />

        <div className="flex justify-center mt-5 pb-8">
          <AnimatedWrapper>
            <a href="/docs/overview/nfts/degens/about" target="_blank" rel="noreferrer">
              <button className="theme-btn-primary transition-fade-slow transition-fade-start delay-normal">
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

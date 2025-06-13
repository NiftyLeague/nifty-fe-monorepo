import Image from 'next/image';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import useMediaQuery from '@mui/material/useMediaQuery';
import AnimatedWrapper from '@nl/ui/custom/AnimatedWrapper';

import { NIFTY_DEGENS } from './constants';
import styles from './index.module.css';

const DegensSection = () => {
  const desktop = useMediaQuery('(min-width:600px)');
  return (
    <Container className={styles.container}>
      <div className={styles.section}>
        <div style={{ marginBottom: 20 }}>
          <AnimatedWrapper>
            <h2 className="text-center transition-vertical-fade transition-vertical-fade-start delay-lite">
              Choose your fighter
            </h2>
          </AnimatedWrapper>
        </div>
        <div style={{ position: 'relative' }}>
          <AnimatedWrapper>
            <p className="text-center transition-vertical-fade transition-vertical-fade-start delay-normal">
              There are 7 tribes to choose from, each with their own unique special ability. Some characters specialize
              in melee combat, while others are skilled in ranged attacks or magic.
            </p>
          </AnimatedWrapper>
        </div>
      </div>

      <div className={styles.section}>
        <AnimatedWrapper>
          <Grid container spacing={0} style={{ marginBottom: 20 }}>
            <Grid size={{ xs: 6, sm: 4 }}>
              <h3 className="text-center transition-vertical-fade transition-vertical-fade-start delay-lite">TRIBE</h3>
            </Grid>
            <Grid size={{ xs: 6, sm: 8 }}>
              <h3 className="text-center transition-vertical-fade transition-vertical-fade-start delay-lite">
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
                        style={{ width: '100%', height: 'auto' }}
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
    </Container>
  );
};

export default DegensSection;

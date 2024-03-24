'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import cn from 'classnames';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

import { DEGEN_BASE_SPRITE_URL, LEGGIES } from '@/constants/degens';
import { SRC, Color } from '@/types/gltf';
import useClaimableNFTL from '@/hooks/useClaimableNFTL';
import { formatNumberToDisplay } from '@/lib/numbers';
import ErrorBoundary from '@/components/ErrorBoundry';

import styles from '@/styles/gltf.module.scss';

const ModelView = dynamic(() => import('@/components/ModelView'), { ssr: false });
const ModelActions = dynamic(() => import('@/components/ModelView').then(mod => mod.ModelActions), {
  ssr: false,
});

const TokenMenu = ({ tokenId }: { tokenId: string }) => {
  const { totalAccrued } = useClaimableNFTL(tokenId as string);
  return (
    <div className={styles.menu__nftlUnclaimed}>
      <strong>NFTL Unclaimed:</strong> {formatNumberToDisplay(totalAccrued)}
    </div>
  );
};

export default function DegenViews() {
  const params = useParams();
  const tokenId = params.tokenId as string;
  const [source, setSource] = useState<SRC>(SRC.IMAGE);
  const [color, setColor] = useState<Color>('purple');
  const IMAGE_SRC = `/img/degens/${tokenId}.${LEGGIES.includes(Number(tokenId)) ? 'gif' : 'png'}`;
  const SPRITE_SRC = `${DEGEN_BASE_SPRITE_URL}/${tokenId}.gif`;

  if (!tokenId) return null;

  return (
    <>
      <style jsx global>{`
        body,
        html {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          background-color: #fff !important;
        }
      `}</style>
      {source === SRC.IMAGE && (
        <Image
          alt="NiftyDegen 2D NFT"
          className={styles.image}
          width={584}
          height={640}
          priority
          quality={100}
          src={IMAGE_SRC}
          unoptimized={IMAGE_SRC.includes('.gif')}
        />
      )}
      {source === SRC.SPRITE && (
        <Image alt="Degen Sprite" className={styles.sprite} fill priority unoptimized src={SPRITE_SRC} />
      )}
      <main
        className={cn(styles.main__wrapper, {
          ...(source === SRC.MODEL && {
            [styles.gradient_salmon as string]: color === 'salmon',
            [styles.gradient_purple as string]: color === 'purple',
            [styles.gradient_blue as string]: color === 'blue',
            [styles.gradient_bluegrey as string]: color === 'bluegrey',
            [styles.gradient_bluepurple as string]: color === 'bluepurple',
            [styles.gradient_green as string]: color === 'green',
            [styles.gradient_bluegreen as string]: color === 'bluegreen',
            [styles.gradient_brown as string]: color === 'brown',
            [styles.gradient_ochre as string]: color === 'ochre',
            [styles.gradient_palepink as string]: color === 'palepink',
            [styles.gradient_yellow as string]: color === 'yellow',
            [styles.gradient_greenish as string]: color === 'greenish',
            [styles.gradient_lightblue as string]: color === 'lightblue',
            [styles.gradient_ochretwo as string]: color === 'ochretwo',
          }),
        })}
      >
        <ModelView source={source} />
        <div className={styles.menu__overlay}>
          <div className={styles.menu__overlay__dimension}>
            <div className={styles.menu__overlay__boggs}>
              <ButtonGroup variant="contained" size="small" aria-label="outlined primary button group">
                <Button
                  onClick={() => setSource(SRC.IMAGE)}
                  className={cn(styles.btn, { [styles.btn_selected as string]: source === SRC.IMAGE })}
                >
                  2D
                </Button>
                <Button
                  onClick={() => setSource(SRC.MODEL)}
                  className={cn(styles.btn, { [styles.btn_selected as string]: source === SRC.MODEL })}
                >
                  3D
                </Button>
                {Number(tokenId) < 9901 ? (
                  <Button
                    onClick={() => setSource(SRC.SPRITE)}
                    className={cn(styles.btn, { [styles.btn_selected as string]: source === SRC.SPRITE })}
                  >
                    Sprite
                  </Button>
                ) : null}
              </ButtonGroup>
            </div>
          </div>
          {source === SRC.MODEL && <ModelActions color={color} setColor={setColor} />}
        </div>
        {source === SRC.IMAGE ? (
          <ErrorBoundary>
            <TokenMenu tokenId={tokenId} />
          </ErrorBoundary>
        ) : (
          <div className={styles.menu__logo}>
            <Image
              alt="Nifty League Logo"
              width={200}
              height={70}
              style={{ maxWidth: '24vw', height: 'auto' }}
              quality={100}
              src="/img/logo/wordmark.png"
            />
          </div>
        )}
      </main>
    </>
  );
}

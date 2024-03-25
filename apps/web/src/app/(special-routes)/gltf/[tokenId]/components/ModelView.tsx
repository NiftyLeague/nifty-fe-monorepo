'use client';

import '@google/model-viewer';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import { DEGEN_3D_MODEL_URL } from '@/constants/degens';
import { SRC } from '@/types/gltf';
import styles from '../gltf.module.scss';

declare global {
  namespace React.JSX {
    // eslint-disable-next-line no-unused-vars
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

export default function ModelView({ source }: { source: SRC }) {
  const params = useParams();
  const tokenId = params.tokenId as string;
  const [loading, setLoading] = useState(true);
  const MODEL_SRC = `${DEGEN_3D_MODEL_URL}/${tokenId}/${tokenId}.gltf`;
  // const POSTER_SRC = `${DEGEN_3D_MODEL_URL}/${tokenId}/${tokenId}.webp`;
  // const TEXTURE_SRC = `${DEGEN_3D_MODEL_URL}/${tokenId}/${tokenId}.png`;

  const handleProgress: EventListenerOrEventListenerObject = event => {
    // @ts-expect-error - model-viewer known attribute
    const progress = event?.detail?.totalProgress || 0;
    if (progress === 1) setLoading(false);
  };

  useEffect(() => {
    const model = document?.querySelector('#model-viewer');
    if (model) model.addEventListener('progress', handleProgress, { passive: true });
    return function cleanup() {
      if (model) model.removeEventListener('progress', handleProgress);
    };
  }, []);

  return (
    <div className={styles.model__wrapper}>
      {source === SRC.MODEL && loading ? (
        <div style={{ minHeight: '100vh', width: '100%', position: 'absolute', display: 'flex', zIndex: 2 }}>
          <CircularProgress style={{ margin: 'auto', width: 75, height: 'auto', color: '#FFF' }} />
        </div>
      ) : null}
      <model-viewer
        // https://modelviewer.dev/docs/index.html#loading-attributes
        id="model-viewer"
        alt="Nifty League DEGEN 3D model"
        style={source === SRC.MODEL ? { minHeight: '100vh', width: '100%' } : { display: 'none' }}
        src={MODEL_SRC}
        // poster={POSTER_SRC}
        loading="eager"
        // @ts-expect-error - model-viewer attributes broken
        exposure="0.72"
        shadow-intensity="1"
        shadow-softness="0.8"
        camera-controls="true"
        touch-action="pan-y"
        auto-rotate="true"
        auto-rotate-delay="1000"
        interaction-prompt="auto"
        interaction-prompt-threshold="10000"
        disable-tap="true"
        // ar="true"
        // ar-modes="webxr scene-viewer quick-look"
        // ar-status="not-presenting"
        // interaction-bounds="none"
        // animation-name="Idle"
        // max-camera-orbit="Infinity 100deg auto"
        // min-camera-orbit="-Infinity 0deg 300%"
        // scale="0.5 0.5 0.5"
        // orientation="0 0 200deg"
      />
    </div>
  );
}

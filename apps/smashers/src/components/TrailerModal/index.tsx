'use client';

import { useEffect, useState, useRef } from 'react';
import Modal from '@/components/Modal';
import styles from '@/components/Modal/index.module.css';

const TrailerContent = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const modalIframe = useRef<HTMLIFrameElement>(null);
  const messageCache = useRef({
    play: '{"event":"command","func":"playVideo","args":""}',
    pause: '{"event":"command","func":"pauseVideo","args":""}',
  });

  // Handle YouTube API messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://www.youtube.com') return;
      try {
        const data = JSON.parse(event.data);
        if (data.event === 'onReady') {
          setIsLoaded(true);
        }
      } catch (e) {
        // Ignore parsing errors from other messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handle video playback
  useEffect(() => {
    if (!modalIframe.current?.contentWindow) return;

    try {
      const message = isLoaded ? messageCache.current.play : messageCache.current.pause;
      modalIframe.current.contentWindow.postMessage(message, 'https://www.youtube.com');
    } catch (e) {
      console.error('Failed to control video:', e);
    }
  }, [isLoaded]);

  return (
    <div className={styles.modal_paper}>
      <iframe
        ref={modalIframe}
        id="trailer-modal-iframe"
        title="Nifty Smashers - Trailer"
        className={styles.modal_iframe}
        src="https://www.youtube.com/embed/4lnDrx4aDq8?enablejsapi=1&html5=1&autoplay=1&playsinline=1&rel=0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        frameBorder="0"
      />
    </div>
  );
};

type TrailerModalProps = { isOpen: boolean; onClose: () => void };

const TrailerModal = ({ isOpen, onClose }: TrailerModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <TrailerContent />
    </Modal>
  );
};

export default TrailerModal;

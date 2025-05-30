'use client';

import { useCallback, useEffect, useState, useRef, RefObject } from 'react';
import styles from '@/styles/modal.module.css';
import cn from 'classnames';

const ModalContent = ({
  modalIframe,
  visible,
}: {
  modalIframe: RefObject<HTMLIFrameElement | null>;
  visible: boolean;
}) => {
  return (
    <div className={styles.modal_paper}>
      {visible && (
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
      )}
    </div>
  );
};

export default function TrailerModal() {
  const [visible, setVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const modalIframe = useRef<HTMLIFrameElement>(null);
  const messageCache = useRef({
    play: '{"event":"command","func":"playVideo","args":""}',
    pause: '{"event":"command","func":"pauseVideo","args":""}',
  });

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

  const openModal = useCallback(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const closeModal = useCallback((e?: Event) => {
    if (e && e.target !== e.currentTarget) return;
    requestAnimationFrame(() => {
      setVisible(false);
      modalIframe?.current?.contentWindow?.postMessage(messageCache.current.pause, '*');
    });
  }, []);

  useEffect(() => {
    if (visible) {
      requestAnimationFrame(() => {
        modalIframe?.current?.contentWindow?.postMessage(messageCache.current.play, '*');
      });
    }
  }, [visible]);

  useEffect(() => {
    const trailerBtn = document.getElementById('trailer-btn');
    const closeBtn = document.getElementById('trailer-close-icon');
    const modal = document.getElementById('trailer-modal');

    // Add event listeners with passive option where appropriate
    trailerBtn?.addEventListener('click', openModal);
    modal?.addEventListener('click', closeModal);
    modal?.addEventListener('touchstart', closeModal, { passive: true });
    closeBtn?.addEventListener('click', closeModal);
    closeBtn?.addEventListener('touchstart', closeModal, { passive: true });

    return function cleanup() {
      trailerBtn?.removeEventListener('click', openModal);
      modal?.removeEventListener('click', closeModal);
      modal?.removeEventListener('touchstart', closeModal);
      closeBtn?.removeEventListener('click', closeModal);
      closeBtn?.removeEventListener('touchstart', closeModal);
    };
  }, [openModal, closeModal]);

  return (
    <div id="trailer-modal" className={cn(styles.modal, { hidden: !visible })}>
      <ModalContent modalIframe={modalIframe} visible={visible} />
      <div id="trailer-close-icon" className={styles.close_icon}>
        &times;
      </div>
    </div>
  );
}

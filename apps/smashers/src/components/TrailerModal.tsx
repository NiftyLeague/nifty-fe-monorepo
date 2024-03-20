import { useCallback, useEffect, useState, useRef, RefObject } from 'react';
import styles from '@/styles/modal.module.css';
import cn from 'classnames';

const ModalContent = ({ modalIframe }: { modalIframe: RefObject<HTMLIFrameElement> }) => {
  return (
    <div className={styles.modal_paper}>
      <iframe
        ref={modalIframe}
        id="trailer-modal-iframe"
        title="Nifty Smashers - Trailer"
        className={styles.modal_iframe}
        src="https://www.youtube.com/embed/4lnDrx4aDq8?autoplay=1&enablejsapi=1&html5=1"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        frameBorder="0"
      ></iframe>
    </div>
  );
};

export default function TrailerModal() {
  const [visible, setVisible] = useState(false);
  const modalIframe = useRef<HTMLIFrameElement>(null);

  const openModal = useCallback(() => setVisible(true), []);

  const closeModal = useCallback(() => {
    setVisible(false);
    modalIframe?.current?.contentWindow?.postMessage(
      '{"event":"command","func":"' + 'pauseVideo' + '","args":""}',
      '*',
    );
  }, []);

  useEffect(() => {
    if (visible) {
      modalIframe?.current?.contentWindow?.postMessage(
        '{"event":"command","func":"' + 'playVideo' + '","args":""}',
        '*',
      );
    }
  }, [visible]);

  useEffect(() => {
    const trailerBtn = document.getElementById('trailer-btn');
    const closeBtn = document.getElementById('trailer-close-icon');
    const modal = document.getElementById('trailer-modal');
    trailerBtn?.addEventListener('click', openModal);
    modal?.addEventListener('click', closeModal);
    closeBtn?.addEventListener('click', closeModal);

    return function cleanup() {
      trailerBtn?.removeEventListener('click', openModal);
      modal?.removeEventListener('click', closeModal);
      closeBtn?.removeEventListener('click', closeModal);
    };
  }, [openModal, closeModal]);

  return (
    <div id="trailer-modal" className={cn(styles.modal, { hidden: !visible })}>
      {visible && <ModalContent modalIframe={modalIframe} />}
      <div id="trailer-close-icon" className={styles.close_icon}>
        &times;
      </div>
    </div>
  );
}

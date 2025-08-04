'use client';

import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { Dialog } from '@nl/ui/custom/Dialog';

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
    <iframe
      ref={modalIframe}
      id="trailer-modal-iframe"
      title="Nifty Smashers - Trailer"
      className=" -m-6 mt-0 w-[calc(100%+3rem)] aspect-video"
      src="https://www.youtube.com/embed/4lnDrx4aDq8?enablejsapi=1&html5=1&autoplay=1&playsinline=1&rel=0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      loading="lazy"
      frameBorder="0"
    />
  );
};

const TrailerDialog = ({ open }: { open: boolean }) => (
  <Dialog
    defaultOpen={open}
    title="Nifty Smashers - Trailer"
    description="3D free-to-play platform fighter"
    hideDescription
    hideTitle
    triggerElement={
      <button>
        <Image
          src="/icons/socials/youtube.svg"
          alt="YouTube Logo"
          width={22}
          height={22}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        Trailer
      </button>
    }
  >
    <TrailerContent />
  </Dialog>
);

export default TrailerDialog;

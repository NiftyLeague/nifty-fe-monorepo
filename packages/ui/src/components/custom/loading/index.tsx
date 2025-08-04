import { PreloaderBase } from '../preloader/base';

export function Loading({ ready = false }: { ready?: boolean }) {
  return <PreloaderBase ready={ready} />;
}

export default Loading;

import { Preloader } from '../preloader/base';

export function Loading({ ready = false }: { ready?: boolean }) {
  return <Preloader ready={ready} />;
}

export default Loading;

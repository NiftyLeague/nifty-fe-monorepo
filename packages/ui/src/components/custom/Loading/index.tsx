import { Preloader } from '@nl/ui/custom/Preloader';

export default function Loading({ ready = false }: { ready?: boolean }) {
  return <Preloader ready={ready} />;
}

import { Unity } from 'react-unity-webgl';

import { Button } from '@nl/ui/base/button';
import { Icon } from '@nl/ui/base/icon';
import { Preloader } from '@nl/ui/custom/preloader';
// import { useUserContext } from '@nl/playfab/hooks/useUserContext';

import useUnityPreConfig from '@/hooks/useUnityPreConfig';
import useUnityEventHandlers from '@/hooks/useUnityEventHandlers';
import useUnitySafeClose from '@/hooks/useUnitySafeClose';

import styles from '@/components/Modal/index.module.css';

const Game = ({ closeGame }: { closeGame: () => void }) => {
  //   const { account, publisherData } = useUserContext();
  const address = '0x0';
  const authToken = '';

  const {
    addEventListener,
    isLoaded,
    loadingProgression,
    removeEventListener,
    requestFullscreen,
    unityProvider,
    unload,
  } = useUnityPreConfig();

  useUnityEventHandlers({ address, authToken, addEventListener, removeEventListener });

  useUnitySafeClose({ closeGame, unload });

  return (
    <>
      <Preloader ready={isLoaded} progress={loadingProgression} />
      <Unity
        key={authToken}
        unityProvider={unityProvider}
        className={styles.modal_game_canvas}
        style={{ visibility: isLoaded ? 'visible' : 'hidden' }}
      />
      <Button
        variant="outline"
        size="icon"
        onClick={() => requestFullscreen(true)}
        className="absolute top-5 right-5 cursor-pointer"
      >
        <Icon name="maximize-2" />
      </Button>
    </>
  );
};

export default Game;

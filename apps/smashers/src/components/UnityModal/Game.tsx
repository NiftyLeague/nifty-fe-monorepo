import { Unity } from 'react-unity-webgl';

import { Icon } from '@nl/ui/base/icon';
import Button from '@nl/ui/supabase/Button';
import Preloader from '@nl/ui/custom/Preloader';
// import { PlayFabAuthForm } from '@nl/playfab/components';

import useUnityPreConfig from '@/hooks/useUnityPreConfig';
import useUnityEventHandlers from '@/hooks/useUnityEventHandlers';
import useUnitySafeClose from '@/hooks/useUnitySafeClose';

import styles from '@/components/Modal/index.module.css';

const Game = ({ closeGame }: { closeGame: () => void }) => {
  //   const { account, publisherData } = PlayFabAuthForm.useUserContext();
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
        type="outline"
        size="lg"
        onClick={() => requestFullscreen(true)}
        style={{ position: 'absolute', top: 5, right: 5 }}
        icon={<Icon name="maximize-2" />}
      />
    </>
  );
};

export default Game;

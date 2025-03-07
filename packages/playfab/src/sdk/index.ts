import * as PlayFab from './PlayFab';
import * as PlayFabAdmin from './PlayFabAdmin';
import * as PlayFabClient from './PlayFabClient';
import * as PlayFabCloudScript from './PlayFabCloudScript';

const sdk = {
  PlayFab: PlayFab,
  PlayFabAdmin: PlayFabAdmin,
  PlayFabClient: PlayFabClient,
  PlayFabCloudScript: PlayFabCloudScript,
  get settings() {
    return PlayFab.settings;
  },
  set settings(value) {
    Object.assign(PlayFab.settings, value);
  },
};

const createClient = (titleId: string, developerSecretKey: string) => {
  sdk.settings.titleId = titleId;
  sdk.settings.developerSecretKey = developerSecretKey;

  return { PlayFabAdmin, PlayFabClient, PlayFabCloudScript };
};

export const playfab = createClient(
  process.env.NEXT_PUBLIC_PLAYFAB_TITLE_ID as string,
  process.env.PLAYFAB_API_KEY as string,
);

export default playfab;

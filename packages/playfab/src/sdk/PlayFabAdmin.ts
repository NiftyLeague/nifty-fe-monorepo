/// <reference path="./typings/PlayFabAdmin.d.ts" />

import type { PlayFabError, PlayFabResponse } from '../types';
import * as PlayFab from './PlayFab';

export const DeletePlayer: PlayFabAdminModule.IPlayFabAdmin['DeletePlayer'] = (request, callback) => {
  if (PlayFab.settings.developerSecretKey == null) {
    throw 'Must have PlayFab.settings.DeveloperSecretKey set to call this method';
  }
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Admin/DeletePlayer',
    request,
    'X-SecretKey',
    PlayFab.settings.developerSecretKey,
    function (error: PlayFabError, result: PlayFabResponse<PlayFabAdminModels.DeletePlayerResult>) {
      if (callback != null) {
        callback(error, result);
      }
    },
  );
};

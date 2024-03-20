/// <reference path="./typings/PlayFabAdmin.d.ts" />

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
    function (
      error: PlayFabModule.IPlayFabError,
      result: PlayFabModule.IPlayFabSuccessContainer<PlayFabAdminModels.DeletePlayerResult>,
    ) {
      if (callback != null) {
        callback(error, result);
      }
    },
  );
};

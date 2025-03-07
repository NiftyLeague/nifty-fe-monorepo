/// <reference path="./typings/PlayFabCloudScript.d.ts" />

import * as PlayFab from './PlayFab';

export const ExecuteFunction: PlayFabCloudScriptModule.IPlayFabCloudScript['ExecuteFunction'] = (
  request,
  EntityToken,
  callback,
) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/CloudScript/ExecuteFunction',
    request,
    'X-EntityToken',
    EntityToken,
    function (
      error: PlayFabModule.IPlayFabError,
      result: PlayFabModule.IPlayFabSuccessContainer<PlayFabCloudScriptModels.ExecuteFunctionResult>,
    ) {
      if (callback != null) {
        callback(error, result);
      }
    },
  );
};

/// <reference path="./typings/PlayFabCloudScript.d.ts" />

import type { PlayFabError, PlayFabResponse } from '../types';
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
    function (error: PlayFabError, result: PlayFabResponse<PlayFabCloudScriptModels.ExecuteFunctionResult>) {
      if (callback != null) {
        callback(error, result);
      }
    },
  );
};

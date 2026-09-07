/// <reference path="../sdk/typings/PlayFabAdmin.d.ts" />

import type { PlayFabError, PlayFabResponse } from '../types'
import * as PlayFabAdmin from '../sdk/PlayFabAdmin'
import { configurePlayFab } from '../sdk/configure'

configurePlayFab()

export async function DeletePlayer(
  PlayFabId: string
): Promise<PlayFabAdminModels.DeletePlayerResult> {
  return new Promise((resolve, reject) => {
    PlayFabAdmin.DeletePlayer(
      { PlayFabId },
      (error: PlayFabError, result: PlayFabResponse<PlayFabAdminModels.DeletePlayerResult>) => {
        if (error || !result) reject(error)
        else resolve(result.data)
      }
    )
  })
}

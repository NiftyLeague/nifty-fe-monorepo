/// <reference path="../sdk/typings/PlayFab.d.ts" />
/// <reference path="../sdk/typings/PlayFabClient.d.ts" />

import type { PlayFabError } from '../types'
import * as PlayFabClient from '../sdk/PlayFabClient'
import { configurePlayFab } from '../sdk/configure'
import { parseLinkedWalletResult } from '../utils/parseData'

configurePlayFab()

export async function callClientAPI<T extends PlayFabModule.IPlayFabResultCommon>(
  functionName: string,
  request: unknown,
  sessionTicket?: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    const call = (PlayFabClient as Record<string, unknown>)[functionName] as (
      request: unknown,
      callback: (error: PlayFabError, result: PlayFabModule.IPlayFabSuccessContainer<T>) => void,
      sessionTicket?: string
    ) => void

    call(
      request,
      (error, result) => {
        if (error) {
          console.error(`${functionName} Error`, error)
          reject(error)
        } else {
          resolve(result?.data ?? {})
        }
      },
      sessionTicket
    )
  })
}

export async function getLinkedWallets(sessionTicket: string): Promise<string[]> {
  const { Data } = await callClientAPI<PlayFabClientModels.GetUserDataResult>(
    'GetUserPublisherReadOnlyData',
    { Keys: ['LinkedWallets'] },
    sessionTicket
  )
  return Data ? parseLinkedWalletResult(Data) : []
}

export function getPlayFabTitleId(): string {
  return PlayFabClient.settings.titleId
}

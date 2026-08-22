/// <reference path="../sdk/typings/PlayFabClient.d.ts" />

import { InfoRequestParameters } from '../constants'
import type {
  AccountResult,
  LinkProviderResult,
  LoginResult,
  PlayerResult,
  Provider,
  PublisherDataResult,
  RegisterUserResult,
  UnlinkProviderResult,
  UserData,
} from '../types'
import { getRandomKey } from '../utils/getRandomKey'
import {
  callClientAPI,
  getPlayFabTitleId,
  getLinkedWallets as getLinkedWalletsFromRuntime,
} from './runtime'

export const RegisterPlayFabUser = async (params: {
  Email: string
  Password: string
}): Promise<RegisterUserResult> => {
  const request = { ...params, Username: getRandomKey(20), RequireBothUsernameAndEmail: true }
  return callClientAPI<RegisterUserResult>('RegisterPlayFabUser', request)
}

export const LoginWithEmailAddress = async (params: {
  Email: string
  Password: string
  InfoRequestParameters?: PlayFabClientModels.GetPlayerCombinedInfoRequestParams
}): Promise<LoginResult> => callClientAPI<LoginResult>('LoginWithEmailAddress', { ...params })

export const LoginWithCustomID = async (params: {
  CustomId: string
  InfoRequestParameters?: PlayFabClientModels.GetPlayerCombinedInfoRequestParams
}): Promise<LoginResult> =>
  callClientAPI<LoginResult>('LoginWithCustomID', { ...params, CreateAccount: false })

export const GenerateCustomID = async (SessionTicket: string): Promise<string> => {
  const CustomId = getRandomKey(100)
  await callClientAPI('LinkCustomID', { CustomId, ForceLink: false }, SessionTicket)
  return CustomId
}

type AccountRecoveryResult = PlayFabClientModels.SendAccountRecoveryEmailResult
export const SendAccountRecoveryEmail = async (Email: string): Promise<AccountRecoveryResult> =>
  callClientAPI<AccountRecoveryResult>('SendAccountRecoveryEmail', {
    TitleId: getPlayFabTitleId(),
    Email,
  })

async function linkProviderAccount(
  functionName: string,
  request: Record<string, unknown>,
  sessionTicket: string
) {
  return callClientAPI(functionName, { ForceLink: true, ...request }, sessionTicket)
}

export const LinkProvider = async (
  provider: Provider,
  accessToken: string,
  SessionTicket: string
): Promise<{ error?: unknown; data?: LinkProviderResult }> => {
  try {
    const requests: Partial<Record<Provider, [string, Record<string, unknown>]>> = {
      google: ['LinkGoogleAccount', { AccessToken: accessToken }],
      apple: ['LinkApple', { IdentityToken: accessToken }],
      facebook: ['LinkFacebookAccount', { AccessToken: accessToken }],
      twitch: ['LinkTwitch', { AccessToken: accessToken }],
    }
    const requestForProvider = requests[provider]
    if (!requestForProvider) return { data: null }
    const [functionName, request] = requestForProvider
    const data = await linkProviderAccount(functionName, request, SessionTicket)
    return { data: data as LinkProviderResult }
  } catch (error) {
    return { error }
  }
}

export const UnlinkProvider = async (
  provider: Provider,
  SessionTicket: string
): Promise<{ error?: unknown; data?: UnlinkProviderResult }> => {
  try {
    const functionNames: Partial<Record<Provider, string>> = {
      google: 'UnlinkGoogleAccount',
      apple: 'UnlinkApple',
      facebook: 'UnlinkFacebookAccount',
      twitch: 'UnlinkTwitch',
    }
    const functionName = functionNames[provider]
    if (!functionName) return { data: null }
    const data = await callClientAPI(functionName, {}, SessionTicket)
    return { data: data as UnlinkProviderResult }
  } catch (error) {
    return { error }
  }
}

export const GetAccountInfo = async (SessionTicket: string): Promise<AccountResult> =>
  callClientAPI<AccountResult>('GetAccountInfo', {}, SessionTicket)

export const GetPlayerCombinedInfo = async (SessionTicket: string): Promise<PlayerResult> =>
  callClientAPI<PlayerResult>('GetPlayerCombinedInfo', { InfoRequestParameters }, SessionTicket)

export async function GetUserPublisherReadOnlyData(
  Keys: string[],
  SessionTicket: string
): Promise<PublisherDataResult> {
  return callClientAPI<PublisherDataResult>('GetUserPublisherReadOnlyData', { Keys }, SessionTicket)
}

export const GetUserPublisherData = async (SessionTicket: string): Promise<UserData> => {
  const { Data: PublisherData } = await GetUserPublisherReadOnlyData(
    ['LinkedWallets', 'DisplayName'],
    SessionTicket
  )
  return { ...PublisherData }
}

export const GetLinkedWallets = getLinkedWalletsFromRuntime

export async function AddOrUpdateContactEmail(
  EmailAddress: string,
  SessionTicket: string
): Promise<PlayFabClientModels.AddOrUpdateContactEmailResult> {
  return callClientAPI<PlayFabClientModels.AddOrUpdateContactEmailResult>(
    'AddOrUpdateContactEmail',
    { EmailAddress },
    SessionTicket
  )
}

export async function UpdateAvatarUrl(
  ImageUrl: string,
  SessionTicket: string
): Promise<PlayFabClientModels.EmptyResponse> {
  return callClientAPI('UpdateAvatarUrl', { ImageUrl }, SessionTicket)
}

export async function UpdateUserPublisherData(
  Data: any,
  Permission = 'public',
  SessionTicket: string
): Promise<PlayFabClientModels.UpdateUserDataResult> {
  return callClientAPI<PublisherDataResult>(
    'UpdateUserPublisherData',
    { Data, Permission },
    SessionTicket
  )
}

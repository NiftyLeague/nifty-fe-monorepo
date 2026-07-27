import { beforeEach, describe, expect, it } from 'bun:test'

import { clientMethods, clientMocks, sdk } from './test-mock-sdk'

type ApiExports = {
  AddOrUpdateContactEmail: typeof import('./api').AddOrUpdateContactEmail
  ChangeDisplayName: typeof import('./api').ChangeDisplayName
  DeletePlayer: typeof import('./api').DeletePlayer
  GenerateCustomID: typeof import('./api').GenerateCustomID
  GetAccountInfo: typeof import('./api').GetAccountInfo
  GetLinkedWallets: typeof import('./api').GetLinkedWallets
  GetPlayerCombinedInfo: typeof import('./api').GetPlayerCombinedInfo
  GetUserPublisherData: typeof import('./api').GetUserPublisherData
  LinkProvider: typeof import('./api').LinkProvider
  LinkWallet: typeof import('./api').LinkWallet
  LoginWithCustomID: typeof import('./api').LoginWithCustomID
  LoginWithEmailAddress: typeof import('./api').LoginWithEmailAddress
  RegisterPlayFabUser: typeof import('./api').RegisterPlayFabUser
  SendAccountRecoveryEmail: typeof import('./api').SendAccountRecoveryEmail
  UnlinkProvider: typeof import('./api').UnlinkProvider
  UnlinkWallet: typeof import('./api').UnlinkWallet
  UpdateAvatarUrl: typeof import('./api').UpdateAvatarUrl
  UpdateUserPublisherData: typeof import('./api').UpdateUserPublisherData
}

let api: ApiExports

beforeEach(async () => {
  api = await import('./api')
})

type Callback = (error: unknown, result: unknown) => void

function clientSuccess(method: string, data: unknown) {
  const spy = clientMocks[method as (typeof clientMethods)[number]]
  spy.mockImplementation((_request: unknown, callback: Callback) => callback(null, { data }))
  return spy
}

function clientFailure(method: string, error: unknown) {
  const spy = clientMocks[method as (typeof clientMethods)[number]]
  spy.mockImplementation((_request: unknown, callback: Callback) => callback(error, null))
  return spy
}

beforeEach(() => {
  sdk.admin.DeletePlayer.mockClear()
  sdk.cloudScript.ExecuteFunction.mockClear()
  for (const m of clientMethods) {
    clientMocks[m].mockClear()
  }
})

describe('PlayFab account API', () => {
  it('registers and logs in users with normalized requests', async () => {
    const register = clientSuccess('RegisterPlayFabUser', { PlayFabId: 'player' })
    const emailLogin = clientSuccess('LoginWithEmailAddress', { SessionTicket: 'email-ticket' })
    const customLogin = clientSuccess('LoginWithCustomID', { SessionTicket: 'custom-ticket' })

    await expect(
      api.RegisterPlayFabUser({ Email: 'player@example.com', Password: 'secret' })
    ).resolves.toEqual({
      PlayFabId: 'player',
    })
    await expect(
      api.LoginWithEmailAddress({ Email: 'player@example.com', Password: 'secret' })
    ).resolves.toEqual({
      SessionTicket: 'email-ticket',
    })
    await expect(api.LoginWithCustomID({ CustomId: 'custom' })).resolves.toEqual({
      SessionTicket: 'custom-ticket',
    })

    expect(register).toHaveBeenCalledWith(
      expect.objectContaining({ Username: 'random-20', RequireBothUsernameAndEmail: true }),
      expect.any(Function),
      undefined
    )
    expect(emailLogin).toHaveBeenCalled()
    expect(customLogin).toHaveBeenCalledWith(
      expect.objectContaining({ CustomId: 'custom', CreateAccount: false }),
      expect.any(Function),
      undefined
    )
  })

  it('generates custom IDs and account-recovery requests', async () => {
    const link = clientSuccess('LinkCustomID', {})
    const recover = clientSuccess('SendAccountRecoveryEmail', {})

    await expect(api.GenerateCustomID('ticket')).resolves.toBe('random-100')
    await api.SendAccountRecoveryEmail('player@example.com')

    expect(link).toHaveBeenCalledWith(
      { CustomId: 'random-100', ForceLink: false },
      expect.any(Function),
      'ticket'
    )
    expect(recover).toHaveBeenCalledWith(
      { TitleId: 'TITLE', Email: 'player@example.com' },
      expect.any(Function),
      undefined
    )
  })

  it('propagates client API failures', async () => {
    clientFailure('GetAccountInfo', { code: 401, errorMessage: 'Expired' })
    await expect(api.GetAccountInfo('expired-ticket')).rejects.toMatchObject({ code: 401 })
  })
})

describe('provider linking', () => {
  it.each([
    ['google', 'LinkGoogleAccount'],
    ['apple', 'LinkApple'],
    ['facebook', 'LinkFacebookAccount'],
    ['twitch', 'LinkTwitch'],
  ] as const)('links %s accounts', async (provider, method) => {
    const mock = clientSuccess(method, { linked: provider })
    await expect(api.LinkProvider(provider, 'access-token', 'ticket')).resolves.toEqual({
      data: { linked: provider },
    })
    expect(mock).toHaveBeenCalledWith(
      expect.objectContaining({ ForceLink: true }),
      expect.any(Function),
      'ticket'
    )
  })

  it.each([
    ['google', 'UnlinkGoogleAccount'],
    ['apple', 'UnlinkApple'],
    ['facebook', 'UnlinkFacebookAccount'],
    ['twitch', 'UnlinkTwitch'],
  ] as const)('unlinks %s accounts', async (provider, method) => {
    clientSuccess(method, { unlinked: provider })
    await expect(api.UnlinkProvider(provider, 'ticket')).resolves.toEqual({
      data: { unlinked: provider },
    })
  })

  it('returns provider errors as data-safe results', async () => {
    clientFailure('LinkGoogleAccount', { errorMessage: 'Already linked' })
    await expect(api.LinkProvider('google', 'access-token', 'ticket')).resolves.toEqual({
      error: { errorMessage: 'Already linked' },
    })
  })
})

describe('profile and publisher data', () => {
  it('reads and updates account data', async () => {
    clientSuccess('GetAccountInfo', { AccountInfo: { PlayFabId: 'player' } })
    clientSuccess('GetPlayerCombinedInfo', { InfoResultPayload: {} })
    clientSuccess('GetUserPublisherReadOnlyData', {
      Data: { LinkedWallets: { Value: '["ethereum:0xabc"]' }, DisplayName: { Value: 'Nifty' } },
    })
    clientSuccess('AddOrUpdateContactEmail', {})
    clientSuccess('UpdateAvatarUrl', {})
    clientSuccess('UpdateUserPublisherData', {})

    await expect(api.GetAccountInfo('ticket')).resolves.toHaveProperty(
      'AccountInfo.PlayFabId',
      'player'
    )
    await expect(api.GetPlayerCombinedInfo('ticket')).resolves.toHaveProperty('InfoResultPayload')
    await expect(api.GetLinkedWallets('ticket')).resolves.toEqual(['ethereum:0xabc'])
    await expect(api.GetUserPublisherData('ticket')).resolves.toHaveProperty(
      'DisplayName.Value',
      'Nifty'
    )
    await api.AddOrUpdateContactEmail('player@example.com', 'ticket')
    await api.UpdateAvatarUrl('https://example.com/avatar.png', 'ticket')
    await api.UpdateUserPublisherData({ DisplayName: 'Nifty' }, 'private', 'ticket')
  })
})

describe('admin and cloud functions', () => {
  it('deletes players and changes display names', async () => {
    sdk.admin.DeletePlayer.mockImplementation((_request, callback) =>
      callback(null, { data: { deleted: true } })
    )
    sdk.cloudScript.ExecuteFunction.mockImplementation((_request, _token, callback) =>
      callback(null, { data: { FunctionResult: 'ok' } })
    )

    await expect(api.DeletePlayer('player')).resolves.toEqual({ deleted: true })
    await expect(api.ChangeDisplayName('Nifty', 'entity-token')).resolves.toEqual({
      FunctionResult: 'ok',
    })
  })

  it('links and unlinks Ethereum wallets through cloud functions', async () => {
    clientSuccess('GetUserPublisherReadOnlyData', { Data: { LinkedWallets: { Value: '[]' } } })
    sdk.cloudScript.ExecuteFunction.mockImplementation((_request, _token, callback) =>
      callback(null, { data: { FunctionResult: 'linked' } })
    )

    await expect(
      api.LinkWallet({
        address: '0xABCDEF012345',
        signature: 'signature',
        nonce: 'nonce',
        EntityToken: 'entity-token',
        SessionTicket: 'ticket',
      })
    ).resolves.toEqual({ FunctionResult: 'linked' })

    clientSuccess('GetUserPublisherReadOnlyData', {
      Data: { LinkedWallets: { Value: '["ethereum:0xabcdef012345"]' } },
    })
    await expect(
      api.UnlinkWallet({
        address: '0xABCDEF012345',
        EntityToken: 'entity-token',
        SessionTicket: 'ticket',
      })
    ).resolves.toEqual({ FunctionResult: 'linked' })
  })

  it('rejects unsupported chains and missing wallet links', async () => {
    clientSuccess('GetUserPublisherReadOnlyData', { Data: { LinkedWallets: { Value: '[]' } } })
    await expect(
      api.LinkWallet({
        chain: 'polygon',
        address: '0xabc',
        signature: 'signature',
        nonce: 'nonce',
        EntityToken: 'entity-token',
        SessionTicket: 'ticket',
      })
    ).rejects.toThrow('Only Ethereum wallets')
    await expect(
      api.UnlinkWallet({ address: '0xabc', EntityToken: 'entity-token', SessionTicket: 'ticket' })
    ).rejects.toThrow('not linked')
  })
})

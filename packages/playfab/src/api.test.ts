import { beforeEach, describe, expect, it, vi } from 'vitest';

const sdk = vi.hoisted(() => ({
  client: { settings: { titleId: 'TITLE' } } as Record<string, unknown>,
  admin: { DeletePlayer: vi.fn() },
  cloudScript: { ExecuteFunction: vi.fn() },
}));

vi.mock('./sdk', () => ({
  playfab: { PlayFabClient: sdk.client, PlayFabAdmin: sdk.admin, PlayFabCloudScript: sdk.cloudScript },
}));
vi.mock('./utils/getRandomKey', () => ({ getRandomKey: vi.fn((size: number) => `random-${size}`) }));
vi.mock('./utils/wallet', () => ({ isEthereumSignatureValid: vi.fn(() => true) }));

import {
  AddOrUpdateContactEmail,
  ChangeDisplayName,
  DeletePlayer,
  GenerateCustomID,
  GetAccountInfo,
  GetLinkedWallets,
  GetPlayerCombinedInfo,
  GetUserPublisherData,
  LinkProvider,
  LinkWallet,
  LoginWithCustomID,
  LoginWithEmailAddress,
  RegisterPlayFabUser,
  SendAccountRecoveryEmail,
  UnlinkProvider,
  UnlinkWallet,
  UpdateAvatarUrl,
  UpdateUserPublisherData,
} from './api';

type Callback = (error: unknown, result: unknown) => void;

function clientSuccess(method: string, data: unknown) {
  const mock = vi.fn((_request: unknown, callback: Callback) => callback(null, { data }));
  sdk.client[method] = mock;
  return mock;
}

function clientFailure(method: string, error: unknown) {
  const mock = vi.fn((_request: unknown, callback: Callback) => callback(error, null));
  sdk.client[method] = mock;
  return mock;
}

beforeEach(() => {
  sdk.admin.DeletePlayer.mockReset();
  sdk.cloudScript.ExecuteFunction.mockReset();
});

describe('PlayFab account API', () => {
  it('registers and logs in users with normalized requests', async () => {
    const register = clientSuccess('RegisterPlayFabUser', { PlayFabId: 'player' });
    const emailLogin = clientSuccess('LoginWithEmailAddress', { SessionTicket: 'email-ticket' });
    const customLogin = clientSuccess('LoginWithCustomID', { SessionTicket: 'custom-ticket' });

    await expect(RegisterPlayFabUser({ Email: 'player@example.com', Password: 'secret' })).resolves.toEqual({
      PlayFabId: 'player',
    });
    await expect(LoginWithEmailAddress({ Email: 'player@example.com', Password: 'secret' })).resolves.toEqual({
      SessionTicket: 'email-ticket',
    });
    await expect(LoginWithCustomID({ CustomId: 'custom' })).resolves.toEqual({ SessionTicket: 'custom-ticket' });

    expect(register).toHaveBeenCalledWith(
      expect.objectContaining({ Username: 'random-20', RequireBothUsernameAndEmail: true }),
      expect.any(Function),
      undefined,
    );
    expect(emailLogin).toHaveBeenCalled();
    expect(customLogin).toHaveBeenCalledWith(
      expect.objectContaining({ CustomId: 'custom', CreateAccount: false }),
      expect.any(Function),
      undefined,
    );
  });

  it('generates custom IDs and account-recovery requests', async () => {
    const link = clientSuccess('LinkCustomID', {});
    const recover = clientSuccess('SendAccountRecoveryEmail', {});

    await expect(GenerateCustomID('ticket')).resolves.toBe('random-100');
    await SendAccountRecoveryEmail('player@example.com');

    expect(link).toHaveBeenCalledWith({ CustomId: 'random-100', ForceLink: false }, expect.any(Function), 'ticket');
    expect(recover).toHaveBeenCalledWith(
      { TitleId: 'TITLE', Email: 'player@example.com' },
      expect.any(Function),
      undefined,
    );
  });

  it('propagates client API failures', async () => {
    clientFailure('GetAccountInfo', { code: 401, errorMessage: 'Expired' });
    await expect(GetAccountInfo('expired-ticket')).rejects.toMatchObject({ code: 401 });
  });
});

describe('provider linking', () => {
  it.each([
    ['google', 'LinkGoogleAccount'],
    ['apple', 'LinkApple'],
    ['facebook', 'LinkFacebookAccount'],
    ['twitch', 'LinkTwitch'],
  ] as const)('links %s accounts', async (provider, method) => {
    const mock = clientSuccess(method, { linked: provider });
    await expect(LinkProvider(provider, 'access-token', 'ticket')).resolves.toEqual({ data: { linked: provider } });
    expect(mock).toHaveBeenCalledWith(expect.objectContaining({ ForceLink: true }), expect.any(Function), 'ticket');
  });

  it.each([
    ['google', 'UnlinkGoogleAccount'],
    ['apple', 'UnlinkApple'],
    ['facebook', 'UnlinkFacebookAccount'],
    ['twitch', 'UnlinkTwitch'],
  ] as const)('unlinks %s accounts', async (provider, method) => {
    clientSuccess(method, { unlinked: provider });
    await expect(UnlinkProvider(provider, 'ticket')).resolves.toEqual({ data: { unlinked: provider } });
  });

  it('returns provider errors as data-safe results', async () => {
    clientFailure('LinkGoogleAccount', { errorMessage: 'Already linked' });
    await expect(LinkProvider('google', 'access-token', 'ticket')).resolves.toEqual({
      error: { errorMessage: 'Already linked' },
    });
  });
});

describe('profile and publisher data', () => {
  it('reads and updates account data', async () => {
    clientSuccess('GetAccountInfo', { AccountInfo: { PlayFabId: 'player' } });
    clientSuccess('GetPlayerCombinedInfo', { InfoResultPayload: {} });
    clientSuccess('GetUserPublisherReadOnlyData', {
      Data: { LinkedWallets: { Value: '["ethereum:0xabc"]' }, DisplayName: { Value: 'Nifty' } },
    });
    clientSuccess('AddOrUpdateContactEmail', {});
    clientSuccess('UpdateAvatarUrl', {});
    clientSuccess('UpdateUserPublisherData', {});

    await expect(GetAccountInfo('ticket')).resolves.toHaveProperty('AccountInfo.PlayFabId', 'player');
    await expect(GetPlayerCombinedInfo('ticket')).resolves.toHaveProperty('InfoResultPayload');
    await expect(GetLinkedWallets('ticket')).resolves.toEqual(['ethereum:0xabc']);
    await expect(GetUserPublisherData('ticket')).resolves.toHaveProperty('DisplayName.Value', 'Nifty');
    await AddOrUpdateContactEmail('player@example.com', 'ticket');
    await UpdateAvatarUrl('https://example.com/avatar.png', 'ticket');
    await UpdateUserPublisherData({ DisplayName: 'Nifty' }, 'private', 'ticket');
  });
});

describe('admin and cloud functions', () => {
  it('deletes players and changes display names', async () => {
    sdk.admin.DeletePlayer.mockImplementation((_request, callback) => callback(null, { data: { deleted: true } }));
    sdk.cloudScript.ExecuteFunction.mockImplementation((_request, _token, callback) =>
      callback(null, { data: { FunctionResult: 'ok' } }),
    );

    await expect(DeletePlayer('player')).resolves.toEqual({ deleted: true });
    await expect(ChangeDisplayName('Nifty', 'entity-token')).resolves.toEqual({ FunctionResult: 'ok' });
  });

  it('links and unlinks Ethereum wallets through cloud functions', async () => {
    clientSuccess('GetUserPublisherReadOnlyData', { Data: { LinkedWallets: { Value: '[]' } } });
    sdk.cloudScript.ExecuteFunction.mockImplementation((_request, _token, callback) =>
      callback(null, { data: { FunctionResult: 'linked' } }),
    );

    await expect(
      LinkWallet({
        address: '0xABCDEF012345',
        signature: 'signature',
        nonce: 'nonce',
        EntityToken: 'entity-token',
        SessionTicket: 'ticket',
      }),
    ).resolves.toEqual({ FunctionResult: 'linked' });

    clientSuccess('GetUserPublisherReadOnlyData', {
      Data: { LinkedWallets: { Value: '["ethereum:0xabcdef012345"]' } },
    });
    await expect(
      UnlinkWallet({ address: '0xABCDEF012345', EntityToken: 'entity-token', SessionTicket: 'ticket' }),
    ).resolves.toEqual({ FunctionResult: 'linked' });
  });

  it('rejects unsupported chains and missing wallet links', async () => {
    clientSuccess('GetUserPublisherReadOnlyData', { Data: { LinkedWallets: { Value: '[]' } } });
    await expect(
      LinkWallet({
        chain: 'polygon',
        address: '0xabc',
        signature: 'signature',
        nonce: 'nonce',
        EntityToken: 'entity-token',
        SessionTicket: 'ticket',
      }),
    ).rejects.toThrow('Only Ethereum wallets');
    await expect(
      UnlinkWallet({ address: '0xabc', EntityToken: 'entity-token', SessionTicket: 'ticket' }),
    ).rejects.toThrow('not linked');
  });
});

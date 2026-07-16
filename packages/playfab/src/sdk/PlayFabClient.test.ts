import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as PlayFab from './PlayFab';
import * as client from './PlayFabClient';
import { DeletePlayer } from './PlayFabAdmin';
import { ExecuteFunction } from './PlayFabCloudScript';

vi.mock('./PlayFab', () => ({
  settings: { titleId: 'TITLE', developerSecretKey: 'secret' },
  GetServerUrl: vi.fn(() => 'https://TITLE.playfabapi.com'),
  MakeRequest: vi.fn(),
}));

type ApiFunction = (request: Record<string, unknown>, callback: (...args: unknown[]) => void, ticket?: string) => void;

const authorizedMethods = [
  'AddGenericID',
  'AddOrUpdateContactEmail',
  'GetAccountInfo',
  'GetPlayerCombinedInfo',
  'GetUserPublisherReadOnlyData',
  'LinkApple',
  'LinkCustomID',
  'LinkFacebookAccount',
  'LinkGoogleAccount',
  'LinkTwitch',
  'UnlinkApple',
  'UnlinkCustomID',
  'UnlinkFacebookAccount',
  'UnlinkGoogleAccount',
  'UnlinkTwitch',
  'UpdateAvatarUrl',
  'UpdateUserPublisherData',
] as const;

const loginMethods = [
  'LoginWithApple',
  'LoginWithCustomID',
  'LoginWithEmailAddress',
  'LoginWithFacebook',
  'LoginWithGoogleAccount',
  'LoginWithPlayFab',
  'LoginWithTwitch',
  'RegisterPlayFabUser',
] as const;

beforeEach(() => vi.mocked(PlayFab.MakeRequest).mockReset());

describe('PlayFabClient session state', () => {
  it('requires a ticket and an unexpired entity token', () => {
    expect(client.IsClientLoggedIn()).toBe(false);
    expect(client.IsClientLoggedIn({ SessionTicket: '' } as never)).toBe(false);
    expect(
      client.IsClientLoggedIn({
        SessionTicket: 'ticket',
        EntityToken: { TokenExpiration: new Date(Date.now() + 60_000).toISOString() },
      } as never),
    ).toBe(true);
    expect(
      client.IsClientLoggedIn({
        SessionTicket: 'ticket',
        EntityToken: { TokenExpiration: new Date(Date.now() - 60_000).toISOString() },
      } as never),
    ).toBe(false);
  });
});

describe('generated client endpoint wrappers', () => {
  it.each(authorizedMethods)('%s sends the session ticket and forwards results', method => {
    const callback = vi.fn();
    (client[method] as unknown as ApiFunction)({ value: method }, callback, 'ticket');
    const call = vi.mocked(PlayFab.MakeRequest).mock.calls.at(-1);

    expect(call?.slice(0, 4)).toEqual([
      expect.stringContaining(`/Client/${method}`),
      { value: method },
      'X-Authorization',
      'ticket',
    ]);
    (call?.[4] as (...args: unknown[]) => void)(null, { data: { ok: true } });
    expect(callback).toHaveBeenCalledWith(null, { data: { ok: true } });
  });

  it.each(loginMethods)('%s injects the title and uses anonymous authentication', method => {
    const callback = vi.fn();
    (client[method] as unknown as ApiFunction)({ value: method }, callback);
    const call = vi.mocked(PlayFab.MakeRequest).mock.calls.at(-1);

    expect(call?.slice(0, 4)).toEqual([
      expect.stringContaining(`/Client/${method}`),
      { value: method, TitleId: 'TITLE' },
      null,
      null,
    ]);
    (call?.[4] as (...args: unknown[]) => void)(null, { data: { ok: true } });
    expect(callback).toHaveBeenCalled();
  });

  it('supports unauthenticated account recovery', () => {
    const callback = vi.fn();
    client.SendAccountRecoveryEmail({ Email: 'player@example.com', TitleId: 'TITLE' }, callback);
    expect(PlayFab.MakeRequest).toHaveBeenCalledWith(
      expect.stringContaining('/Client/SendAccountRecoveryEmail'),
      expect.objectContaining({ Email: 'player@example.com' }),
      null,
      null,
      expect.any(Function),
    );
  });
});

describe('admin and cloud-script wrappers', () => {
  it('supplies the appropriate service authentication', () => {
    DeletePlayer({ PlayFabId: 'player' }, vi.fn());
    expect(PlayFab.MakeRequest).toHaveBeenLastCalledWith(
      expect.stringContaining('/Admin/DeletePlayer'),
      { PlayFabId: 'player' },
      'X-SecretKey',
      'secret',
      expect.any(Function),
    );

    ExecuteFunction({ FunctionName: 'Example' }, 'entity-token', vi.fn());
    expect(PlayFab.MakeRequest).toHaveBeenLastCalledWith(
      expect.stringContaining('/CloudScript/ExecuteFunction'),
      { FunctionName: 'Example' },
      'X-EntityToken',
      'entity-token',
      expect.any(Function),
    );
  });
});

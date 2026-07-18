import { mock } from 'bun:test';

export const clientMethods = [
  'RegisterPlayFabUser',
  'LoginWithEmailAddress',
  'LoginWithCustomID',
  'LinkCustomID',
  'SendAccountRecoveryEmail',
  'GetAccountInfo',
  'LinkGoogleAccount',
  'GetPlayerCombinedInfo',
  'GetUserPublisherReadOnlyData',
  'AddOrUpdateContactEmail',
  'UpdateAvatarUrl',
  'UpdateUserPublisherData',
  'LinkApple',
  'LinkFacebookAccount',
  'LinkTwitch',
  'UnlinkGoogleAccount',
  'UnlinkApple',
  'UnlinkFacebookAccount',
  'UnlinkTwitch',
] as const;

type ClientMock = Record<(typeof clientMethods)[number], ReturnType<typeof mock>>;
export const clientMocks = {} as ClientMock;
for (const m of clientMethods) {
  clientMocks[m] = mock();
}

export const sdk = {
  client: { settings: { titleId: 'TITLE' }, ...clientMocks } as Record<string, unknown>,
  admin: { DeletePlayer: mock() },
  cloudScript: { ExecuteFunction: mock() },
};

mock.module('./sdk/index', () => ({
  playfab: { PlayFabClient: sdk.client, PlayFabAdmin: sdk.admin, PlayFabCloudScript: sdk.cloudScript },
}));
mock.module('./utils/getRandomKey', () => ({ getRandomKey: mock((size: number) => `random-${size}`) }));
mock.module('./utils/wallet', () => ({
  signMessage: mock(async () => '0xsigned'),
  isEthereumSignatureValid: mock(() => true),
}));

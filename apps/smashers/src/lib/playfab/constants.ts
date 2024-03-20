import type { User, UserContextType, UserInfo } from '@/lib/playfab/types';

export const USER_INITIAL_STATE = {
  isLoggedIn: false,
  persistLogin: false,
  CustomId: undefined,
  EntityToken: undefined,
  PlayFabId: undefined,
  SessionTicket: undefined,
} as User;

export const USER_INFO_INITIAL_STATE = {
  AccountInfo: undefined,
  CharacterInventories: undefined,
  CharacterList: undefined,
  PlayerProfile: undefined,
  PlayerStatistics: undefined,
  PublisherData: undefined,
  TitleData: undefined,
  UserData: undefined,
  UserDataVersion: undefined,
  UserInventory: undefined,
  UserReadOnlyData: undefined,
  UserReadOnlyDataVersion: undefined,
  UserVirtualCurrency: undefined,
} as UserInfo;

export const USER_CONTEXT_INITIAL_STATE = {
  account: undefined,
  currencies: undefined,
  inventory: [],
  isLoggedIn: false,
  playFabId: undefined,
  profile: undefined,
  publisherData: undefined,
  stats: [],
  refetchPlayer: () => new Promise(() => undefined),
} as UserContextType;

export const ProfileConstraints = {
  ShowAvatarUrl: true,
  // ShowBannedUntil: true,
  // ShowCampaignAttributions: true,
  // ShowContactEmailAddresses: true,
  // ShowCreated: true,
  // ShowDisplayName: true,
  // ShowExperimentVariants: true,
  // ShowLastLogin: true,
  ShowLinkedAccounts: true,
  // ShowLocations: true,
  // ShowMemberships: true,
  // ShowOrigination: true,
  // ShowPushNotificationRegistrations: true,
  // ShowStatistics: true,
  // ShowTags: true,
  // ShowTotalValueToDateInUsd: true,
  // ShowValuesToDate: true,
} as PlayFabClientModels.PlayerProfileViewConstraints;

export const InfoRequestParameters = {
  GetUserAccountInfo: true,
  GetPlayerProfile: true,
  ProfileConstraints,
  // GetPlayerStatistics: true,
  // PlayerStatisticNames: [],
  GetUserInventory: true,
  GetUserVirtualCurrency: true,
  // GetCharacterInventories: true,
  // GetCharacterList: true,
  // GetTitleData: true,
  // GetUserData: true,
  // UserDataKeys: [],
  // GetUserReadOnlyData: true,
  // UserReadOnlyDataKeys: []
} as PlayFabClientModels.GetPlayerCombinedInfoRequestParams;

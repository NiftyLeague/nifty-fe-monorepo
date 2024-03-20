export type PlayFabClient = PlayFabClientModule.IPlayFabClient;
export type PlayFabError = PlayFabModule.IPlayFabError;

export type LoginResult = PlayFabClientModels.LoginResult;
export type RegisterUserResult = PlayFabClientModels.RegisterPlayFabUserResult;
export type EntityTokenResponse = PlayFabClientModels.EntityTokenResponse;

// extends LoginResult & RegisterUserResult
export type User = {
  // Check PlayFab SDK if client in logged in
  isLoggedIn: boolean;
  // If user checks remember me, persist the login on subsequent site visits
  persistLogin?: boolean;
  // Private unique identifier with ability to login
  CustomId?: string;
  // If LoginTitlePlayerAccountEntity flag is set on the login request the title_player_account will also be logged in and returned.
  EntityToken?: EntityTokenResponse;
  // PlayFab unique identifier for this newly created account.
  PlayFabId?: string;
  // Unique token identifying the user and game at the server level, for the current session.
  SessionTicket?: string;
};

export type LinkGoogleResult = PlayFabClientModels.LinkGoogleAccountResult;
export type LinkAppleResult = PlayFabClientModels.EmptyResult;
export type LinkFacebookResult = PlayFabClientModels.LinkFacebookAccountResult;
export type LinkTwitchResult = PlayFabClientModels.LinkTwitchAccountResult;
export type LinkProviderResult = LinkGoogleResult | LinkAppleResult | LinkFacebookResult | LinkTwitchResult | null;
export type Provider =
  | 'google'
  | 'apple'
  | 'facebook'
  | 'twitch'
  | 'discord' // not implemented in playfab
  | 'twitter'; // not implemented in playfab

export type UserSettings = PlayFabClientModels.UserSettings;
export type UserAccountInfo = PlayFabClientModels.UserAccountInfo;
export type AccountResult = PlayFabClientModels.GetAccountInfoResult;
export type Currencies = { [key: string]: number };
export type ItemInstance = PlayFabClientModels.ItemInstance;
export type UserInventory = ItemInstance[];
export type CharacterInventory = PlayFabClientModels.CharacterInventory[];
export type CharacterList = PlayFabClientModels.CharacterResult[];
export type PlayerResult = PlayFabClientModels.GetPlayerCombinedInfoResult;
export type PublisherDataResult = PlayFabClientModels.GetUserDataResult;
export type UserDataRecord = PlayFabClientModels.UserDataRecord;
export type UserData = { [key: string]: UserDataRecord };
export type PlayerProfile = PlayFabClientModels.PlayerProfileModel;
export type Stats = PlayFabClientModels.StatisticValue[];
export type TitleData = { [key: string]: string | null };

export type UserInfo = {
  // Account information for the user. This is always retrieved.
  AccountInfo?: UserAccountInfo;
  // Inventories for each character for the user.
  CharacterInventories?: CharacterInventory;
  // List of characters for the user.
  CharacterList?: CharacterList;
  // The profile of the players. This profile is not guaranteed to be up-to-date. For a new player, this profile will not exist.
  PlayerProfile?: PlayerProfile;
  // List of statistics for this player.
  PlayerStatistics?: Stats;
  // User specific publisher data
  PublisherData?: UserData;
  // Title data for this title.
  TitleData?: TitleData;
  // User specific custom data.
  UserData?: UserData;
  // The version of the UserData that was returned.
  UserDataVersion?: number;
  // Array of inventory items in the user's current inventory.
  UserInventory?: UserInventory;
  // User specific read-only data.
  UserReadOnlyData?: UserData;
  // The version of the Read-Only UserData that was returned.
  UserReadOnlyDataVersion?: number;
  // Dictionary of virtual currency balance(s) belonging to the user.
  UserVirtualCurrency?: Currencies;
};

export type UserContextType = {
  account?: UserAccountInfo;
  currencies?: Currencies;
  customId?: string;
  inventory?: UserInventory;
  isLoggedIn: boolean;
  playFabId?: string;
  profile?: PlayerProfile;
  publisherData?: UserData;
  stats?: Stats;
  refetchPlayer: () => Promise<UserInfo | undefined>;
};

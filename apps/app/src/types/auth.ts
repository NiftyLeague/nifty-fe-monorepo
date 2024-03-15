export type Nonce = `0x${string}` | undefined;

export type UUID_Token = `${string}-${string}-${string}-${string}-${string}-${string}-${string}-${string}` | undefined;

export type AUTH_Token = string | undefined;

export type USER_ID = string | undefined;

export type AgreementAccepted = 'ACCEPTED' | 'FALSE' | undefined;

export interface InitialLoginContextProps {
  isLoggedIn: boolean;
}

export type AuthTokenContextType = InitialLoginContextProps & {
  authToken: AUTH_Token;
  handleConnectWallet: () => Promise<void>;
  isConnected: boolean;
};

'use client';

import { config, passport } from '@imtbl/sdk';

// passport.PassportModuleConfiguration
interface PassportModuleConfiguration {
  baseConfig: config.ImmutableConfiguration;
  clientId: string; // The unique identifier of the application that was registered in the Immutable Developer Hub
  logoutRedirectUri?: string; // defaults to first logout redirect URI specified in the Immutable Developer Hub
  logoutMode?: 'redirect' | 'silent'; // defaults to 'redirect'
  redirectUri: string;
  scope?: string;
  audience?: string;
}

// These keys are safe for client-side applications
const env = {
  testnet: {
    IMX_CLIENT_ID: 'wB47MSGL2yi9hiyUE7qvA68XdIQMV1Xj',
    IMX_PUBLISHABLE_KEY: 'pk_imapik-test-Fo0z-vUsq_93RNPyIvjg',
  },
  mainnet: {
    IMX_CLIENT_ID: 'sQqgR58yezcluL3g3KcToeQGUXxMjZBO',
    IMX_PUBLISHABLE_KEY: 'pk_imapik-83y1jz0yXZg0cZKpHF-4',
  },
};

const baseURL = typeof window !== 'undefined' && window?.location?.origin;
const environment =
  process.env.NEXT_PUBLIC_VERCEL_ENV === 'production' ? config.Environment.PRODUCTION : config.Environment.SANDBOX;

const passportConfig: PassportModuleConfiguration = {
  baseConfig: {
    environment,
    publishableKey:
      environment === config.Environment.PRODUCTION ? env.mainnet.IMX_PUBLISHABLE_KEY : env.testnet.IMX_PUBLISHABLE_KEY,
  },
  clientId: environment === config.Environment.PRODUCTION ? env.mainnet.IMX_CLIENT_ID : env.testnet.IMX_CLIENT_ID,
  logoutMode: 'redirect',
  logoutRedirectUri: `${baseURL}/logout`,
  redirectUri: `${baseURL}/redirect`,
  scope: 'openid offline_access email transact',
  audience: 'platform_api',
};

const passportInstance: passport.Passport = new passport.Passport(passportConfig);
export const passportEnv: config.Environment = environment;
export default passportInstance;

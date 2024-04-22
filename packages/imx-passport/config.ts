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

const env = {
  IMX_CLIENT_ID: 'wB47MSGL2yi9hiyUE7qvA68XdIQMV1Xj',
  IMX_PUBLISHABLE_KEY: 'pk_imapik-test-Fo0z-vUsq_93RNPyIvjg',
};

const baseURL = typeof window !== 'undefined' && window?.location?.origin;

const passportConfig: PassportModuleConfiguration = {
  baseConfig: {
    environment: process.env.NODE_ENV === 'production' ? config.Environment.PRODUCTION : config.Environment.SANDBOX,
    publishableKey: env.IMX_PUBLISHABLE_KEY,
  },
  clientId: env.IMX_CLIENT_ID,
  logoutRedirectUri: `${baseURL}/logout`,
  logoutMode: 'redirect',
  redirectUri: `${baseURL}/redirect`,
  scope: 'openid offline_access email transact',
  audience: 'platform_api',
};

const passportInstance: passport.Passport = new passport.Passport(passportConfig);

export default passportInstance;

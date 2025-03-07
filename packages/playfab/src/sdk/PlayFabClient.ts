/// <reference path="./typings/PlayFabClient.d.ts" />

import type { User } from '../types';
import * as PlayFab from './PlayFab';

export const settings = PlayFab.settings;

export const IsClientLoggedIn = (user?: User): boolean => {
  if (!user || !user.SessionTicket || !user.EntityToken?.TokenExpiration) return false;
  const expiration = new Date(user.EntityToken.TokenExpiration);
  const expired = expiration < new Date();
  return !expired && user.SessionTicket.length > 0 ? true : false;
};

export const AddGenericID: PlayFabClientModule.IPlayFabClient['AddGenericID'] = (request, callback, SessionTicket) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/AddGenericID',
    request,
    'X-Authorization',
    SessionTicket,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const AddOrUpdateContactEmail: PlayFabClientModule.IPlayFabClient['AddOrUpdateContactEmail'] = (
  request,
  callback,
  SessionTicket,
) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/AddOrUpdateContactEmail',
    request,
    'X-Authorization',
    SessionTicket,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const GetAccountInfo: PlayFabClientModule.IPlayFabClient['GetAccountInfo'] = (
  request,
  callback,
  SessionTicket,
) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/GetAccountInfo',
    request,
    'X-Authorization',
    SessionTicket,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const GetPlayerCombinedInfo: PlayFabClientModule.IPlayFabClient['GetPlayerCombinedInfo'] = (
  request,
  callback,
  SessionTicket,
) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/GetPlayerCombinedInfo',
    request,
    'X-Authorization',
    SessionTicket,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const GetUserPublisherReadOnlyData: PlayFabClientModule.IPlayFabClient['GetUserPublisherReadOnlyData'] = (
  request,
  callback,
  SessionTicket,
) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/GetUserPublisherReadOnlyData',
    request,
    'X-Authorization',
    SessionTicket,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const LinkApple: PlayFabClientModule.IPlayFabClient['LinkApple'] = (request, callback, SessionTicket) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/LinkApple',
    request,
    'X-Authorization',
    SessionTicket,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback != null) {
        callback(error, result);
      }
    },
  );
};

export const LinkCustomID: PlayFabClientModule.IPlayFabClient['LinkCustomID'] = (request, callback, SessionTicket) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/LinkCustomID',
    request,
    'X-Authorization',
    SessionTicket,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const LinkFacebookAccount: PlayFabClientModule.IPlayFabClient['LinkFacebookAccount'] = (
  request,
  callback,
  SessionTicket,
) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/LinkFacebookAccount',
    request,
    'X-Authorization',
    SessionTicket,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const LinkGoogleAccount: PlayFabClientModule.IPlayFabClient['LinkGoogleAccount'] = (
  request,
  callback,
  SessionTicket,
) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/LinkGoogleAccount',
    request,
    'X-Authorization',
    SessionTicket,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const LinkTwitch: PlayFabClientModule.IPlayFabClient['LinkTwitch'] = (request, callback, SessionTicket) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/LinkTwitch',
    request,
    'X-Authorization',
    SessionTicket,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const LoginWithApple: PlayFabClientModule.IPlayFabClient['LoginWithApple'] = (request, callback) => {
  const req = { ...request };
  req.TitleId = PlayFab.settings.titleId;
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/LoginWithApple',
    req,
    null,
    null,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const LoginWithCustomID: PlayFabClientModule.IPlayFabClient['LoginWithCustomID'] = (request, callback) => {
  const req = { ...request };
  req.TitleId = PlayFab.settings.titleId;
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/LoginWithCustomID',
    req,
    null,
    null,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const LoginWithEmailAddress: PlayFabClientModule.IPlayFabClient['LoginWithEmailAddress'] = (
  request,
  callback,
) => {
  const req = { ...request };
  req.TitleId = PlayFab.settings.titleId;
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/LoginWithEmailAddress',
    req,
    null,
    null,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const LoginWithFacebook: PlayFabClientModule.IPlayFabClient['LoginWithFacebook'] = (request, callback) => {
  const req = { ...request };
  req.TitleId = PlayFab.settings.titleId;
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/LoginWithFacebook',
    req,
    null,
    null,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const LoginWithGoogleAccount: PlayFabClientModule.IPlayFabClient['LoginWithGoogleAccount'] = (
  request,
  callback,
) => {
  const req = { ...request };
  req.TitleId = PlayFab.settings.titleId;
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/LoginWithGoogleAccount',
    req,
    null,
    null,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const LoginWithPlayFab: PlayFabClientModule.IPlayFabClient['LoginWithPlayFab'] = (request, callback) => {
  const req = { ...request };
  req.TitleId = PlayFab.settings.titleId;
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/LoginWithPlayFab',
    req,
    null,
    null,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const LoginWithTwitch: PlayFabClientModule.IPlayFabClient['LoginWithTwitch'] = (request, callback) => {
  const req = { ...request };
  req.TitleId = PlayFab.settings.titleId;
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/LoginWithTwitch',
    req,
    null,
    null,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const RegisterPlayFabUser: PlayFabClientModule.IPlayFabClient['RegisterPlayFabUser'] = (request, callback) => {
  const req = { ...request };
  req.TitleId = PlayFab.settings.titleId;
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/RegisterPlayFabUser',
    req,
    null,
    null,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const SendAccountRecoveryEmail: PlayFabClientModule.IPlayFabClient['SendAccountRecoveryEmail'] = (
  request,
  callback,
) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/SendAccountRecoveryEmail',
    request,
    null,
    null,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const UnlinkApple: PlayFabClientModule.IPlayFabClient['UnlinkApple'] = (request, callback, SessionTicket) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/UnlinkApple',
    request,
    'X-Authorization',
    SessionTicket,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback != null) {
        callback(error, result);
      }
    },
  );
};

export const UnlinkCustomID: PlayFabClientModule.IPlayFabClient['UnlinkCustomID'] = (
  request,
  callback,
  SessionTicket,
) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/UnlinkCustomID',
    request,
    'X-Authorization',
    SessionTicket,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const UnlinkFacebookAccount: PlayFabClientModule.IPlayFabClient['UnlinkFacebookAccount'] = (
  request,
  callback,
  SessionTicket,
) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/UnlinkFacebookAccount',
    request,
    'X-Authorization',
    SessionTicket,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const UnlinkGoogleAccount: PlayFabClientModule.IPlayFabClient['UnlinkGoogleAccount'] = (
  request,
  callback,
  SessionTicket,
) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/UnlinkGoogleAccount',
    request,
    'X-Authorization',
    SessionTicket,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const UnlinkTwitch: PlayFabClientModule.IPlayFabClient['UnlinkTwitch'] = (request, callback, SessionTicket) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/UnlinkTwitch',
    request,
    'X-Authorization',
    SessionTicket,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const UpdateAvatarUrl: PlayFabClientModule.IPlayFabClient['UpdateAvatarUrl'] = (
  request,
  callback,
  SessionTicket,
) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/UpdateAvatarUrl',
    request,
    'X-Authorization',
    SessionTicket,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

export const UpdateUserPublisherData: PlayFabClientModule.IPlayFabClient['UpdateUserPublisherData'] = (
  request,
  callback,
  SessionTicket,
) => {
  PlayFab.MakeRequest(
    PlayFab.GetServerUrl() + '/Client/UpdateUserPublisherData',
    request,
    'X-Authorization',
    SessionTicket,
    function (error: PlayFabModule.IPlayFabError, result: any) {
      if (callback) callback(error, result);
    },
  );
};

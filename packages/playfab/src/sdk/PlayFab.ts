/// <reference path="./typings/PlayFab.d.ts" />

import https from 'https';
import type { PlayFabError, PlayFabResponse } from '../types';

export const sdk_version = '2.125.230428';
export const api_version = '';
export const buildIdentifier = 'adobuild_nodesdk_118';

type RequestGetParams = { [key: string]: string };
interface Settings extends Omit<PlayFabModule.IPlayFabSettings, 'verticalName'> {
  verticalName: null | string;
  requestGetParams: RequestGetParams;
}

export const settings: Settings = {
  productionUrl: '.playfabapi.com',
  verticalName: null, // The name of a customer vertical. This is only for customers running a private cluster. Generally you shouldn't touch this
  titleId: '', // You must set this value for PlayFabSdk to work properly (Found in the Game Manager for your title, at the PlayFab Website)
  developerSecretKey: undefined, // You must set this value for PlayFabSdk to work properly (Found in the Game Manager for your title, at the PlayFab Website)
  port: 443,
  requestGetParams: { sdk: `NodeSDK-${sdk_version}` },
};

export function GetServerUrl(): string {
  const baseUrl = settings.productionUrl as string;
  if (!(baseUrl.substring(0, 4) === 'http')) {
    if (settings.verticalName) {
      return 'https://' + settings.verticalName + baseUrl;
    } else {
      return 'https://' + settings.titleId + baseUrl;
    }
  } else {
    return baseUrl;
  }
}

export function MakeRequest<
  TRequest = unknown,
  TResponse extends PlayFabModule.IPlayFabResultCommon = PlayFabModule.IPlayFabResultCommon,
>(
  urlStr: string,
  request: TRequest,
  authType: string | null,
  authValue: string | null,
  callback: (error: PlayFabError, result: PlayFabResponse<TResponse>) => void,
): void {
  if (request == null) request = {} as TRequest;
  const requestBody = Buffer.from(JSON.stringify(request), 'utf8');

  const urlArr = [urlStr]; //make a new array for the URL
  const getParams = settings.requestGetParams;
  if (getParams != null) {
    let firstParam = true;
    for (const key in getParams) {
      if (firstParam) {
        urlArr.push('?');
        firstParam = false;
      } else {
        urlArr.push('&');
      }
      urlArr.push(key);
      urlArr.push('=');
      urlArr.push(getParams[key] as string);
    }
  }

  const completeUrl = urlArr.join('');
  const url = new URL(completeUrl);

  if (url.protocol !== 'https:') {
    throw new Error('Unsupported protocol: ' + url.protocol);
  }

  // Define headers with proper type
  interface Headers {
    'Content-Type': string;
    'Content-Length': number;
    'X-PlayFabSDK': string;
    [key: string]: string | number | string[];
  }

  // Ensure sdk is always a string
  const sdk = settings.requestGetParams.sdk || '';

  const headers: Headers = {
    'Content-Type': 'application/json',
    'Content-Length': requestBody.length,
    'X-PlayFabSDK': sdk,
  };

  if (authType && authValue) {
    headers[authType] = authValue;
  }

  const options: https.RequestOptions = {
    hostname: url.hostname,
    port: url.port ? parseInt(url.port, 10) : settings.port,
    path: url.pathname + url.search,
    method: 'POST',
    headers,
  };

  const postReq = https.request(options, function (res) {
    let rawReply = '';
    res.setEncoding('utf8');
    res.on('data', function (chunk: string) {
      rawReply += chunk;
    });
    res.on('end', function () {
      if (callback == null) {
        return; // No need to bother decoding results
      }

      let replyEnvelope: PlayFabResponse<TResponse> | null = null;
      try {
        replyEnvelope = JSON.parse(rawReply);
      } catch (e) {
        // Handle when rawReply is not valid json
        const error: PlayFabError = {
          code: 503, // Service Unavailable
          status: 'Service Unavailable',
          error: 'Connection error',
          errorCode: 2, // PlayFabErrorCode.ConnectionError
          errorMessage: rawReply,
        };
        callback(error, null);
        return;
      }

      if (
        Object.prototype.hasOwnProperty.call(replyEnvelope, 'error') ||
        !Object.prototype.hasOwnProperty.call(replyEnvelope, 'data')
      ) {
        callback(replyEnvelope as PlayFabError, null);
      } else {
        callback(null, replyEnvelope);
      }
    });
  });

  postReq.on('error', function (e) {
    if (callback == null) {
      return; // No need to bother decoding results
    }

    const error: PlayFabError = {
      code: 503, // Service Unavailable
      status: 'Service Unavailable',
      error: 'Connection error',
      errorCode: 2, // PlayFabErrorCode.ConnectionError
      errorMessage: e.message,
    };
    callback(error, null);
  });

  postReq.write(requestBody);
  postReq.end();
}

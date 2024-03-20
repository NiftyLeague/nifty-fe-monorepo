/// <reference path="./typings/PlayFab.d.ts" />

import url from 'url';
import https from 'https';

export const sdk_version = '2.125.230428';
export const api_version = '';
export const buildIdentifier = 'adobuild_nodesdk_118';

type RequestGetParams = { [key: string]: string };
export interface Settings extends Omit<PlayFabModule.IPlayFabSettings, 'verticalName'> {
  verticalName: null | string;
  requestGetParams: RequestGetParams;
}
export const settings: Settings = {
  productionUrl: '.playfabapi.com',
  verticalName: null, // The name of a customer vertical. This is only for customers running a private cluster. Generally you shouldn't touch this
  titleId: '', // You must set this value for PlayFabSdk to work properly (Found in the Game Manager for your title, at the PlayFab Website)
  developerSecretKey: undefined, // You must set this value for PlayFabSdk to work properly (Found in the Game Manager for your title, at the PlayFab Website)
  port: 443,
  requestGetParams: {
    sdk: `NodeSDK-${sdk_version}`,
  },
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

export function MakeRequest(
  urlStr: string,
  request: any,
  authType: string | null,
  authValue: string | null,
  callback: (error: any, result: any) => void,
) {
  if (request == null) request = {};
  const requestBody = Buffer.from(JSON.stringify(request), 'utf8');

  const urlArr = [urlStr]; //make a new array for the URL
  const getParams = settings.requestGetParams;
  if (getParams != null) {
    let firstParam = true;
    for (let key in getParams) {
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
  const options: https.RequestOptions = url.parse(completeUrl);
  if (options.protocol !== 'https:') {
    throw new Error('Unsupported protocol: ' + options.protocol);
  }
  options.method = 'POST';
  options.port = options.port || settings.port;
  options.headers = {
    'Content-Type': 'application/json',
    'Content-Length': requestBody.length,
    'X-PlayFabSDK': settings.requestGetParams.sdk,
  };

  if (authType && authValue) {
    options.headers[authType] = authValue;
  }

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

      let replyEnvelope = null;
      try {
        replyEnvelope = JSON.parse(rawReply);
      } catch (e) {
        // Handle when rawReply is not valid json
        replyEnvelope = {
          code: 503, // Service Unavailable
          status: 'Service Unavailable',
          error: 'Connection error',
          errorCode: 2, // PlayFabErrorCode.ConnectionError
          errorMessage: rawReply,
        };
      }

      if (replyEnvelope.hasOwnProperty('error') || !replyEnvelope.hasOwnProperty('data')) {
        callback(replyEnvelope, null);
      } else {
        callback(null, replyEnvelope);
      }
    });
  });

  postReq.on('error', function (e) {
    if (callback == null) {
      return; // No need to bother decoding results
    }

    callback(
      {
        code: 503, // Service Unavailable
        status: 'Service Unavailable',
        error: 'Connection error',
        errorCode: 2, // PlayFabErrorCode.ConnectionError
        errorMessage: e.message,
      },
      null,
    );
  });

  postReq.write(requestBody);
  postReq.end();
}

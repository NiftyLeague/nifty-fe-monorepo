import { EventEmitter } from 'node:events';
import https from 'node:https';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { GetServerUrl, MakeRequest, settings } from './PlayFab';

function mockHttpsRequest(reply: string) {
  return vi.spyOn(https, 'request').mockImplementation(((
    options: https.RequestOptions,
    callback: (res: EventEmitter) => void,
  ) => {
    const request = new EventEmitter() as EventEmitter & {
      write: ReturnType<typeof vi.fn>;
      end: ReturnType<typeof vi.fn>;
    };
    request.write = vi.fn();
    request.end = vi.fn(() => {
      const response = new EventEmitter() as EventEmitter & { setEncoding: ReturnType<typeof vi.fn> };
      response.setEncoding = vi.fn();
      callback(response);
      response.emit('data', reply);
      response.emit('end');
    });
    Object.assign(request, { options });
    return request as never;
  }) as never);
}

afterEach(() => {
  settings.productionUrl = '.playfabapi.com';
  settings.verticalName = null;
  settings.titleId = '';
});

describe('GetServerUrl', () => {
  it('supports public, vertical, and explicit service URLs', () => {
    settings.titleId = 'TITLE';
    expect(GetServerUrl()).toBe('https://TITLE.playfabapi.com');
    settings.verticalName = 'private';
    expect(GetServerUrl()).toBe('https://private.playfabapi.com');
    settings.productionUrl = 'https://playfab.example.test';
    expect(GetServerUrl()).toBe('https://playfab.example.test');
  });
});

describe('MakeRequest', () => {
  it('posts JSON with authentication and returns successful envelopes', () => {
    const requestSpy = mockHttpsRequest('{"code":200,"data":{"value":7}}');
    const callback = vi.fn();

    MakeRequest('https://title.playfabapi.com/Client/Test', { input: true }, 'X-Authorization', 'ticket', callback);

    expect(requestSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        hostname: 'title.playfabapi.com',
        method: 'POST',
        path: expect.stringContaining('/Client/Test?sdk='),
        headers: expect.objectContaining({ 'X-Authorization': 'ticket' }),
      }),
      expect.any(Function),
    );
    expect(callback).toHaveBeenCalledWith(null, expect.objectContaining({ data: { value: 7 } }));
  });

  it('returns service and invalid-JSON errors through the callback', () => {
    const serviceCallback = vi.fn();
    mockHttpsRequest('{"code":400,"error":"BadRequest","errorMessage":"bad"}');
    MakeRequest('https://title.playfabapi.com/Test', {}, null, null, serviceCallback);
    expect(serviceCallback).toHaveBeenCalledWith(expect.objectContaining({ error: 'BadRequest' }), null);

    vi.restoreAllMocks();
    const invalidCallback = vi.fn();
    mockHttpsRequest('not-json');
    MakeRequest('https://title.playfabapi.com/Test', {}, null, null, invalidCallback);
    expect(invalidCallback).toHaveBeenCalledWith(
      expect.objectContaining({ code: 503, errorMessage: 'not-json' }),
      null,
    );
  });

  it('rejects insecure protocols before sending a request', () => {
    expect(() => MakeRequest('http://title.playfabapi.com/Test', {}, null, null, vi.fn())).toThrow(
      'Unsupported protocol: http:',
    );
  });

  it('converts transport errors into PlayFab connection errors', () => {
    vi.spyOn(https, 'request').mockImplementation((() => {
      const request = new EventEmitter() as EventEmitter & {
        write: ReturnType<typeof vi.fn>;
        end: ReturnType<typeof vi.fn>;
      };
      request.write = vi.fn();
      request.end = vi.fn(() => request.emit('error', new Error('socket closed')));
      return request as never;
    }) as never);
    const callback = vi.fn();

    MakeRequest('https://title.playfabapi.com/Test', {}, null, null, callback);
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ code: 503, errorMessage: 'socket closed' }), null);
  });
});

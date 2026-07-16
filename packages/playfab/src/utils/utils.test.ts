// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { errorMsgHandler, errorResHandler } from './errorHandlers';
import { FetchError, fetchJson } from './fetchJson';
import { getRandomKey } from './getRandomKey';
import { parseLinkedWalletResult, safeJSONParse } from './parseData';
import { isEthereumSignatureValid } from './wallet';

describe('fetchJson', () => {
  beforeEach(() => vi.unstubAllGlobals());

  it('returns JSON from successful responses', async () => {
    const response = new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

    await expect(fetchJson('/profile')).resolves.toEqual({ ok: true });
  });

  it('throws a FetchError containing response data', async () => {
    const response = new Response(JSON.stringify({ message: 'Denied' }), {
      status: 403,
      statusText: 'Forbidden',
      headers: { 'content-type': 'application/json' },
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

    await expect(fetchJson('/profile')).rejects.toMatchObject({
      name: 'FetchError',
      message: 'Forbidden',
      data: { message: 'Denied' },
    });
  });
});

describe('PlayFab utility helpers', () => {
  it('normalizes response and message errors', () => {
    const response = new Response(null, { status: 500 });
    const fetchError = new FetchError({ message: 'Request failed', response, data: { message: 'Try again' } });

    expect(errorMsgHandler(fetchError)).toBe('Try again');
    expect(errorMsgHandler({ errorMessage: 'PlayFab failed' })).toBe('PlayFab failed');
    expect(errorMsgHandler({ message: 'Plain failed' })).toBe('Plain failed');
    expect(errorResHandler(new Error('Unexpected'))).toEqual({ status: 500, message: 'Unexpected' });
    expect(errorResHandler({ code: 429, errorMessage: 'Slow down' })).toEqual({ status: 429, message: 'Slow down' });
  });

  it('parses stored wallet data and safely handles invalid JSON', () => {
    expect(safeJSONParse('["ethereum:0xabc"]')).toEqual(['ethereum:0xabc']);
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(safeJSONParse('invalid')).toEqual([]);
    expect(parseLinkedWalletResult({ LinkedWallets: { LastUpdated: 'now', Value: '["ethereum:0xdef"]' } })).toEqual([
      'ethereum:0xdef',
    ]);
    expect(parseLinkedWalletResult()).toEqual([]);
  });

  it('creates browser-safe random identifiers', () => {
    expect(getRandomKey(32)).toMatch(/^[A-Za-z0-9]{32}$/);
  });

  it('rejects incomplete signatures and accepts complete inputs', async () => {
    await expect(isEthereumSignatureValid('', 'sig', 'nonce')).resolves.toBe(false);
    await expect(isEthereumSignatureValid('0xabc', 'sig', 'nonce')).resolves.toBe(true);
  });
});

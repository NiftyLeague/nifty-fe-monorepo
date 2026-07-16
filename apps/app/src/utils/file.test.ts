import { beforeEach, describe, expect, it, vi } from 'vitest';

const { saveAsMock } = vi.hoisted(() => ({ saveAsMock: vi.fn() }));

vi.mock('save-as', () => ({ saveAs: saveAsMock }));
vi.mock('@/constants/url', () => ({ DEGEN_ASSETS_DOWNLOAD_URL: 'https://assets.example/degen' }));

import { downloadDegenAsZip } from './file';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('downloadDegenAsZip', () => {
  it('downloads base64 data and saves it as a ZIP blob', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ text: vi.fn().mockResolvedValue('UEs=') });
    vi.stubGlobal('fetch', fetchMock);

    await downloadDegenAsZip('auth-token', 42);

    expect(fetchMock).toHaveBeenCalledWith('https://assets.example/degen?id=42', {
      headers: { authorizationToken: 'auth-token' },
    });
    const [blob, filename] = saveAsMock.mock.calls[0] as [Blob, string];
    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('application/zip');
    expect(blob.size).toBe(2);
    expect(filename).toBe('degen_42.zip');
  });

  it('rejects when invoked without a browser window', async () => {
    const currentWindow = window;
    vi.stubGlobal('window', undefined);

    await expect(downloadDegenAsZip('token', 1)).rejects.toThrow('Window undefined');
    vi.stubGlobal('window', currentWindow);
  });
});

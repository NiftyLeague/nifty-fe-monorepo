import type { PlayFabError } from '../types';
import { FetchError } from './fetchJson';

export function errorResHandler(e: unknown): { status: number; message: string } {
  if (e instanceof Error) {
    return { status: 500, message: (e as Error).message };
  } else {
    return { status: (e as PlayFabError)?.code ?? 500, message: (e as PlayFabError)?.errorMessage ?? 'Unknown error' };
  }
}

export function errorMsgHandler(e: unknown): string {
  if (e instanceof Error) {
    if ((e as FetchError)?.data?.message) {
      return `${(e as FetchError).data.message}`;
    }
    return e.message;
  } else if ((e as PlayFabError)?.errorMessage) {
    return `${(e as PlayFabError)?.errorMessage ?? 'Unknown error'}`;
  } else if ((e as unknown as { message: string })?.message) {
    return `${(e as unknown as { message: string }).message}`;
  } else {
    console.error(e);
    return `Unknown error: ${e}`;
  }
}

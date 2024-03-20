import type { PlayFabError } from '@/lib/playfab/types';
import { FetchError } from '@/lib/playfab/utils/fetchJson';

export function errorResHandler(e: unknown): {
  status: number;
  message: string;
} {
  if (e instanceof Error) {
    return { status: 500, message: (e as Error).message };
  } else {
    return {
      status: (e as PlayFabError).code,
      message: (e as PlayFabError).errorMessage,
    };
  }
}

export function errorMsgHandler(e: unknown): string {
  if (e instanceof Error) {
    if ((e as FetchError)?.data?.message) {
      return `${(e as FetchError).data.message}`;
    }
    return e.message;
  } else if ((e as PlayFabError)?.errorMessage) {
    return `${(e as PlayFabError).errorMessage}`;
  } else if ((e as any)?.message) {
    return `${(e as any).message}`;
  } else {
    console.error(e);
    return `Unknown error: ${e}`;
  }
}

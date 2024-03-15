'use client';

import { useEffect, useRef } from 'react';
import { setIntervalAsync, clearIntervalAsync } from 'set-interval-async/dynamic';

export default function useAsyncInterval(
  callback: () => Promise<void>,
  delay: number | undefined,
  leading = true,
  refreshKey = '',
): void {
  const savedCallback = useRef(callback);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    const tick = async () => {
      const { current } = savedCallback;
      if (current) await current();
    };

    const handleInterval = async () => {
      if (leading) await tick();
      const id = setIntervalAsync(tick, delay as number);
      return async () => {
        await clearIntervalAsync(id);
      };
    };

    if (delay) {
      // eslint-disable-next-line no-void
      void handleInterval();
    }
    return undefined;
  }, [delay, leading]);

  // Optional manual refresh keys
  useEffect(() => {
    const handleCallback = async () => {
      const { current } = savedCallback;
      if (current) await current();
    };
    // eslint-disable-next-line no-void
    if (refreshKey) void handleCallback();
  }, [refreshKey]);
}

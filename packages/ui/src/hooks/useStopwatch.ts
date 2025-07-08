'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export const STATUS = { RUNNING: 'running', PAUSED: 'paused', STOPPED: 'stopped' };

type Timer = { ts: number; ms?: number };

interface HookParams {
  interval?: number;
  onStop?: (Timer: Timer) => void;
  onStart?: (Timer: Timer) => void;
  onPause?: (Timer: Timer) => void;
  onRestart?: (Timer: Timer) => void;
}

type ReturnType = {
  milliseconds: number;
  status: string;
  start: () => void;
  pause: () => void;
  stop: () => void;
  restart: () => void;
};

function useStopwatch({ interval = 10, onStop, onStart, onPause, onRestart }: HookParams): ReturnType {
  const stopwatchRef = useRef<number | null>(null);
  const [status, setStatus] = useState(STATUS.STOPPED);
  const [milliseconds, setMilliseconds] = useState(0);
  const msRef = useRef(milliseconds);
  msRef.current = milliseconds;

  const restart = useCallback(() => {
    const ts = Date.now();
    const msCache = msRef.current;
    setMilliseconds(0);
    setStatus(STATUS.RUNNING);
    if (onRestart) onRestart({ ts, ms: msCache });
  }, [onRestart]);

  const start = useCallback(() => {
    const ts = Date.now();
    setStatus(STATUS.RUNNING);
    if (onStart) onStart({ ts });
  }, [onStart]);

  const pause = useCallback(() => {
    const ts = Date.now();
    setStatus(STATUS.PAUSED);
    if (onPause) onPause({ ts, ms: msRef.current });
  }, [onPause]);

  const stop = useCallback(() => {
    setStatus(STATUS.STOPPED);
    const ts = Date.now();
    const msCache = msRef.current;
    setMilliseconds(0);
    if (onStop) onStop({ ts, ms: msCache });
  }, [onStop]);

  const setStopwatch = useCallback(() => {
    if (stopwatchRef.current) {
      clearInterval(stopwatchRef.current);
    }
    const id = setInterval(() => {
      setMilliseconds(msRef.current + interval);
    }, interval) as unknown as number;
    stopwatchRef.current = id;
  }, [interval]);

  useEffect(() => {
    if (status === STATUS.RUNNING) {
      setStopwatch();
    } else if (status === STATUS.STOPPED || status === STATUS.PAUSED) {
      if (stopwatchRef.current !== null) {
        clearInterval(stopwatchRef.current);
        stopwatchRef.current = null;
      }
    }

    return () => {
      if (stopwatchRef.current !== null) {
        clearInterval(stopwatchRef.current);
      }
    };
  }, [status, setStopwatch]);

  return { milliseconds, status, start, pause, stop, restart };
}

export default useStopwatch;

'use client';

import { useEffect, useReducer, useRef } from 'react';

interface State<T> {
  loading?: boolean;
  data?: T;
  error?: Error;
}

type Cache<T> = { [url: string]: T };

// discriminated union type
type Action<T> = { type: 'loading' } | { type: 'fetched'; payload: T } | { type: 'error'; payload: Error };

const initialState: State<unknown> = {
  loading: undefined,
  error: undefined,
  data: undefined,
};

// Keep state logic separated
function fetchReducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'loading':
      return { ...initialState, loading: true } as State<T>;
    case 'fetched':
      return { ...initialState, loading: false, data: action.payload } as State<T>;
    case 'error':
      return { ...initialState, loading: false, error: action.payload } as State<T>;
    default:
      return state;
  }
}

type Options = RequestInit & {
  enabled?: boolean;
};

function useFetch<T = unknown>(url?: string, options?: Options, textOnly = false): State<T> {
  const cache = useRef<Cache<T>>({});

  // Used to prevent state update if the component is unmounted
  const cancelRequest = useRef<boolean>(false);

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    // Do nothing if the url is not given
    if (!url) return;
    if (options?.enabled === false) return;

    const fetchData = async () => {
      dispatch({ type: 'loading' });

      // If a cache exists for this url, return it
      if (cache.current[url]) {
        dispatch({ type: 'fetched', payload: cache.current[url] });
        return;
      }

      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = (textOnly ? await response.text() : await response.json()) as T;
        cache.current[url] = data;

        dispatch({ type: 'fetched', payload: data });
      } catch (error) {
        if (cancelRequest.current) return;

        dispatch({ type: 'error', payload: error as Error });
      }
    };

    fetchData();

    // Use the cleanup function for avoiding a possibly...
    // ...state update after the component was unmounted
    // eslint-disable-next-line consistent-return
    return () => {
      cancelRequest.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, options?.enabled]);

  return state as State<T>;
}

export default useFetch;

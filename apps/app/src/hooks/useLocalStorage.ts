'use client';

import { Dispatch, SetStateAction, useCallback, useEffect, useState, useRef } from 'react';
import isEqual from 'lodash/isEqual';
import { safeJSONParse } from '@/utils/json';

// ==============================|| Local Storage Hook ||============================== //

export default function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, () => void] {
  const isEqualRef = useRef(false);
  // Initialize value in state in order to prevent SSR inconsistencies and errors.
  // This will update the state with the value found in localStorage or initialValue.
  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      const storageValue = safeJSONParse(item) as T;
      isEqualRef.current = isEqual(storageValue, initialValue);
      return item ? storageValue : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  // Instead of replacing the setState function, react to changes.
  // Whenever the state value changes, save it in the local storage.
  useEffect(() => {
    if (typeof window !== 'undefined' && storedValue && isEqualRef.current === false) {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    }
  }, [storedValue, key]);

  const clearStoredValue = useCallback(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
      setStoredValue(undefined);
    }
  }, [key]);

  return [storedValue, setStoredValue, clearStoredValue];
}

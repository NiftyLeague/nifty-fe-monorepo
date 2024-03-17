'use client';

import { Dispatch, SetStateAction, useEffect, useState } from 'react';

// ==============================|| Local Storage Hook ||============================== //

export default function useSetLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Instead of replacing the setState function, react to changes.
  // Whenever the state value changes, save it in the local storage.
  useEffect(() => {
    if (typeof window !== 'undefined' && storedValue) {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    }
  }, [storedValue, key]);

  return [storedValue, setStoredValue];
}

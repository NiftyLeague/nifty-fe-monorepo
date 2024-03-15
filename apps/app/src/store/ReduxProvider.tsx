'use client';

import { useRef, type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import type { Persistor } from 'redux-persist/es/types';

import { makeStore, AppStore } from './store';

export function ReduxProvider({ children }: PropsWithChildren) {
  const storeRef = useRef<AppStore>();
  const persistorRef = useRef<Persistor>();

  if (!storeRef.current) {
    // Create the store instance the first time this renders
    const { store, persister } = makeStore();
    storeRef.current = store;
    persistorRef.current = persister;
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistorRef.current as Persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}

export default ReduxProvider;

'use client';

import { useState, type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import type { Persistor } from 'redux-persist/es/types';

import { makeStore } from './store';

export function ReduxProvider({ children }: PropsWithChildren) {
  const [{ store, persister }] = useState(() => {
    const { store: newStore, persister: newPersister } = makeStore();
    return { store: newStore, persister: newPersister };
  });

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persister as Persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}

export default ReduxProvider;

// third-party
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import rootReducer from './reducer';

const persistConfig = {
  key: 'persist',
  storage,
};

// ==============================|| REDUX - MAIN STORE ||============================== //

const makeConfiguredStore = () =>
  configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
  });

export const makeStore = () => {
  const isServer = typeof window === 'undefined';
  if (isServer) {
    return { store: makeConfiguredStore() };
  } else {
    const persistedReducer = persistReducer(persistConfig, rootReducer);

    const store = configureStore({
      reducer: persistedReducer,
      middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
    });

    const persister = persistStore(store);

    return { store, persister };
  }
};

export type AppStore = ReturnType<typeof makeStore> extends { store: infer S } ? S : never;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// const store = configureStore({
//   reducer: persistedReducer,
//   middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false, immutableCheck: false }),
// });

// const persister = persistStore(store);

// export type RootState = ReturnType<typeof persistedReducer>;

// export type AppDispatch = typeof store.dispatch;

// const { dispatch } = store;

// const useDispatch = () => useAppDispatch<AppDispatch>();
// const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

// export { store, persister, dispatch, useSelector, useDispatch };

import { combineReducers } from '@reduxjs/toolkit';

import accountReducer from './slices/account';
import menuReducer from './slices/menu';
import snackbarReducer from './slices/snackbar';

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  account: accountReducer,
  menu: menuReducer,
  snackbar: snackbarReducer,
});

export default reducer;

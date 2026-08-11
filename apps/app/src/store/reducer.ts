import { combineReducers } from '@reduxjs/toolkit'

import accountReducer from './slices/account'
import snackbarReducer from './slices/snackbar'

// ==============================|| COMBINE REDUCER ||============================== //

const reducer = combineReducers({
  account: accountReducer,
  snackbar: snackbarReducer,
})

export default reducer

import * as PlayFabClient from './PlayFabClient'
import { configurePlayFab } from './configure'

configurePlayFab()

export { PlayFabClient }
export const IsClientLoggedIn = PlayFabClient.IsClientLoggedIn

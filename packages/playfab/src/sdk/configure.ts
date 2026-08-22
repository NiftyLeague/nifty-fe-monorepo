import { settings } from './PlayFab'

/** Configure the shared SDK settings without importing the compatibility barrel. */
export function configurePlayFab(): void {
  settings.titleId = process.env.NEXT_PUBLIC_PLAYFAB_TITLE_ID as string
  settings.developerSecretKey = process.env.PLAYFAB_API_KEY as string
}

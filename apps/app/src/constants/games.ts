export const getGameViewedAnalyticsContentId = (pathname: string) => {
  if (pathname.includes('smashers')) {
    return 'nifty_smashers'
  } else if (pathname.includes('mt-gawx')) {
    return 'mt_gawx'
  }
  return null
}

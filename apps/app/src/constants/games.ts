export const getGameViewedAnalyticsContentId = (pathname: string) => {
  if (pathname.includes('smashers')) {
    return 'nifty_smashers'
  } else if (pathname.includes('wen-game')) {
    return 'wen_game'
  } else if (pathname.includes('mt-gawx')) {
    return 'mt_gawx'
  } else if (pathname.includes('crypto-winter')) {
    return 'crypto_winter'
  }
  return null
}

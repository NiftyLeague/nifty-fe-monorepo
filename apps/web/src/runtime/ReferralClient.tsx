import { useEffect } from 'react'
import { parseReferral, referralTargets } from '../../worker/routes.mjs'

export default function ReferralClient() {
  useEffect(() => {
    const params = parseReferral(window.location.pathname)
    if (!params || params.game !== 'smashers') {
      window.location.replace('/')
      return
    }
    const targets = referralTargets(params, navigator.userAgent)
    const global = window as unknown as { dataLayer?: unknown[] }
    global.dataLayer ??= []
    global.dataLayer.push({
      event: 'game_referral',
      game_name: 'Smashers',
      invite_method: params.partyID ? 'Party Invite' : 'Invite Link',
      invitee_agent: navigator.userAgent,
      redirect_route: targets.platform,
      referrer_id: params.refcode,
    })
    let timer: ReturnType<typeof setTimeout> | undefined
    let departed = false
    const cancelFallback = () => {
      if (document.hidden) {
        departed = true
        if (timer) clearTimeout(timer)
      }
    }
    const leave = () => {
      departed = true
      if (timer) clearTimeout(timer)
    }
    document.addEventListener('visibilitychange', cancelFallback)
    window.addEventListener('pagehide', leave)
    if (targets.launchNative) {
      timer = setTimeout(() => {
        if (!departed && !document.hidden) window.location.replace(targets.store)
      }, 500)
      window.location.href = targets.native
    } else window.location.replace(targets.store)
    return () => {
      if (timer) clearTimeout(timer)
      document.removeEventListener('visibilitychange', cancelFallback)
      window.removeEventListener('pagehide', leave)
    }
  }, [])
  return <p role="status">Opening Nifty Smashers…</p>
}

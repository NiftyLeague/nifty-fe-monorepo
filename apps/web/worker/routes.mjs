const PERMANENT = new Map([
  ['/blog', 'https://niftyleague.medium.com'],
  ['/feedback', 'https://feedback.niftyleague.com'],
  ['/snapshot', 'https://snapshot.niftyleague.com'],
  ['/tally', 'https://www.tally.xyz/gov/niftyleague'],
  ['/NFTL/supply', 'https://api.niftyleague.com/NFTL/supply'],
])
const TEMPORARY = new Map([
  ['/HUB', 'https://hub.xyz/niftyleague'],
  ['/OS', 'https://opensea.io/collection/niftydegen'],
  ['/ME', 'https://magiceden.io/collections/ethereum/niftydegen'],
  ['/BLUR', 'https://blur.io/collection/niftydegen'],
])
const SHOP_PREFIXES = ['/collections', '/pages', '/products', '/cart']
const under = (pathname, prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)

export function withQuery(destination, incoming) {
  const result = new URL(destination)
  for (const [key, value] of incoming.searchParams) result.searchParams.append(key, value)
  return result.href
}

/**
 * All proxy origins are constants; request data can select only path/query.
 * @returns {{kind:'redirect',status:307|308,url:string}|{kind:'proxy',url:string}|{kind:'gltf',tokenId:string,asset:string}|{kind:'referral',asset:string}|{kind:'not-found'}|{kind:'asset'}}
 */
export function routeRequest(input, environment = 'production') {
  const url = input instanceof URL ? input : new URL(input)
  const path = url.pathname.length > 1 ? url.pathname.replace(/\/$/, '') : '/'
  if (under(path, '/shells')) return { kind: 'not-found' }

  const target = PERMANENT.get(path) ?? TEMPORARY.get(path)
  if (target)
    return {
      kind: 'redirect',
      status: PERMANENT.has(path) ? 308 : 307,
      url: withQuery(target, url),
    }

  if (path === '/app') {
    const destination =
      environment === 'development'
        ? 'http://localhost:3001'
        : `https://${environment === 'preview' ? 'staging.' : ''}app.niftyleague.com`
    return { kind: 'redirect', status: 308, url: withQuery(destination, url) }
  }
  const degen = /^\/d\/(\d+)$/.exec(path)
  if (degen)
    return {
      kind: 'redirect',
      status: 307,
      url: withQuery(
        `https://opensea.io/assets/ethereum/0x986aea67c7d6a15036e18678065eb663fc5be883/${degen[1]}`,
        url
      ),
    }

  const gltf = /^\/gltf\/(\d{1,12})$/.exec(path)
  if (gltf) return { kind: 'gltf', tokenId: gltf[1], asset: '/shells/gltf.html' }
  if (under(path, '/gltf')) return { kind: 'not-found' }
  if (/^\/invite\/[^/]+\/[^/]+$/.test(path) || /^\/party\/[^/]+\/[^/]+\/[^/]+$/.test(path))
    return { kind: 'referral', asset: '/shells/referral.html' }
  if (under(path, '/invite') || under(path, '/party')) return { kind: 'not-found' }

  if (path === '/contact')
    return { kind: 'proxy', url: withQuery('https://forms.gle/hdivQVeFDqetjrzo8', url) }
  if (path === '/shop')
    return { kind: 'proxy', url: withQuery('https://shop.niftyleague.com', url) }

  if (SHOP_PREFIXES.some((prefix) => under(path, prefix)) || path === '/account/login') {
    const proxy = new URL('https://shop.niftyleague.com')
    proxy.pathname = url.pathname
    proxy.search = url.search
    return { kind: 'proxy', url: proxy.href }
  }
  if (under(path, '/docs')) {
    const proxy = new URL(
      environment === 'development'
        ? 'http://localhost:3002'
        : `https://${environment === 'preview' ? 'staging.' : ''}docs.niftyleague.com`
    )
    // Assignment cannot interpret a //suffix as an attacker-controlled host.
    proxy.pathname = url.pathname.slice('/docs'.length) || '/'
    proxy.search = url.search
    return environment === 'development'
      ? { kind: 'redirect', status: 308, url: proxy.href }
      : { kind: 'proxy', url: proxy.href }
  }
  return { kind: 'asset' }
}

export function parseReferral(pathname) {
  const parts = pathname.replace(/\/$/, '').split('/').slice(1)
  const isParty = parts[0] === 'party'
  if ((!isParty && parts[0] !== 'invite') || parts.length !== (isParty ? 4 : 3)) return null
  try {
    const [, game, refcode, partyID] = parts.map(decodeURIComponent)
    if (!game || !refcode || refcode.length > 512 || (partyID?.length ?? 0) > 512) return null
    return { game, refcode, ...(isParty ? { partyID } : {}) }
  } catch {
    return null
  }
}

export function referralTargets(params, userAgent) {
  const ios = /iPhone|iPad|iPod/i.test(userAgent)
  const android = !ios && /Android|Mobile/i.test(userAgent)
  const store = `https://niftysmashers.com/${ios ? 'ios' : android ? 'android' : 'steam'}/?${new URLSearchParams({ referral: params.refcode })}`
  const nativeQuery = new URLSearchParams({ profile: params.refcode })
  if (params.partyID) nativeQuery.set('party', params.partyID)
  return {
    store,
    native: `niftysmashers://smashers/${params.partyID ? 'party' : 'invite'}?${nativeQuery}`,
    launchNative: params.refcode.length > 7 && (ios || android),
    platform: ios ? 'iOS App' : android ? 'Android App' : 'Web Store',
  }
}

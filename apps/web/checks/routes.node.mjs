import test from 'node:test'
import assert from 'node:assert/strict'
import { routeRequest, parseReferral, referralTargets } from '../worker/routes.mjs'
import { imageProps, candidateWidths } from '../src/runtime/image-props.mjs'

test('marketing documents stay on the static-asset path', () => {
  for (const path of ['/', '/games', '/degens', '/careers', '/privacy-policy', '/roadmap'])
    assert.equal(routeRequest(`https://niftyleague.com${path}`).kind, 'asset')
})
test('original permanent and temporary redirects retain their status and query', () => {
  for (const path of ['/blog', '/feedback', '/snapshot', '/tally', '/NFTL/supply'])
    assert.equal(routeRequest(`https://niftyleague.com${path}?utm_source=check`).status, 308)
  for (const path of ['/HUB', '/OS', '/ME', '/BLUR', '/d/123'])
    assert.equal(routeRequest(`https://niftyleague.com${path}`).status, 307)
  assert.equal(new URL(routeRequest('https://niftyleague.com/d/123?ref=a').url).search, '?ref=a')
})
test('app and docs distinguish production, preview and local development', () => {
  assert.equal(
    new URL(routeRequest('https://niftyleague.com/app', 'production').url).hostname,
    'app.niftyleague.com'
  )
  assert.equal(
    new URL(routeRequest('https://niftyleague.com/app', 'preview').url).hostname,
    'staging.app.niftyleague.com'
  )
  const docs = routeRequest('https://niftyleague.com/docs/a/b?x=1', 'preview')
  assert.deepEqual(docs, { kind: 'proxy', url: 'https://staging.docs.niftyleague.com/a/b?x=1' })
  assert.deepEqual(routeRequest('https://niftyleague.com/docs/a', 'development'), {
    kind: 'redirect',
    status: 308,
    url: 'http://localhost:3002/a',
  })
})
test('shop routes are proxies, not substitute redirects', () => {
  for (const path of [
    '/shop',
    '/collections/cards',
    '/products/card',
    '/cart/add',
    '/account/login',
  ])
    assert.equal(routeRequest(`https://niftyleague.com${path}`).kind, 'proxy')
})
test('proxy host cannot be replaced with a scheme-relative suffix', () => {
  for (const path of [
    '/docs//attacker.example',
    '/docs/%2f%2fattacker.example',
    '/products//attacker.example',
  ]) {
    const plan = routeRequest(`https://niftyleague.com${path}`)
    assert.ok(['docs.niftyleague.com', 'shop.niftyleague.com'].includes(new URL(plan.url).hostname))
  }
})
test('GLTF is a numeric leaf route; internal shells and malformed leaves are unavailable', () => {
  assert.deepEqual(routeRequest('https://niftyleague.com/gltf/9999'), {
    kind: 'gltf',
    tokenId: '9999',
    asset: '/shells/gltf.html',
  })
  for (const path of ['/gltf/nope', '/gltf/1/other', '/shells/gltf.html', '/invite/a'])
    assert.equal(routeRequest(`https://niftyleague.com${path}`).kind, 'not-found')
})
test('referral values are decoded once and encoded into destination queries', () => {
  const params = parseReferral('/party/smashers/abc%26admin%3Dtrue/party%20one')
  const targets = referralTargets(params, 'iPhone Mobile')
  assert.equal(new URL(targets.store).searchParams.get('referral'), 'abc&admin=true')
  assert.equal(new URL(targets.store).searchParams.has('admin'), false)
  assert.equal(new URL(targets.native).searchParams.get('party'), 'party one')
  assert.equal(targets.platform, 'iOS App')
})
test('desktop referrals do not attempt a native launch', () => {
  const targets = referralTargets(
    { game: 'smashers', refcode: 'long-profile-id' },
    'Mozilla Desktop'
  )
  assert.equal(targets.launchNative, false)
  assert.match(targets.store, /\/steam\/\?referral=/)
})
test('malformed percent encoding is rejected', () => {
  assert.equal(parseReferral('/invite/smashers/%zz'), null)
})
test('fixed-size images only advertise one and two-times candidates', () => {
  const props = imageProps(
    { src: '/img/a.webp', width: 128, height: 128, sizes: '128px' },
    { '/img/a.webp': { hash: 'abc', width: 1920, height: 1920 } }
  )
  assert.equal(props.srcSet, '/__images/abc-128-q75.webp 128w, /__images/abc-256-q75.webp 256w')
})
test('fluid images retain a responsive ladder and eager hero hints', () => {
  const props = imageProps(
    { src: '/img/a.webp', sizes: '100vw', quality: 60, priority: true },
    { '/img/a.webp': { hash: 'abc', width: 1920, height: 1042 } }
  )
  assert.match(props.srcSet, /384w/)
  assert.match(props.srcSet, /1920w/)
  assert.equal(props.loading, 'eager')
  assert.equal(props.fetchPriority, 'high')
})
test('unoptimized and dynamic assets still work in responsive picture sources', () => {
  assert.equal(
    imageProps({ src: '/img/degens/nfts/1.gif', width: 584 }).srcSet,
    '/img/degens/nfts/1.gif 1x'
  )
})
test('image ladders never upscale beyond the native asset', () => {
  assert.equal(candidateWidths(333).at(-1), 333)
  assert.ok(candidateWidths(333).every((width) => width <= 333))
})
test('fill styles do not erase the caller’s object-fit', () => {
  const props = imageProps({ src: '/img/a.webp', fill: true, style: { objectFit: 'contain' } })
  assert.equal(props.style.position, 'absolute')
  assert.equal(props.style.objectFit, 'contain')
  assert.equal(props.width, undefined)
})
test('unsafe image URL schemes are rejected', () => {
  assert.throws(() => imageProps({ src: 'javascript:alert(1)' }), /Unsafe/)
})

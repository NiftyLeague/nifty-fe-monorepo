!(function () {
  'use strict'
  var t,
    a = window.location,
    o = window.document,
    r = o.currentScript,
    s = 'https://c1iiz7wkq9.execute-api.us-east-1.amazonaws.com/prod/api/event',
    l = window.localStorage.p_stats_ignore,
    dataDomain = 'nifty-league.com'
  function w(t) {
    console.warn('Ignoring Event: ' + t)
  }
  function e(t, e) {
    if (
      /^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(a.hostname) ||
      'file:' === a.protocol
    )
      return w('localhost')
    if (
      !(
        window.phantom ||
        window._phantom ||
        window.__nightmare ||
        window.navigator.webdriver ||
        window.Cypress
      )
    ) {
      if ('true' == l) return w('localStorage flag')
      var i = {}
      ;((i.n = t),
        (i.u = a.href),
        (i.d = dataDomain),
        (i.r = o.referrer || null),
        (i.w = window.innerWidth),
        e && e.meta && (i.m = JSON.stringify(e.meta)),
        e && e.props && (i.p = JSON.stringify(e.props)))
      var n = new XMLHttpRequest()
      ;(n.open('POST', s, !0),
        n.setRequestHeader('Content-Type', 'text/plain'),
        n.send(JSON.stringify(i)),
        (n.onreadystatechange = function () {
          4 == n.readyState && e && e.callback && e.callback()
        }))
    }
  }
  function i() {
    t !== a.pathname && ((t = a.pathname), e('pageview'))
  }
  var n,
    p = window.history
  p.pushState &&
    ((n = p.pushState),
    (p.pushState = function () {
      ;(n.apply(this, arguments), i())
    }),
    window.addEventListener('popstate', i))
  var d = (window.p_stats && window.p_stats.q) || []
  window.p_stats = e
  for (var u = 0; u < d.length; u++) e.apply(this, d[u])
  'prerender' === o.visibilityState
    ? o.addEventListener('visibilitychange', function () {
        t || 'visible' !== o.visibilityState || i()
      })
    : i()

  var userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'],
    os = 'Unknown',
    device = 'Desktop'

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS'
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS'
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows'
  } else if (/Android/.test(userAgent)) {
    os = 'Android'
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux'
  }

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(navigator.userAgent)) {
    device = 'Tablet'
  } else if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      navigator.userAgent
    )
  ) {
    device = 'Mobile'
  }

  window.p_stats('Device', {
    props: {
      OS: os,
      Device: device,
      Screen: `${screen.width}x${screen.height}`,
      Window: `${window.innerWidth}x${window.innerHeight}`,
      Orientation: screen.width > screen.height ? 'Landscape' : 'Portrait',
    },
  })

  window.onerror = function (message, file, line, col, error) {
    console.log('custom error', message, file, line, col, error)
  }
})()

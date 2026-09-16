import * as chromeLauncher from 'chrome-launcher'

const url = process.argv[2]
const waitMs = Number(process.argv[3] ?? 15000)
const mobile = process.argv[4] === 'mobile'

const chrome = await chromeLauncher.launch({
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
})
const targets = await fetch(`http://localhost:${chrome.port}/json/new?${encodeURIComponent(url)}`, {
  method: 'PUT',
}).then((r) => r.json())
const ws = new WebSocket(targets.webSocketDebuggerUrl)
let id = 0
const pending = new Map()
const send = (method, params = {}) =>
  new Promise((res) => {
    const msgId = ++id
    pending.set(msgId, res)
    ws.send(JSON.stringify({ id: msgId, method, params }))
  })
const errors = []
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data)
  if (m.id && pending.has(m.id)) {
    pending.get(m.id)(m)
    pending.delete(m.id)
  }
  if (m.method === 'Runtime.exceptionThrown')
    errors.push(m.params.exceptionDetails?.exception?.description?.slice(0, 300))
  if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error')
    errors.push(
      'console.error: ' +
        (m.params.args?.[0]?.value ?? m.params.args?.[0]?.description ?? '')
          .toString()
          .slice(0, 200)
    )
})
await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }))
await send('Runtime.enable')
await send('Page.enable')
if (mobile)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 360,
    height: 640,
    deviceScaleFactor: 2,
    mobile: true,
  })
await new Promise((r) => setTimeout(r, waitMs))
const paint = await send('Runtime.evaluate', {
  expression: `JSON.stringify({paint: performance.getEntriesByType('paint'), html: document.body ? document.body.innerText.slice(0,200) : 'NO BODY', ready: document.readyState, visibility: getComputedStyle(document.documentElement).visibility })`,
  returnByValue: true,
})
console.log(JSON.stringify(paint.result?.result?.value ?? paint, null, 1).slice(0, 1500))
console.log('ERRORS:', errors.slice(0, 8))
await send('Target.closeTarget', { targetId: targets.id }).catch(() => {})
await chrome.kill()

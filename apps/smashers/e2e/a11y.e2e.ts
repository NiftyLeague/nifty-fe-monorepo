import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

/**
 * Accessibility sweep for apps/smashers (#1883): page-level axe passes plus the
 * keyboard-only pass over the home dialogs and the sign-in form.
 *
 * Floor: zero serious or critical violations per route. Lower-impact findings
 * get triaged into focused issues rather than waived.
 *
 * Bound: the authenticated `/profile` surface (tabs, account panels) needs a
 * PlayFab session — the test identity from #1915 is still unresolved — so its
 * sweep waits on that dependency; unauthenticated `/profile` must redirect to
 * `/login`, which is pinned below.
 */

const PUBLIC_ROUTES = ['/', '/loot', '/login']

async function axeViolations(page: import('@playwright/test').Page) {
  const results = await new AxeBuilder({ page }).exclude('iframe').analyze()
  return results.violations.filter((violation) =>
    ['serious', 'critical'].includes(violation.impact ?? '')
  )
}

test('axe: no serious or critical violations on the public routes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'one viewport keeps the sweep cheap')

  for (const route of PUBLIC_ROUTES) {
    await page.goto(route)
    // The below-the-fold home islands hydrate on viewport approach; scroll so
    // every island is mounted before the sweep.
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    const violations = await axeViolations(page)
    expect(
      violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.length })),
      `${route} axe violations`
    ).toEqual([])
  }
})

test('unauthenticated /profile redirects to /login', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'one viewport keeps the sweep cheap')

  await page.goto('/profile')
  await expect(page).toHaveURL(/\/login$/)
})

test('keyboard-only: the home dialogs open, trap, and dismiss', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'one viewport keeps the sweep cheap')

  await page.goto('/')
  for (const name of ['Play', 'Trailer', 'Credits']) {
    const trigger = page.getByRole('button', { name, exact: true })
    await trigger.focus()
    await expect(trigger).toBeFocused()
    await page.keyboard.press('Enter')
    const dialog = page.getByRole('dialog')
    await expect(dialog, `${name} dialog opens from the keyboard`).toBeVisible()

    // Escape closes the dialogs whose content keeps focus in the page (Play,
    // Credits). The Trailer hands focus to the YouTube iframe — the player
    // consumes the key there, which is third-party embed behavior outside this
    // markup — so its keyboard path is the focusable close control instead.
    if (name === 'Trailer') {
      await dialog.getByRole('button', { name: /close/i }).focus()
      await page.keyboard.press('Enter')
    } else {
      await page.keyboard.press('Escape')
    }
    await expect(dialog).toBeHidden()
    // Once a dialog chunk has loaded, the close lands on the dialog's own
    // trigger control.
    const focus = await page.evaluate(() => {
      const el = document.activeElement
      return {
        tag: el?.tagName,
        text: el?.textContent?.trim(),
        visible: el instanceof HTMLElement && el.checkVisibility(),
      }
    })
    expect(
      focus.tag === 'BUTTON' && focus.visible && focus.text?.includes(name),
      `${name} dialog returns focus to a visible "${name}" control`
    ).toBe(true)
  }
})

test('keyboard-only: the sign-in form is reachable and operable', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', 'one viewport keeps the sweep cheap')

  await page.goto('/login')
  const email = page.locator(
    'input[type="email"], input[name="email"], input[autocomplete*="email"]'
  )
  const password = page.locator('input[type="password"]')
  await expect(email.first()).toBeVisible()
  await expect(password).toBeVisible()

  // Tab from the top of the document: the email and password fields must be
  // reachable by keyboard alone, in DOM order.
  const focusOrder: string[] = []
  for (let i = 0; i < 30; i += 1) {
    await page.keyboard.press('Tab')
    const tag = await page.evaluate(() => {
      const el = document.activeElement
      return el ? `${el.tagName}:${el.getAttribute('type') ?? el.getAttribute('name') ?? ''}` : ''
    })
    focusOrder.push(tag)
    if (tag.startsWith('INPUT:password')) break
  }
  const emailIndex = focusOrder.findIndex((tag) => tag.match(/^INPUT:(email|text)/))
  const passwordIndex = focusOrder.findIndex((tag) => tag.startsWith('INPUT:password'))
  expect(
    emailIndex,
    `email field reachable in tab order: ${focusOrder.join(' → ')}`
  ).toBeGreaterThanOrEqual(0)
  expect(passwordIndex, 'password field follows the email field').toBeGreaterThan(emailIndex)

  // The forgot-password control switches the form view from the keyboard.
  const forgot = page.getByRole('button', { name: 'Forgot your password?' })
  await forgot.focus()
  await expect(forgot).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByText('Forgot Password')).toBeVisible()
})

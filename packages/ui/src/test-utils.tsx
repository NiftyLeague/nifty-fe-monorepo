/**
 * Solid test boundary shared by this package's suite. Re-exports the Solid
 * testing-library surface, adapts `render` to accept an already-created
 * element (the React call style the tests were written against), and supplies
 * `act` as a no-op — Solid applies updates synchronously, so there is no work
 * queue to flush. `renderHook` wraps the result in `{ current }` to match the
 * React Testing Library shape the ported tests assert on, and `rerender`
 * remounts a new element into the same container since Solid cannot re-render
 * a mounted tree with new props.
 */
import {
  cleanup,
  fireEvent,
  render as renderSolid,
  renderHook as renderSolidHook,
  screen,
  waitFor,
  within,
} from '@solidjs/testing-library'
import { render as mount } from 'solid-js/web'
import type { Component, JSX } from 'solid-js'

type RenderOptions = Parameters<typeof renderSolid>[1]
type Ui = JSX.Element | (() => JSX.Element)

const toUi =
  (ui: Ui): (() => JSX.Element) =>
  () =>
    typeof ui === 'function' ? (ui as () => JSX.Element)() : ui

export function render(ui: Ui, options?: RenderOptions) {
  const result = renderSolid(toUi(ui), options)
  let unmountCurrent = result.unmount

  return {
    ...result,
    unmount() {
      unmountCurrent()
    },
    rerender(next: Ui) {
      unmountCurrent()
      if (!result.container.isConnected) {
        result.baseElement?.appendChild(result.container)
      }
      unmountCurrent = mount(toUi(next), result.container)
    },
  }
}

export function renderHook<Args extends unknown[], HookResult>(
  hook: (...args: Args) => HookResult,
  options?: { initialProps?: Args; wrapper?: Component<{ children: JSX.Element }> }
) {
  // The upstream renderHook invokes `wrapper` as a plain function, so Solid
  // context providers inside it never mount. Render the wrapper as a real
  // component tree and probe the hook inside it.
  if (options?.wrapper) {
    const Wrapper = options.wrapper
    let hookResult: HookResult | undefined
    // A plain function child stays an expression, so it evaluates under the
    // provider's owner when the wrapper renders it — a component thunk would
    // bind to the wrapper's owner before context is installed.
    const probe = () => {
      hookResult = hook(...((options?.initialProps ?? []) as Args))
      return null
    }
    const rendered = render(() => (
      <Wrapper children={probe as unknown as JSX.Element} />
    ))
    return {
      result: { current: hookResult as HookResult },
      unmount: rendered.unmount,
      cleanup: rendered.unmount,
    }
  }
  const rendered = renderSolidHook(hook, options)
  return {
    ...rendered,
    result: { current: rendered.result },
    unmount: rendered.cleanup,
  }
}

export async function act(callback?: () => unknown | Promise<unknown>): Promise<void> {
  await callback?.()
}

export { cleanup, fireEvent, screen, waitFor, within }

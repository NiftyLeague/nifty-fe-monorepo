# SolidJS reactivity standards

Post-migration rules for `apps/app` (and any future Solid code) so React-era
habits do not regress the migration. These rules exist because Solid props and
context values are getter-backed: destructuring freezes the value observed at
component setup, and Solid effects do not take dependency arrays.

## Do not destructure props that can change

```tsx
// BAD — `open` is read once at setup; the dialog never opens again.
const MyDialog = ({ open, onOpenChange }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange} />
)

// GOOD — `props.open` reads through the prop getter on every evaluation.
const MyDialog = (props: Props) => <Dialog open={props.open} onOpenChange={props.onOpenChange} />
```

In Solid, a component's props object is a reactive proxy. Destructuring
(`const { open } = props`) evaluates the getter once at setup; `props.open`
inside JSX or a `createMemo`/accessor stays live. Plain object spreads
(`{ ...props }`) also freeze values — use JSX spread (`<Comp {...props}>`),
which Solid compiles to a dynamic spread, or `splitProps` / `mergeProps` when
real objects are needed.

Static-only props (labels, config literals) may be destructured, but prefer
`props.x` anyway — it removes a footgun when the prop later becomes dynamic.

## Do not destructure getter-backed context or hook values

Our contexts expose reactive state through object getters:

```tsx
// BAD — isLoggedIn freezes at setup; the guard never reacts to login.
const { isLoggedIn } = useAuthStatus()

// GOOD
const auth = useAuthStatus()
// later: auth.isLoggedIn, inside JSX/memos/effects
```

Hook returns follow the same convention (`useUserUnclaimedAmount`,
`useClaimNFTL`, `useUserClaimData`, `useNetworkContext`, `useTokensBalances`,
`useNFTsBalances`, `useComicDimension`, ...). Destructure only stable function
properties (`refreshNFTLBalance`, `claimCallback`, `setIsLoggedIn`, signal
tuples like `const [open, setOpen] = useContext(DialogContext)`).

## Solid effects have no dependency arrays

`createEffect` tracks the signals/getters read inside its body. A trailing
array is silently ignored — it is dead code, not a guard.

```ts
// BAD — the array does nothing; the effect still tracks `auth.isLoggedIn`
createEffect(() => { ... }, [auth.isLoggedIn])

// GOOD — just read reactive state inside
createEffect(() => { ... })
```

To skip the initial run, use a boolean guard or `on()`/`untrack()`; do not
reach for arrays.

## Use Show/For for reactive branches and lists

- Use `<Show when={...}>` for conditions driven by reactive state. A plain
  `cond && <Jsx />` also stays reactive inside JSX expressions, but an
  early-return `if (cond) return <Jsx />` in the component body does not — it
  runs once at setup.
- Use `<For each={items}>` for lists backed by reactive arrays so unchanged
  items keep their DOM identity. `.map()` inside JSX re-creates the whole
  subtree on every change; fine for static lists, wasteful for dynamic ones.
- Prefer accessors or `createMemo` for derived state. Do not create a signal
  and sync it in `createEffect` — that is state synchronization, the React
  pattern Solid replaces.

## Cleanup and subscriptions

- Wrap listeners/timers in `onCleanup` inside the owning effect or component.
- **Never return a cleanup function from `createEffect`.** React's
  `useEffect(() => { ...; return () => cleanup })` does not translate: a
  `createEffect` return value is passed as `prev` to the next run, not called
  on cleanup, so the cleanup is dead code. Two production bugs shipped this
  way (`useSingleCallResult` raced stale contract reads, `DeferredSentry`
  could not cancel its idle callback). Always write `onCleanup(() => ...)`.
- When an effect spawns async work, guard it with a cancellation flag so a
  re-run does not race a stale result into a signal (`useSingleCallResult`
  shows the pattern).
- `createResource` and TanStack Query are the default fetch paths; do not
  hand-roll fetch-in-effect unless the work is not resource-shaped.

## State ownership: no external store libraries

React-era store libraries are gone. `zustand` was removed in favor of plain
Solid primitives:

- Per-key persisted state (localStorage) lives in
  `apps/app/src/state/local-storage-store.ts`: one `createSignal` per key in a
  module registry, with cross-tab `storage` sync and deep-equal write guards.
- Shared UI stores (navigation drawer, snackbar) use
  `solid-js/store` `createStore` inside a context provider; components select
  through `createMemo`, and actions are stable methods on the store object.
- Do not reintroduce `zustand`, Redux, or any subscribe/snapshot store — the
  subscription bridge adds a whole-object recompute per write and hides
  Solid's fine-grained updates.
- Inside store setters that may be called from effects, read signals through
  `untrack` so the write cannot subscribe the caller's scope.

## Passing reactive inputs into non-Solid APIs

Hooks that take "maybe reactive" parameters should accept
`T | Accessor<T>` and resolve inside the tracked scope, the way
`useSingleCallResult` does. Never read a reactive value once and pass the
snapshot to a helper that re-uses it later.

## Deferred/lazy boundaries

`DeferredComponent` (`@nl/ui/custom/deferred-component`) and the app's
`@/runtime/dynamic` are the canonical code-splitting tools for client-only
features. Pass `props={{ ... }}` objects — the boundary spreads them through
`<Dynamic>` so getters stay live.

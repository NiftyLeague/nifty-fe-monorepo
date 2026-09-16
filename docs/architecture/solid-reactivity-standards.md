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
- URL state uses the local typed parsers in `apps/app/src/url/parsers.ts`
  (nuqs-compatible semantics) through the `useQueryStates` adapter — `nuqs`
  itself is a React-coupled package and must not come back as a dependency.

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

## App-global state lives in module singletons, not provider instances

Solid components do not remount to reconcile a tree, so a context provider
adds indirection without adding value when the state is app-global. Nested
provider stacks (private shell, leaderboard rank boundary, wallet-auth
boundaries) previously each owned their own auth signal mirroring the same
localStorage key — a logout in one subtree left the others stale.

- The logged-in flag lives in `apps/app/src/state/auth-store.ts` (one signal,
  one persistence effect). `useAuthStatus()` reads it from anywhere; there is
  no provider and no "outside provider" error.
- Wallet account state lives in `apps/app/src/runtime/wagmi.ts`: one module
  `watchAccount` subscription feeds one signal; every `useAccount()` call
  returns the same getter-backed object. Reads before the wallet chunk loads
  observe the disconnected defaults instead of throwing.
- Keep per-subtree contexts only for state with a real subtree lifetime
  (a dialog's open state, a form's scope).

## Contract reads go through the shared query cache

`useReadContract`, `useEnsName`, and `useEnsAvatar` (`@/runtime/wagmi`) are
backed by TanStack Query keyed on `{chainId, address, functionName, args}`.
Identical reads across components, provider stacks, and route remounts issue
one RPC and honor `staleTime` (balances pass 10s). `isLoading` is true only
for the initial fetch; background refetches keep stale values visible. Do not
revert these to bare `createResource` — resources have no shared cache, which
is why every provider remount used to re-fire `balanceOfBatch` RPCs.

## Preloading policy

- The router runs `defaultPreload: 'intent'`. Internal links (`@/runtime/Link`)
  deliberately pass no `preload` prop, so hovering a nav link warms its route
  chunks and its loader queries. Do not add `preload={false}` to persistent
  navigation; that was a Next.js-era setting and it disabled loader prefetch.
- Routes with server-fetchable data keep a `loader` that awaits
  `ensureQueryData` (see `/degens`), and the page component must stay
  SSR-enabled (`dynamic(...)` without `ssr: false`) so the dehydrated payload
  renders into the streamed HTML. Reach for `ssr: false` only when the surface
  truly cannot render on the server (WebGL, wallet-dependent UI).
- Fetch size / request shape may derive from URL state and static breakpoints,
  never from post-mount UI state (drawer open, etc.) — a server prefetch
  cannot know it, and a mismatch silently doubles the fetch.

## Deferred boundary props must stay getter-backed

A plain object spread freezes values at setup (`props={{ ...props, open: open()
}}`). Inside `DeferredComponent`/`<Dynamic>` boundaries, hand the props object
real getters so late-arriving values stay live:

```tsx
props={mergeProps(props, { get open() { return open() } })}
```

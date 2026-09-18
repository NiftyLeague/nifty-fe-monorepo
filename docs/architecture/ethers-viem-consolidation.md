# ethers → viem consolidation

The app's browser web3 stack is viem-only. `@wagmi/core` + `viem` own wallet
connection (AppKit, account state, cached contract reads through
`src/runtime/wagmi.ts`), contract reads, writes, receipts, units, address
validation, and ABI definitions. The API workspace intentionally retains its
separate ethers integration for server-side contract tooling.

This document records the migration decisions and the historical app surface
that was removed across the phase PRs.

## Historical app ethers surface (measured 2026-09-17)

30 non-generated files import ethers. Grouped by role:

| Group                 | Files                                                                                                                                                                                                   | ethers usage                                                                       |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| Contract roster types | `constants/contracts/deployments*.ts`, `externalContracts.ts`, `types/web3.ts`                                                                                                                          | `Contract`/`ContractFactory`/`Interface` types for every deployment entry          |
| Adapters              | `hooks/useEthersProvider.ts`, `useEthersSigner.ts`, `useImxProvider.ts`                                                                                                                                 | viem `Client` → `FallbackProvider`/`BrowserProvider`/`JsonRpcSigner`               |
| Roster instantiation  | `hooks/useContractLoader.ts`                                                                                                                                                                            | `new Contract(...)` for every deployment + external contract, per provider/signer  |
| Reads                 | `hooks/useSingleCallResult.ts`, `hooks/balances/*`, `hooks/merkleDistributor/*`, `useNFTLAllowance`                                                                                                     | `contract.method(args)` through the ethers roster                                  |
| Writes                | `utils/transactions.ts`, `hooks/useNotify.ts`, `hooks/writeContracts/*`, `useRent`, dialogs (`BridgeForm`, `WithdrawForm`, `RentDegenContentDialog`, `RenameDegenDialogContent`, `ComicsBurnerContent`) | `signer.sendTransaction`, `result.wait()`, `parseEther` amounts, gas-margin helper |
| Units                 | `utils/gas.ts`, dialogs                                                                                                                                                                                 | `parseEther`/`formatEther`/`formatUnits`/`toBeHex`/`isAddress`                     |
| IMX                   | `contexts/IMXContext.tsx`, `useImxProvider.ts`                                                                                                                                                          | Passport EVM provider wrapped as ethers `BrowserProvider`                          |

Non-negotiables: the M1 contract-test pins on storage keys do not touch this
layer, but `docs/architecture/m1-state-and-data-layer.md` records the
request-cache ownership that `useSingleCallResult` implements — whatever
replaces it must keep the shared TanStack Query cache semantics introduced by
the `runtime/wagmi.ts` read hooks.

## Migration plan (phased, each independently shippable)

1. **Reads first.** Complete. Every app read now flows through the shared
   `useReadContract` query cache and the retired ethers roster is gone.
2. **Writes second.** Complete. Route sends through `walletActions.writeContract` on
   the wagmi connector client (the wallet's live signing path) while keeping
   the `utils/transactions.ts` toast/receipt UX from #1973 — viem
   `waitForTransactionReceipt` replaces `result.wait()`. `utils/gas.ts`
   becomes a `simulateContract` gas estimate + 20% margin helper.
3. **Units and misc.** `parseEther`/`formatUnits` → viem's same-named
   utilities; `isAddress`/`toBeHex` exist in viem; `AddressLike` → viem
   `Address`.
4. **IMX last.** Complete. IMX chain selection and wallet state now come from
   the viem/AppKit path; no Passport EVM provider adapter remains in the app.
5. **Finish.** Complete. The app adapters, contract loader, generated ethers
   typechain graph, app-level `ethers` dependency, and ethers unit/address/ABI
   imports are removed. The API keeps ethers where its server-side integrations
   still require it.

## Risks and decision points

- **Typed call sites.** The app accepts ABI+`functionName` calls through viem's
  contract APIs; the retired ethers-targeted typechain graph is not part of the
  browser program. A viem-targeted codegen pass can be added independently if
  future call-site typing needs justify it.
- **Write transaction lifecycle.** ethers `TransactionResponse.wait()` and
  viem receipts have different revert semantics (viem throws on reverted
  receipts via `receipts.confirmations` handling in `waitForTransactionReceipt`);
  the sonner toast states in `utils/transactions.ts` must be re-tested against
  reverted and replaced transactions.
- **IMX sandbox vs production**, per `VITE_VERCEL_ENV`, changes chain objects;
  both viem chain paths remain selected by the shared app runtime.
- **Gas margin behavior** (`calculateGasMargin` + configured gas price
  fallback in `loadGasPrice`) must be preserved bit-for-bit; some upstream
  contracts revert on under-estimated gas.

## Measurement

Before phase 1, record: client chunks containing ethers bytes (rolldown
`--metafile` or bundle analyzer), the read RPC count on a dashboard walk, and
the write path receipts. After each phase, compare — the goal is deleting the
adapter chunks and one runtime dependency, not micro-bytes.

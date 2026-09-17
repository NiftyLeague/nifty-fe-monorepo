# ethers → viem consolidation plan

The app ships two web3 stacks. `@wagmi/core` + `viem` own wallet connection
(AppKit, account state, cached contract reads through `src/runtime/wagmi.ts`),
while `ethers` owns contract interactions through a viem→ethers adapter layer
(`useEthersProvider`/`useEthersSigner` wrap viem clients into ethers
providers/signers, and `useContractLoader` instantiates the full contract
roster against them). Every adapter boundary is a place where the two stacks
disagree about types, signing, and transaction lifecycles.

This document scopes the consolidation to viem-only so the adapter layer can
be deleted. It is a program of several PRs, not a single change.

## Current ethers surface (measured 2026-09-17)

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

1. **Reads first.** Every read already flows through the query cache
   (`useReadContract`, or `useSingleCallResult` for the ethers roster).
   Replace roster reads with `readContract`/`multicall` calls that write into
   the same cache keys, deleting `useContractLoader`'s read half and both
   provider/signer adapters when the last consumer is gone. Typechain types
   stay as types-only (`types/typechain` remains the source of ABIs and
   typed call shapes via declaration merging; no runtime import of ethers).
2. **Writes second.** Route sends through `walletActions.writeContract` on
   the wagmi connector client (the wallet's live signing path) while keeping
   the `utils/transactions.ts` toast/receipt UX from #1973 — viem
   `waitForTransactionReceipt` replaces `result.wait()`. `utils/gas.ts`
   becomes a `simulateContract` gas estimate + 20% margin helper.
3. **Units and misc.** `parseEther`/`formatUnits` → viem's same-named
   utilities; `isAddress`/`toBeHex` exist in viem; `AddressLike` → viem
   `Address`.
4. **IMX last.** Passport's EVM provider is an EIP-1193 provider, which viem
   consumes directly (`createWalletClient({ transport: custom(provider) })`);
   the ethers `BrowserProvider` wrap and the raw-JSON-RPC ethers signer go
   away with it.
5. **Finish.** Drop the adapters, `useContractLoader`, `useEthersProvider`/
   `useEthersSigner`, and the `ethers` dependency; move ABIs to JSON imports
   consumed by viem.

## Risks and decision points

- **Typed call sites.** Typechain emits ethers-targeted classes; viem call
  sites lose `contract.getName(id)`-style typing unless the repo adopts a
  viem-targeted codegen (e.g. `typechain --target=ethers-v6` replaced by
  hand-written thin wrappers per contract, or `wagmi generate`). Decision
  needed before phase 1: accept ABI+functionName strings, or add codegen.
- **Write transaction lifecycle.** ethers `TransactionResponse.wait()` and
  viem receipts have different revert semantics (viem throws on reverted
  receipts via `receipts.confirmations` handling in `waitForTransactionReceipt`);
  the sonner toast states in `utils/transactions.ts` must be re-tested against
  reverted and replaced transactions.
- **IMX sandbox vs production**, per `VITE_VERCEL_ENV`, changes chain objects
  — the Passport transport path must be exercised against sandbox in CI-less
  local runs before removing the ethers path.
- **Gas margin behavior** (`calculateGasMargin` + configured gas price
  fallback in `loadGasPrice`) must be preserved bit-for-bit; some upstream
  contracts revert on under-estimated gas.

## Measurement

Before phase 1, record: client chunks containing ethers bytes (rolldown
`--metafile` or bundle analyzer), the read RPC count on a dashboard walk, and
the write path receipts. After each phase, compare — the goal is deleting the
adapter chunks and one runtime dependency, not micro-bytes.

import { createEffect, createSignal, onCleanup, onMount, type Accessor } from 'solid-js'
import { BrowserProvider, JsonRpcSigner } from 'ethers'
import { type Chain, immutableZkEvm, immutableZkEvmTestnet } from 'viem/chains'
import { useAccount } from '@/runtime/wagmi'

import useEthersSigner, { type Signer } from '@/hooks/useEthersSigner'
import { IS_PRODUCTION } from '@/runtime/env'

type PassportModule = typeof import('@nl/imx-passport')

let passportModulePromise: Promise<PassportModule> | undefined

const loadPassport = () => {
  passportModulePromise ??= import('@nl/imx-passport')
  return passportModulePromise
}

/**
 * The Passport EVM provider is session-scoped, so it is connected once and
 * reused across every IMX-consuming mount instead of re-running
 * `connectEvm` (which re-enters the SDK) per provider stack.
 */
let cachedPassportProvider: BrowserProvider | undefined

const resetPassportProvider = (): void => {
  cachedPassportProvider = undefined
}

async function clientToProvider(): Promise<BrowserProvider> {
  if (cachedPassportProvider) return cachedPassportProvider
  const { default: passport } = await loadPassport()
  const passportProvider = await passport.connectEvm()
  cachedPassportProvider = new BrowserProvider(passportProvider)
  return cachedPassportProvider
}

async function getPassportSigner(): Promise<JsonRpcSigner> {
  const provider = await clientToProvider()
  await provider.send('eth_requestAccounts', [])
  return provider.getSigner()
}

export function getNetwork(): Chain {
  return IS_PRODUCTION ? immutableZkEvm : immutableZkEvmTestnet
}

export function useConnectedToIMXCheck(): Accessor<boolean> {
  const account = useAccount()
  const chainId = () => account.chain?.id
  return () => chainId() === immutableZkEvm.id || chainId() === immutableZkEvmTestnet.id
}

/** Action to convert an IMX Passport instance to an ethers.js Provider. */
export function useImxProvider(): Accessor<BrowserProvider | undefined> {
  const [provider, setProvider] = createSignal<BrowserProvider>()
  const account = useAccount()

  createEffect(() => {
    if (!account.isConnected) {
      resetPassportProvider()
      setProvider(undefined)
      return
    }

    let mounted = true
    clientToProvider()
      .then((nextProvider) => {
        if (mounted) setProvider(nextProvider)
      })
      .catch(console.error)

    onCleanup(() => {
      mounted = false
    })
  })

  return provider
}

/** Action to convert a viem Wallet Client to an ethers.js Signer connected to IMX */
export function useImxSigner(): Accessor<Signer> {
  const passportNetwork = getNetwork()
  return useEthersSigner({ chainId: passportNetwork.id })
}

/** ========== Launches Passport sign-in popup to authenticate user =========== */
/** Action to convert an IMX Passport instance to an ethers.js Signer. */
export function usePassportSigner(): Accessor<JsonRpcSigner | null> {
  const [signer, setSigner] = createSignal<JsonRpcSigner | null>(null)

  onMount(() => {
    let mounted = true
    getPassportSigner()
      .then((nextSigner) => {
        if (mounted) setSigner(nextSigner) // Avoid updating state if the component is unmounted
      })
      .catch((error) => {
        console.error('Failed to get IMX Signer:', error)
        setSigner(null) // Ensure the state reflects a failed signer fetch
      })

    onCleanup(() => {
      mounted = false // Cleanup function to handle component unmounting
    })
  })

  return signer
}

export default useImxProvider

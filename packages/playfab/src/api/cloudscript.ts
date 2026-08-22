/// <reference path="../sdk/typings/PlayFabCloudScript.d.ts" />

import { isEthereumSignatureValid } from '../utils/wallet'
import * as PlayFabCloudScript from '../sdk/PlayFabCloudScript'
import { configurePlayFab } from '../sdk/configure'
import { getLinkedWallets } from './runtime'

configurePlayFab()

async function executeFunction(
  FunctionName: string,
  FunctionParameter: unknown,
  EntityToken: string
): Promise<PlayFabCloudScriptModels.ExecuteFunctionResult> {
  return new Promise((resolve, reject) => {
    PlayFabCloudScript.ExecuteFunction(
      { FunctionName, FunctionParameter },
      EntityToken,
      (error, result) => {
        if (error || !result) reject(error)
        else resolve(result.data)
      }
    )
  })
}

export async function ChangeDisplayName(
  DisplayName: string,
  EntityToken: string
): Promise<PlayFabCloudScriptModels.ExecuteFunctionResult> {
  return executeFunction('Accounts_ChangeDisplayName', { DisplayName }, EntityToken)
}

type LinkWalletParams = {
  chain?: string
  address: string
  signature: string
  nonce: string
  EntityToken: string
  SessionTicket: string
}

export async function LinkWallet({
  chain = 'ethereum',
  address,
  signature,
  nonce,
  EntityToken,
  SessionTicket,
}: LinkWalletParams): Promise<PlayFabCloudScriptModels.ExecuteFunctionResult> {
  const linkedWallets = await getLinkedWallets(SessionTicket)
  if (chain != 'ethereum') throw new Error('Only Ethereum wallets are supported at this time')
  if (!isEthereumSignatureValid(address, signature, nonce))
    throw new Error('Failed to validate signature')

  const walletEntry = `${chain}:${address}`.toLowerCase()
  if (linkedWallets.includes(walletEntry))
    throw new Error(`${address.substring(0, 6)}... address is already linked to this account`)

  return executeFunction(
    'Accounts_LinkWallet',
    { Chain: chain, Address: address.toLowerCase(), Signature: signature, Nonce: nonce },
    EntityToken
  )
}

type UnlinkWalletParams = {
  chain?: string
  address: string
  EntityToken: string
  SessionTicket: string
}

export async function UnlinkWallet({
  chain = 'ethereum',
  address,
  EntityToken,
  SessionTicket,
}: UnlinkWalletParams): Promise<PlayFabCloudScriptModels.ExecuteFunctionResult> {
  const linkedWallets = await getLinkedWallets(SessionTicket)
  if (chain != 'ethereum') throw new Error('Only Ethereum wallets are supported at this time')

  const walletEntry = `${chain}:${address}`.toLowerCase()
  if (!linkedWallets.includes(walletEntry))
    throw new Error(`${address.substring(0, 6)}... address is not linked to this account`)

  return executeFunction(
    'Accounts_UnlinkWallet',
    { Chain: chain, Address: address.toLowerCase() },
    EntityToken
  )
}

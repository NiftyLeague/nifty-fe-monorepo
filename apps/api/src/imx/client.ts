/**
 * Lightweight Immutable X (IMX) REST client.
 *
 * Replaces @imtbl/imx-sdk with direct REST calls so the project no longer pulls
 * in the transitive `elliptic` / `web3-*` low-severity vulnerabilities. The
 * signing behaviour below was verified byte-for-byte against @imtbl/imx-sdk@3.8.2:
 *
 *  - `getUser`           : plain GET, no auth
 *  - `registerUser`      : POST /users with an L1 eth signature (`eth_signature`)
 *                          and a Stark signature (`stark_signature`) over the
 *                          pedersen-packed (stark_key, ether_key) message
 *  - `mintV2`            : POST /mints with an L1 eth signature (`auth_signature`)
 *                          over `keccak256(jsonBody)`
 *  - metadata schema ops : PATCH/POST with `imx-timestamp` / `imx-signature`
 *                          headers (L1 eth sig of the timestamp)
 *
 * The Stark key is derived deterministically from the L1 private key, exactly
 * as the SDK does:
 *   seed   = splitSignature( signMessage(REGISTER_MSG) ).s
 *   child  = HDNode.fromSeed(seed).derivePath( imxDerivationPath(address) )
 *   stark  = grindKey(child.privateKey)
 */
import crypto from 'crypto'
import axios from 'axios'
import { keccak256, toUtf8Bytes, HDNodeWallet } from 'ethers'
import type { Signer } from 'ethers'
import { ec } from 'starknet'

import { getWallet } from '@/utils/wallet'
import { generateIMXAuthorisationHeaders } from '@/utils/sign'

const starkCurve = ec.starkCurve

// Message the SDK signs with the L1 key during registration.
const REGISTER_REQUEST_MSG =
  'Only sign this request if you’ve initiated an action with Immutable X.'

// Max STARK field prime (2^251 + 17 * 2^192 + 1).
const STARK_PRIME = starkCurve.MAX_VALUE

/**
 * Build the IMX L1->Stark derivation path for an address, matching the SDK's
 * `m/2645'/{sha256('starkex') low 31 bits}'/{sha256('immutablex') low 31 bits}'/
 * {address low 31 bits}'/{address bits [-62,-31)}'/1` scheme.
 */
function imxDerivationPath(address: string): string {
  const sha = (s: string) => crypto.createHash('sha256').update(s).digest()
  const lowBits = (hash: Buffer, fromBit: number, toBit?: number): number => {
    const bin = BigInt('0x' + hash.toString('hex')).toString(2)
    const start = fromBit < 0 ? bin.length + fromBit : fromBit
    const end = toBit === undefined ? bin.length : toBit < 0 ? bin.length + toBit : toBit
    return parseInt(bin.slice(start, end), 2)
  }
  const starkex = sha('starkex')
  const immutablex = sha('immutablex')
  const addr = Buffer.from(address.replace(/^0x/, ''), 'hex')
  const p1 = lowBits(starkex, -31)
  const p2 = lowBits(immutablex, -31)
  const p3 = lowBits(addr, -31)
  const p4 = lowBits(addr, -62, -31)
  return `m/2645'/${p1}'/${p2}'/${p3}'/${p4}'/1`
}

export interface StarkKeyPair {
  privateKey: string
  publicKey: string
}

/**
 * Deterministically derive the IMX Stark key pair from an L1 ethers signer.
 */
async function deriveStarkKeyPair(signer: Signer): Promise<StarkKeyPair> {
  const address = (await signer.getAddress()).toLowerCase()
  const signature = await signer.signMessage(REGISTER_REQUEST_MSG)
  const s = (signature.length === 132 ? signature.slice(66, 130) : signature.slice(2)).replace(
    /^0x/,
    ''
  )
  const master = HDNodeWallet.fromSeed(Buffer.from(s, 'hex'))
  const child = master.derivePath(imxDerivationPath(address))
  const privateKey = starkCurve.grindKey(child.privateKey)
  // getStarkKey returns `0x4<x-coordinate>` (the `04` prefix byte loses its
  // leading zero). The SDK exposes `starkPublicKey` as `0x04<x-coordinate>`,
  // so normalise to that form.
  const raw = starkCurve.getStarkKey(privateKey).replace(/^0x0?/, '').replace(/^4/, '')
  const publicKey = `0x04${raw}`
  return { privateKey, publicKey }
}

// eth-sign a payload the same way the SDK serialises signatures:
// serializeEthSignature(deserializeSignature(signMessage(payload))). This matches
// the SDK's `lp(yp(signer.signMessage(payload)))` exactly.
async function signEthMessage(signer: Signer, payload: string): Promise<string> {
  const sig = await signer.signMessage(payload)
  // signMessage returns r||s||v; normalise the recovery byte like the SDK.
  const hex = sig.replace(/^0x/, '')
  const r = hex.slice(0, 64)
  const sBytes = hex.slice(64, 128)
  let v = parseInt(hex.slice(128, 130), 16)
  if (v >= 27) v -= 27
  return `0x${r}${sBytes}${v.toString(16).padStart(2, '0')}`
}

// pedersen hash of two felts (hex strings or bigints).
function pedersen(a: string | bigint, b: string | bigint): string {
  return starkCurve.pedersen(a as string, b as string)
}

// Pack an ether address + constant timestamp into a STARK felt, matching the
// SDK's `rp(address)` = (1000 << 160) + address.
function packAddressFelt(address: string): string {
  const value = (1000n << 160n) + BigInt(address)
  return `0x${value.toString(16)}`
}

export interface ImxUser {
  address: string
  stark_key?: string
  [key: string]: unknown
}

export interface ImxMintToken {
  id: string
  blueprint: string
  royalties?: Array<{ recipient: string; percentage: number }>
}

export interface ImxMintResult {
  results: Array<{ tx_hash?: string; [key: string]: unknown }>
}

/**
 * Fetch an existing IMX user (throws if not found, mirroring the SDK).
 */
export async function getUser(apiUrl: string, address: string): Promise<ImxUser> {
  const resp = await axios.get(`${apiUrl}/users/${address.toLowerCase()}`)
  return resp.data
}

/**
 * Register a new IMX user. Returns the created user record.
 */
export async function registerUser(apiUrl: string, signer: Signer): Promise<ImxUser> {
  const address = (await signer.getAddress()).toLowerCase()
  const { publicKey: starkKey, privateKey: starkPriv } = await deriveStarkKeyPair(signer)

  // stark_signature: Stark signature over pedersen(pedersen(starkKey), pack(address))
  const inner = pedersen(starkKey, '0x0')
  const msgHash = pedersen(inner, packAddressFelt(address))
  const reduced = `0x${(BigInt(msgHash) % STARK_PRIME).toString(16)}`
  const starkSig = starkCurve.sign(reduced, starkPriv)
  const starkSignature = `0x${starkSig.r.toString(16).padStart(64, '0')}${starkSig.s.toString(16).padStart(64, '0')}`

  const ethSignature = await signEthMessage(signer, REGISTER_REQUEST_MSG)

  const body = {
    ether_key: address,
    stark_key: starkKey,
    stark_signature: starkSignature,
    eth_signature: ethSignature,
  }

  const resp = await axios.post(`${apiUrl}/users`, JSON.stringify(body), {
    headers: { 'Content-type': 'application/json' },
  })
  return resp.data
}

export interface ImxMintV2Params {
  contractAddress: string
  users: Array<{ ether_key: string; tokens: ImxMintToken[] }>
}

/**
 * Mint tokens (v2 off-chain mint). Returns the mint results.
 */
export async function mintV2(
  apiUrl: string,
  signer: Signer,
  params: ImxMintV2Params
): Promise<ImxMintResult> {
  const payload = {
    contract_address: params.contractAddress,
    users: params.users.map((u) => ({
      ether_key: u.ether_key.toLowerCase(),
      tokens: u.tokens.map((t) => ({
        id: t.id,
        blueprint: t.blueprint,
        royalties: t.royalties?.map((r) => ({
          recipient: r.recipient.toLowerCase(),
          percentage: r.percentage,
        })),
      })),
    })),
    auth_signature: '',
  }

  const body = JSON.stringify(payload)
  const messageHash = keccak256(toUtf8Bytes(body))
  const authSignature = await signEthMessage(signer, messageHash)

  const signedPayload = {
    ...payload,
    auth_signature: authSignature,
  }

  const resp = await axios.post(`${apiUrl}/mints`, JSON.stringify(signedPayload), {
    headers: { 'Content-type': 'application/json' },
    params: { version: 'v2' },
  })
  return resp.data
}

export interface MetadataProperty {
  name: string
  type: string
  filterable: boolean
}

/**
 * Add a metadata schema to a collection (POST /collections/:address/metadata-schema).
 */
export async function addMetadataSchemaToCollection(
  apiUrl: string,
  collectionAddress: string,
  metadata: MetadataProperty[],
  apiKey: string
): Promise<unknown> {
  const { timestamp, signature } = await generateIMXAuthorisationHeaders(getWallet())
  const resp = await axios.post(
    `${apiUrl}/collections/${collectionAddress}/metadata-schema`,
    { metadata },
    {
      headers: {
        'Content-type': 'application/json',
        'imx-timestamp': timestamp,
        'imx-signature': signature,
        'x-immutable-api-key': apiKey,
      },
    }
  )
  return resp.data
}

/**
 * Update a metadata schema property by name
 * (PATCH /collections/:address/metadata-schema/:name).
 */
export async function updateMetadataSchemaByName(
  apiUrl: string,
  collectionAddress: string,
  name: string,
  params: { name: string; type: string; filterable: boolean },
  apiKey: string
): Promise<unknown> {
  const { timestamp, signature } = await generateIMXAuthorisationHeaders(getWallet())
  const resp = await axios.patch(
    `${apiUrl}/collections/${collectionAddress}/metadata-schema/${name}`,
    params,
    {
      headers: {
        'Content-type': 'application/json',
        'imx-timestamp': timestamp,
        'imx-signature': signature,
        'x-immutable-api-key': apiKey,
      },
    }
  )
  return resp.data
}

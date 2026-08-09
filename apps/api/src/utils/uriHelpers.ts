import { CID } from 'multiformats/cid'
import { config } from 'node-config-ts'

/**
 * @param {string} cidOrURI either a CID string, or a URI string of the form `ipfs://${cid}`
 * @returns the input string with the `ipfs://` prefix stripped off
 */
export function stripIpfsUriPrefix(cidOrURI: string) {
  if (cidOrURI.startsWith('ipfs://')) {
    return cidOrURI.slice('ipfs://'.length)
  }
  return cidOrURI
}

export function ensureIpfsUriPrefix(cidOrURI: CID | string) {
  let uri = cidOrURI.toString()
  if (!uri.startsWith('ipfs://')) {
    uri = 'ipfs://' + uri
  }
  // Avoid the Nyan Cat bug (https://github.com/ipfs/go-ipfs/pull/7930)
  if (uri.startsWith('ipfs://ipfs/')) {
    uri = uri.replace('ipfs://ipfs/', 'ipfs://')
  }
  return uri
}

/**
 * Return an HTTP gateway URL for the given IPFS object.
 * @param {string} ipfsURI - an ipfs:// uri or CID string
 * @returns - an HTTP url to view the IPFS object on the configured gateway.
 */
export function makeGatewayURL(ipfsURI: string) {
  return config.ipfs.gatewayURL + '/' + stripIpfsUriPrefix(ipfsURI)
}

/**
 *
 * @param {string} cidOrURI - an ipfs:// URI or CID string
 * @returns {CID} a CID for the root of the IPFS path
 */
export function extractCID(cidOrURI: string): CID {
  // remove the ipfs:// prefix, split on '/' and return first path component (root CID)
  const cidString = stripIpfsUriPrefix(cidOrURI).split('/')[0]
  return CID.parse(cidString)
}

import { CID } from 'multiformats/cid'
import { describe, expect, it } from 'bun:test'

import { stripIpfsUriPrefix, ensureIpfsUriPrefix, makeGatewayURL, extractCID } from './uriHelpers'

const SAMPLE_CID = 'bafybeih75ntopwuggljajz3p2y2mh2ylxfv6joqlbvo2wxtabxkxm6igaa'

describe('stripIpfsUriPrefix', () => {
  it('strips the ipfs:// prefix', () => {
    expect(stripIpfsUriPrefix(`ipfs://${SAMPLE_CID}`)).toBe(SAMPLE_CID)
  })

  it('returns a bare CID unchanged', () => {
    expect(stripIpfsUriPrefix(SAMPLE_CID)).toBe(SAMPLE_CID)
  })

  it('strips prefix from a path-style URI', () => {
    expect(stripIpfsUriPrefix(`ipfs://${SAMPLE_CID}/degens/1.png`)).toBe(
      `${SAMPLE_CID}/degens/1.png`
    )
  })
})

describe('ensureIpfsUriPrefix', () => {
  it('adds ipfs:// to a bare CID', () => {
    expect(ensureIpfsUriPrefix(SAMPLE_CID)).toBe(`ipfs://${SAMPLE_CID}`)
  })

  it('leaves an existing ipfs:// prefix unchanged', () => {
    const uri = `ipfs://${SAMPLE_CID}`
    expect(ensureIpfsUriPrefix(uri)).toBe(uri)
  })

  it('fixes the Nyan Cat bug (ipfs://ipfs/ → ipfs://)', () => {
    expect(ensureIpfsUriPrefix(`ipfs://ipfs/${SAMPLE_CID}`)).toBe(`ipfs://${SAMPLE_CID}`)
  })
})

describe('makeGatewayURL', () => {
  it('builds a gateway URL from an ipfs:// URI', () => {
    const url = makeGatewayURL(`ipfs://${SAMPLE_CID}/degens/1.png`)
    expect(url).toContain(SAMPLE_CID)
    expect(url).toContain('/degens/1.png')
    expect(url).toMatch(/^https?:\/\//)
  })

  it('builds a gateway URL from a bare CID', () => {
    const url = makeGatewayURL(SAMPLE_CID)
    expect(url).toContain(SAMPLE_CID)
  })
})

describe('extractCID', () => {
  it('extracts a CID from a bare CID string', () => {
    const cid = extractCID(SAMPLE_CID)
    expect(cid).toBeInstanceOf(CID)
    expect(cid.toString()).toBe(SAMPLE_CID)
  })

  it('extracts the root CID from an ipfs:// URI', () => {
    const cid = extractCID(`ipfs://${SAMPLE_CID}/degens/1.png`)
    expect(cid.toString()).toBe(SAMPLE_CID)
  })

  it('extracts the root CID from a path-style string', () => {
    const cid = extractCID(`${SAMPLE_CID}/degens/1.png`)
    expect(cid.toString()).toBe(SAMPLE_CID)
  })
})

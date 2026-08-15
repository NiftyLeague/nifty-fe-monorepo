import { afterEach, describe, expect, it, spyOn } from 'bun:test'

import { requestGraphQL } from './graphql'

const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
})

describe('requestGraphQL', () => {
  it('posts the query and returns typed data', async () => {
    const fetchMock = spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ data: { owner: null } }), { status: 200 })
    )

    await expect(
      requestGraphQL<{ owner: null }>({
        endpoint: 'https://graph.example/graphql',
        query: 'query Owner($address: ID!) { owner(id: $address) { id } }',
        variables: { address: '0xabc' },
        headers: { Authorization: 'Bearer token' },
      })
    ).resolves.toEqual({ owner: null })

    expect(fetchMock).toHaveBeenCalledWith('https://graph.example/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer token',
      },
      body: JSON.stringify({
        query: 'query Owner($address: ID!) { owner(id: $address) { id } }',
        variables: { address: '0xabc' },
      }),
    })
  })

  it('surfaces HTTP and GraphQL errors', async () => {
    const fetchMock = spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(null, { status: 503 })
    )
    await expect(
      requestGraphQL({ endpoint: 'https://graph.example/graphql', query: 'query {}' })
    ).rejects.toThrow('GraphQL request failed: 503')

    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ errors: [{ message: 'Unauthorized' }] }), { status: 200 })
    )
    await expect(
      requestGraphQL({ endpoint: 'https://graph.example/graphql', query: 'query {}' })
    ).rejects.toThrow('Unauthorized')
  })
})

type GraphQLError = { message?: string }

type GraphQLResponse<T> = {
  data?: T
  errors?: GraphQLError[]
}

type GraphQLRequestOptions = {
  endpoint: string
  query: string
  variables?: Record<string, unknown>
  headers?: Record<string, string>
}

export const requestGraphQL = async <T>({
  endpoint,
  query,
  variables,
  headers,
}: GraphQLRequestOptions): Promise<T> => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify({ query, variables }),
  })

  if (!response.ok) throw new Error(`GraphQL request failed: ${response.status}`)

  const result = (await response.json()) as GraphQLResponse<T>
  if (result.errors?.length) {
    throw new Error(result.errors[0]?.message ?? 'GraphQL request failed')
  }
  if (result.data === undefined) throw new Error('GraphQL response did not include data')

  return result.data
}

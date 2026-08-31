export type JsonRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export type JsonRequestError = Error & {
  response: {
    data: unknown
    status: number
    statusText: string
  }
}

async function readResponseBody(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return undefined

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/**
 * Small JSON-only wrapper for the Node 24 fetch runtime.
 *
 * Native fetch does not reject on HTTP errors, so keep the Axios-style
 * response shape used by the IMX CLI callers while avoiding a second HTTP
 * client dependency in the API package.
 */
export async function requestJson<T>(
  url: string | URL,
  { body, headers, ...options }: JsonRequestOptions = {},
  fetcher: typeof fetch = globalThis.fetch
): Promise<T> {
  const requestHeaders = new Headers(headers)
  requestHeaders.set('accept', requestHeaders.get('accept') ?? 'application/json')

  const serializedBody = body === undefined ? undefined : JSON.stringify(body)
  if (serializedBody !== undefined) {
    requestHeaders.set('content-type', requestHeaders.get('content-type') ?? 'application/json')
  }

  const response = await fetcher(url, {
    ...options,
    body: serializedBody,
    headers: requestHeaders,
  })
  const data = await readResponseBody(response)

  if (!response.ok) {
    const error = new Error(
      `Request failed with ${response.status} ${response.statusText}`
    ) as JsonRequestError
    error.response = {
      data,
      status: response.status,
      statusText: response.statusText,
    }
    throw error
  }

  return data as T
}

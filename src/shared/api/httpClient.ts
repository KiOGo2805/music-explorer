export async function fetchJson<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    signal: options.signal ?? AbortSignal.timeout(10_000),
    headers: {
      Accept: 'application/json',
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`Request failed (${response.status} ${response.statusText})`)
  }

  return (await response.json()) as T
}

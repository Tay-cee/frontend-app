export const API_BASE_URL = "http://localhost:5188"

async function refreshAccessToken(): Promise<string | null> {
  const accessToken = localStorage.getItem("token")
  if (!accessToken) return null

  const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ accessToken }),
  })

  if (!res.ok) return null

  const data = await res.json()
  localStorage.setItem("token", data.accessToken)
  return data.accessToken as string
}

// Attaches the stored access token and transparently retries once via the
// refresh-token cookie if the access token has expired (401).
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const doFetch = (accessToken: string | null) =>
    fetch(`${API_BASE_URL}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        ...init.headers,
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    })

  let res = await doFetch(localStorage.getItem("token"))

  if (res.status === 401) {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      res = await doFetch(refreshed)
    }
  }

  return res
}

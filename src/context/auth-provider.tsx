import { useState, type ReactNode } from "react"
import { AuthContext } from "@/context/auth-context"
import { apiFetch } from "@/lib/api-client"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token")
  })

  const isLoggedIn = !!token

  function login(newToken: string) {
    localStorage.setItem("token", newToken)
    setToken(newToken)
  }

  function logout() {
    apiFetch("/api/auth/logout", { method: "POST" }).catch(() => {})
    localStorage.removeItem("token")
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
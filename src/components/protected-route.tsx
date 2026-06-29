import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoggedIn } = useAuth()

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
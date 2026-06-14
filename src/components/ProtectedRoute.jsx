import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Loader2 } from 'lucide-react'

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="auth-loading">
        <Loader2 size={32} className="spin" />
        <p>Vérification de la session…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/dashboard/login" state={{ from: location }} replace />
  }

  return <Outlet />
}

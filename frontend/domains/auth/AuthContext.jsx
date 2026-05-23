// ============================================================
// AUTH CONTEXT - Quản lý trạng thái đăng nhập & phân quyền
// ============================================================
import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from './authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const saved = localStorage.getItem('user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const login = async (email, password) => {
    try {
      const result = await authService.login(email, password)
      const session = { ...result.user, token: result.token }
      setAuth(session)
      localStorage.setItem('user', JSON.stringify(session))
      localStorage.setItem('token', result.token)
      return { success: true, role: result.user.role }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    await authService.logout()
    setAuth(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          // Verify token and fetch latest user info
          const result = await authService.getCurrentUser()
          const session = { ...result, token }
          setAuth(session)
          localStorage.setItem('user', JSON.stringify(session))
        } catch {
          // Token invalid, clear everything
          localStorage.removeItem('user')
          localStorage.removeItem('token')
          setAuth(null)
        }
      }
    }
    loadUser()
  }, [])

  return (
    <AuthContext.Provider value={{ auth, login, logout, isAdmin: auth?.role === 'admin', isUser: auth?.role === 'user', isStaff: auth?.role === 'staff' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

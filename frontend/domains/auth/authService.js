// domains/auth/authService.js
// Authentication with real backend

import api from '../../shared/utils/api'

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      return { success: true, user: response.data.user, token: response.data.token }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Login failed')
    }
  },

  logout: async () => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return { success: true }
    } catch (error) {
      throw new Error('Failed to logout')
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me')
      return { success: true, ...response.data }
    } catch (error) {
      throw new Error('Invalid token')
    }
  }
}

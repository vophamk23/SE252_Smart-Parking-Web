// domains/user-management/userManagementService.js
// User management API calls

import api from '../../shared/utils/api'

export const userManagementService = {
  getUsers: async () => {
    try {
      const response = await api.get('/users')
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch users')
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/users', userData)
      return { success: true, user: response.data }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create user')
    }
  },

  updateUser: async (userId, updates) => {
    try {
      const response = await api.put(`/users/${userId}`, updates)
      return { success: true, user: response.data }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user')
    }
  },

  deleteUser: async (userId) => {
    try {
      await api.delete(`/users/${userId}`)
      return { success: true, userId }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user')
    }
  },

  getUserStats: async () => {
    try {
      const response = await api.get('/users')
      const users = response.data
      
      const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        inactive: users.filter(u => u.status !== 'active').length,
        admins: users.filter(u => u.role === 'admin').length,
        users: users.filter(u => u.role === 'user').length
      }
      return stats
    } catch (error) {
      throw new Error('Failed to fetch user stats')
    }
  }
}
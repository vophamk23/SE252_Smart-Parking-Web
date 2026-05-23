// domains/dashboard/dashboardService.js
// Dashboard data API calls

import api from '../../shared/utils/api'

export const dashboardService = {
  getAdminStats: async () => {
    try {
      const response = await api.get('/dashboard/admin')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch admin stats')
    }
  },

  getStaffStats: async () => {
    try {
      const response = await api.get('/dashboard/staff')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch staff stats')
    }
  },

  getUserStats: async () => {
    try {
      const response = await api.get('/dashboard/user')
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user stats')
    }
  },

  getRecentActivity: async (limit = 10) => {
    try {
      const response = await api.get(`/parking/access-log?limit=${limit}`)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recent activity')
    }
  },

  getAlerts: async () => {
    // Currently no alerts API on backend, returning mock for now
    return Promise.resolve([
      {
        id: 1,
        type: 'warning',
        message: 'Low battery on Gate A sensor',
        timestamp: new Date().toISOString(),
        priority: 'medium'
      }
    ])
  }
}
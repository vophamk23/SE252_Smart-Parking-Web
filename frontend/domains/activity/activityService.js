// domains/activity/activityService.js
// Activity tracking API calls

import api from '../../shared/utils/api'

export const activityService = {
  getUserActivity: async (userId) => {
    try {
      const response = await api.get('/parking/access-log')
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch user activity')
    }
  },

  getSystemActivity: async (limit = 100) => {
    try {
      const response = await api.get(`/parking/access-log?limit=${limit}`)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch system activity')
    }
  },

  logActivity: async (activityData) => {
    return Promise.resolve({ success: true })
  }
}
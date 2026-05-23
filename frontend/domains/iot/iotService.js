// domains/iot/iotService.js
// IoT devices management API calls

import api from '../../shared/utils/api'

export const iotService = {
  getDevices: async () => {
    try {
      const response = await api.get('/devices')
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch devices')
    }
  },

  updateDeviceStatus: async (deviceId, status) => {
    try {
      const response = await api.put(`/devices/${deviceId}/status`, { status })
      return { success: true, device: response.data }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update device status')
    }
  },

  getSignage: async () => {
    // Currently no signage API on backend, returning mock for now
    return Promise.resolve([
      { id: 1, location: 'Gate A', message: 'Welcome to BK Parking', status: 'active' },
      { id: 2, location: 'Gate B', message: 'Please pay before exit', status: 'active' }
    ])
  },

  updateSignage: async (id, message) => {
    return Promise.resolve({ success: true, id, message, updatedAt: new Date().toISOString() })
  },

  getDeviceLogs: async (deviceId, limit = 50) => {
    return Promise.resolve([])
  }
}
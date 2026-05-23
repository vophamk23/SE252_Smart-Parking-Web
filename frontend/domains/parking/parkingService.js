// domains/parking/parkingService.js
// Service layer for gate operations

import api from '../../shared/utils/api'

export const parkingService = {
  // UC-02A: Entry flow
  processEntry: async (cardId, isSystemOnline = true, zone = 'zone_a1') => {
    try {
      if (!isSystemOnline) {
        const res = await api.post('/parking/entry/offline', { cardId, zone })
        return { success: true, session: res.data.session, cardInfo: res.data.cardInfo, isOffline: true }
      }

      const response = await api.post('/parking/entry', { cardId, zone })
      return response.data
    } catch (error) {
      if (error.response?.data?.errorCode) {
        return error.response.data
      }
      return { success: false, error: error.message }
    }
  },

  // UC-02B: Exit — prepare exit
  processExit: async (cardId) => {
    try {
      const activeRes = await api.get(`/parking/sessions/active?card=${cardId}`)
      if (!activeRes.data.session) {
        return { success: false, error: 'Thẻ chưa vào bãi hoặc phiên đã kết thúc' }
      }
      const session = activeRes.data.session

      const validateRes = await api.get(`/parking/cards/validate?card=${cardId}`)
      const cardInfo = validateRes.data.cardInfo

      const pricingRes = await api.get('/pricing')
      const pricing = pricingRes.data

      const now = new Date()
      const hours = Math.max(1, Math.ceil((now - new Date(session.entryTime)) / (1000 * 60 * 60)))
      const rolePricing = pricing[session.userRole] || pricing.guest
      const fee = rolePricing.hourly * hours
      const isGuest = session.userRole === 'guest'

      return { success: true, session, fee, cardInfo, isGuest }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Lỗi server' }
    }
  },

  // UC-02B Member: Complete exit with debt
  completeMemberExit: async (sessionId, cardId) => {
    try {
      const res = await api.post('/parking/exit', { sessionId, paymentMethod: 'debt' })
      return res.data
    } catch (error) {
      return error.response?.data || { success: false, error: 'Lỗi server' }
    }
  },

  // UC-02B Guest (card): Complete exit with cash
  completeGuestExit: async (sessionId) => {
    try {
      const res = await api.post('/parking/exit', { sessionId, paymentMethod: 'cash' })
      return res.data
    } catch (error) {
      return error.response?.data || { success: false, error: 'Lỗi server' }
    }
  },

  // UC-03: Guest ticket prepare exit
  processGuestTicketExit: async (ticketCode) => {
    try {
      const res = await api.get(`/parking/guest-tickets/${ticketCode}`)
      const ticket = res.data
      
      if (ticket.status !== 'active') {
        return { success: false, error: 'Mã thẻ tạm đã hết hiệu lực' }
      }

      const pricingRes = await api.get('/pricing')
      const pricing = pricingRes.data

      const now = new Date()
      const hours = Math.max(1, Math.ceil((now - new Date(ticket.createdAt)) / (1000 * 60 * 60)))
      const fee = pricing.guest.hourly * hours

      return { success: true, ticket, fee }
    } catch (error) {
      return { success: false, error: 'Mã thẻ tạm không hợp lệ' }
    }
  },

  // UC-03: Complete guest ticket exit
  completeGuestTicketExit: async (ticketCode) => {
    try {
      const res = await api.post(`/parking/guest-tickets/${ticketCode}/exit`)
      return res.data
    } catch (error) {
      return error.response?.data || { success: false, error: 'Lỗi server' }
    }
  },

  // Helper fetch methods for status page
  getAllActiveSessions: async () => {
    try {
      const res = await api.get('/parking/sessions')
      return res.data.filter(s => s.status === 'active')
    } catch (e) {
      return []
    }
  },

  getActiveSession: async (cardId) => {
    try {
      const res = await api.get(`/parking/sessions/active?card=${cardId}`)
      return res.data.session
    } catch (e) {
      return null
    }
  },

  getAllActiveGuestTickets: async () => {
    try {
      const res = await api.get('/parking/guest-tickets')
      return res.data.filter(t => t.status === 'active')
    } catch (e) {
      return []
    }
  },

  getZones: async () => {
    try {
      const res = await api.get('/zones')
      return res.data
    } catch (e) {
      return []
    }
  },

  getPricing: async () => {
    try {
      const res = await api.get('/pricing')
      return res.data
    } catch (e) {
      return { guest: { hourly: 10000 } }
    }
  }
}


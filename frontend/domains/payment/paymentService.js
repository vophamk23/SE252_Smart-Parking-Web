// domains/payment/paymentService.js
// Payment processing API calls

import api from '../../shared/utils/api'

export const paymentService = {
  getPricing: async () => {
    try {
      const response = await api.get('/pricing')
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch pricing data')
    }
  },

  getRevenue: async () => {
    try {
      const response = await api.get('/payment/revenue')
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch revenue data')
    }
  },

  processPayment: async (amount, method = 'bkpay') => {
    // In a real app, this would integrate with a payment gateway (Momo, VNPay)
    // For now, we simulate a successful payment delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (amount > 0) {
          resolve({
            success: true,
            transactionId: `TXN_${Date.now()}`,
            amount,
            method,
            timestamp: new Date().toISOString()
          })
        } else {
          reject(new Error('Invalid payment amount'))
        }
      }, 2000)
    })
  },

  getPaymentHistory: async (email) => {
    try {
      const response = await api.get(`/payment/history?email=${encodeURIComponent(email)}`)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch payment history')
    }
  },

  getDebtSessions: async (email) => {
    try {
      const response = await api.get(`/payment/debt?email=${encodeURIComponent(email)}`)
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch debt sessions')
    }
  },

  payDebtSession: async (sessionId, email) => {
    try {
      const response = await api.post(`/payment/debt/${sessionId}/pay`, { email })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to pay debt')
    }
  },

  getBalance: async () => {
    try {
      const response = await api.get('/payment/balance')
      return response.data
    } catch (error) {
      throw new Error('Failed to fetch balance')
    }
  },

  updateBalance: async (amount) => {
    try {
      const response = await api.post('/payment/balance/update', { amount })
      return response.data
    } catch (error) {
      throw new Error('Failed to update balance')
    }
  },

  getContactEmail: async () => {
    try {
      const response = await api.get('/payment/contact-email')
      return response.data.contactEmail
    } catch (error) {
      throw new Error('Failed to fetch contact email')
    }
  }
}
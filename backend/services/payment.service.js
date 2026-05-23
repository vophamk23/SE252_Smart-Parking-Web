// backend/services/payment.service.js
// Business logic cho thanh toán, debt, balance, lịch sử

const db = require('../data/db')

const paymentService = {
  // ─── Debt sessions ─────────────────────────────────────────────
  getDebtSessions(email) {
    const user = db.users[email]
    if (!user || !user.card) return []
    return db.parkingSessions.filter(s => s.card === user.card && s.status === 'completed' && s.paymentMethod === 'debt')
  },

  markSessionPaid(sessionId, email) {
    const session = db.parkingSessions.find(s => s.id === sessionId)
    if (!session || session.paymentMethod !== 'debt') {
      return { success: false, message: 'Phiên không tồn tại hoặc không phải nợ' }
    }

    session.paymentMethod = 'paid'
    const user = db.users[email]
    if (user) {
      user.unpaidBalance = Math.max(0, (user.unpaidBalance || 0) - session.fee)
    }

    return { success: true, session }
  },

  // ─── History ──────────────────────────────────────────────────
  getCompletedSessions(email, limit = 20) {
    const user = db.users[email]
    if (!user || !user.card) return []
    return db.parkingSessions
      .filter(s => s.card === user.card && s.status === 'completed')
      .slice(-limit)
      .reverse()
  },

  // ─── Balance (BKPay) ───────────────────────────────────────────
  getBalance(email) {
    const user = db.users[email]
    return user ? { balance: user.balance, unpaidBalance: user.unpaidBalance || 0 } : null
  },

  updateBalance(email, amount) {
    const user = db.users[email]
    if (!user) return { success: false, message: 'User không tồn tại' }
    user.balance += amount
    return { success: true, balance: user.balance }
  },

  // ─── Revenue stats ─────────────────────────────────────────────
  getRevenueSummary() {
    const completed = db.parkingSessions.filter(s => s.status === 'completed')
    const totalRevenue = completed.reduce((sum, s) => {
      if (s.paymentMethod === 'cash' || s.paymentMethod === 'paid') return sum + (s.fee || 0)
      return sum
    }, 0)
    const totalDebt = completed.reduce((sum, s) => {
      if (s.paymentMethod === 'debt') return sum + (s.fee || 0)
      return sum
    }, 0)
    const guestRevenue = db.guestTickets
      .filter(t => t.status === 'expired')
      .reduce((sum, t) => sum + (t.fee || 0), 0)

    return {
      totalRevenue: totalRevenue + guestRevenue,
      sessionRevenue: totalRevenue,
      guestRevenue,
      totalDebt,
      totalSessions: completed.length,
    }
  },

  // ─── Pricing ───────────────────────────────────────────────────
  getPricing() {
    return { ...db.pricing }
  },

  updatePricing(newPricing) {
    Object.assign(db.pricing, newPricing)
    return db.pricing
  },

  getContactEmail(email) {
    const user = db.users[email]
    return user?.contactEmail || email
  },
}

module.exports = paymentService

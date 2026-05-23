// backend/services/dashboard.service.js
// Thống kê cho Admin/Staff dashboard

const db = require('../data/db')

const dashboardService = {
  getAdminStats() {
    const activeSessions = db.parkingSessions.filter(s => s.status === 'active')
    const completedToday = db.parkingSessions.filter(s => {
      if (s.status !== 'completed') return false
      const d = new Date(s.exitTime)
      const today = new Date()
      return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate()
    })

    const revenueToday = completedToday.reduce((sum, s) => {
      if (s.paymentMethod === 'cash' || s.paymentMethod === 'paid') return sum + (s.fee || 0)
      return sum
    }, 0)

    const totalSlots = db.zones.reduce((sum, z) => sum + z.capacity, 0)
    const usedSlots = db.zones.reduce((sum, z) => sum + z.occupied, 0)

    const onlineDevices = db.devices.filter(d => d.status === 'online').length

    return {
      activeVehicles: activeSessions.length,
      totalSlots,
      availableSlots: totalSlots - usedSlots,
      occupancyRate: totalSlots > 0 ? Math.round((usedSlots / totalSlots) * 100) : 0,
      revenueToday,
      sessionsToday: completedToday.length,
      onlineDevices,
      totalDevices: db.devices.length,
      totalUsers: Object.keys(db.users).length,
      pendingDebt: db.parkingSessions.filter(s => s.paymentMethod === 'debt').length,
      zones: db.zones.map(z => ({
        ...z,
        available: z.capacity - z.occupied,
        occupancyRate: Math.round((z.occupied / z.capacity) * 100),
      })),
    }
  },

  getStaffStats() {
    const stats = this.getAdminStats()
    // Staff chỉ xem thông tin liên quan đến bãi xe, không thấy revenue
    const { revenueToday, totalUsers, pendingDebt, ...staffStats } = stats
    return staffStats
  },

  getUserStats(email) {
    const user = db.users[email]
    if (!user) return null

    const userSessions = user.card
      ? db.parkingSessions.filter(s => s.card === user.card)
      : []

    const activeSessions = userSessions.filter(s => s.status === 'active')
    const completedSessions = userSessions.filter(s => s.status === 'completed')
    const debtSessions = completedSessions.filter(s => s.paymentMethod === 'debt')

    return {
      balance: user.balance || 0,
      unpaidBalance: user.unpaidBalance || 0,
      activeSession: activeSessions[0] || null,
      totalSessions: completedSessions.length,
      debtCount: debtSessions.length,
      zones: db.zones.map(z => ({
        id: z.id,
        name: z.name,
        available: z.capacity - z.occupied,
        capacity: z.capacity,
        occupancyRate: Math.round((z.occupied / z.capacity) * 100),
      })),
    }
  },
}

module.exports = dashboardService

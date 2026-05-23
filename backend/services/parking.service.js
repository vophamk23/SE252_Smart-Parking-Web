// backend/services/parking.service.js
// Business logic cho toàn bộ nghiệp vụ bãi đậu xe

const db = require('../data/db')

const parkingService = {
  // ─── Card ──────────────────────────────────────────────────────
  validateCard(cardId) {
    return db.registeredCards.find(c => c.card === cardId) || null
  },

  // ─── Sessions ─────────────────────────────────────────────────
  getActiveSession(cardId) {
    return db.parkingSessions.find(s => s.card === cardId && s.status === 'active') || null
  },

  getSessionById(sessionId) {
    return db.parkingSessions.find(s => s.id === sessionId) || null
  },

  getAllSessions() {
    return [...db.parkingSessions]
  },

  /**
   * Mở phiên gửi xe (normal mode)
   */
  openSession(cardId, zone = 'zone_a1') {
    const cardInfo = this.validateCard(cardId)
    if (!cardInfo) return { success: false, error: 'EF1_CARD_NOT_FOUND', message: 'Thẻ không hợp lệ' }

    const existing = this.getActiveSession(cardId)
    if (existing) return { success: false, error: 'EF3_DUPLICATE', message: 'Thẻ đang có phiên gửi xe mở' }

    const zoneInfo = db.zones.find(z => z.id === zone)
    if (!zoneInfo) return { success: false, error: 'EF2b_ZONE_INVALID', message: 'Khu vực không tồn tại' }
    if (zoneInfo.occupied >= zoneInfo.capacity) return { success: false, error: 'EF2a_ZONE_FULL', message: 'Khu vực đã đầy' }

    const session = {
      id: `SESSION_${Date.now()}`,
      card: cardId,
      vehicle: cardInfo.vehicle,
      vehicleType: cardInfo.vehicleType,
      zone,
      entryTime: new Date().toISOString(),
      exitTime: null,
      fee: 0,
      status: 'active',
      userRole: cardInfo.role,
      isOffline: false,
    }

    db.parkingSessions.push(session)
    zoneInfo.occupied++
    this._logAccess('ENTRY', cardId, cardInfo.vehicle, 'SUCCESS', session.id)

    return { success: true, session }
  },

  /**
   * Mở phiên gửi xe (offline mode — AF2)
   */
  openSessionOffline(cardId, zone = 'zone_a1') {
    const cardInfo = this.validateCard(cardId)
    const info = cardInfo || { card: cardId, vehicle: 'UNKNOWN', vehicleType: 'Không xác định', role: 'guest' }

    const session = {
      id: `SESSION_OFF_${Date.now()}`,
      card: cardId,
      vehicle: info.vehicle,
      vehicleType: info.vehicleType,
      zone,
      entryTime: new Date().toISOString(),
      exitTime: null,
      fee: 0,
      status: 'active',
      userRole: info.role,
      isOffline: true,
    }

    db.parkingSessions.push(session)
    db.pendingSync.push({ action: 'ENTRY', card: cardId, vehicle: info.vehicle, sessionId: session.id, timestamp: new Date().toISOString() })

    return { success: true, session }
  },

  /**
   * Đóng phiên gửi xe
   * @param {string} paymentMethod — 'cash' | 'debt' | 'paid'
   */
  closeSession(sessionId, paymentMethod = 'cash') {
    const session = db.parkingSessions.find(s => s.id === sessionId)
    if (!session || session.status !== 'active') {
      return { success: false, error: 'SESSION_NOT_FOUND', message: 'Phiên không tồn tại hoặc đã đóng' }
    }

    session.exitTime = new Date().toISOString()
    session.status = 'completed'
    session.paymentMethod = paymentMethod

    const hours = Math.max(1, Math.ceil((new Date(session.exitTime) - new Date(session.entryTime)) / (1000 * 60 * 60)))
    const pricing = db.pricing[session.userRole] || db.pricing.guest
    session.fee = pricing.hourly * hours

    const zone = db.zones.find(z => z.id === session.zone)
    if (zone) zone.occupied = Math.max(0, zone.occupied - 1)

    // Nếu trả nợ, cộng vào unpaidBalance của user
    if (paymentMethod === 'debt') {
      const user = Object.values(db.users).find(u => u.card === session.card)
      if (user) user.unpaidBalance = (user.unpaidBalance || 0) + session.fee
    }

    this._logAccess('EXIT', session.card, session.vehicle, 'SUCCESS', sessionId)

    return { success: true, session, fee: session.fee }
  },

  // ─── Guest Tickets ─────────────────────────────────────────────
  createGuestTicket(plate, vehicleType, zone = 'zone_a1') {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    const rand = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')

    const ticket = {
      id: `TEMP-${rand}`,
      plate,
      vehicleType,
      zone,
      createdAt: new Date().toISOString(),
      exitTime: null,
      status: 'active',
      fee: 0,
    }

    const zoneInfo = db.zones.find(z => z.id === zone)
    if (zoneInfo) zoneInfo.occupied++
    db.guestTickets.push(ticket)

    return ticket
  },

  getGuestTicket(ticketId) {
    return db.guestTickets.find(t => t.id === ticketId) || null
  },

  getAllGuestTickets() {
    return [...db.guestTickets]
  },

  expireGuestTicket(ticketId) {
    const ticket = db.guestTickets.find(t => t.id === ticketId)
    if (!ticket || ticket.status !== 'active') return null

    ticket.exitTime = new Date().toISOString()
    ticket.status = 'expired'
    const hours = Math.max(1, Math.ceil((new Date(ticket.exitTime) - new Date(ticket.createdAt)) / (1000 * 60 * 60)))
    ticket.fee = db.pricing.guest.hourly * hours

    const zoneInfo = db.zones.find(z => z.id === ticket.zone)
    if (zoneInfo) zoneInfo.occupied = Math.max(0, zoneInfo.occupied - 1)

    this._logAccess('EXIT', ticket.id, ticket.plate, 'SUCCESS')

    return ticket
  },

  // ─── Access Log ────────────────────────────────────────────────
  getAccessLog(limit = 50) {
    return db.accessLog.slice(-limit).reverse()
  },

  _logAccess(action, card, plate, result, sessionId = null) {
    const log = { timestamp: new Date().toISOString(), action, card, plate, result, sessionId }
    db.accessLog.push(log)
    if (db.accessLog.length > 1000) db.accessLog.shift()
    return log
  },

  // ─── Zones ─────────────────────────────────────────────────────
  getZones() {
    return [...db.zones]
  },

  getZoneCapacity(zoneId) {
    const zone = db.zones.find(z => z.id === zoneId)
    if (!zone) return null
    return { ...zone, available: zone.capacity - zone.occupied }
  },

  // ─── Offline Sync ──────────────────────────────────────────────
  getPendingSync() {
    return [...db.pendingSync]
  },

  clearPendingSync() {
    db.pendingSync = []
  },
}

module.exports = parkingService

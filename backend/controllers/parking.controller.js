// backend/controllers/parking.controller.js

const parkingService = require('../services/parking.service')

// POST /api/parking/entry
exports.entry = (req, res) => {
  const { cardId, zone } = req.body
  if (!cardId) return res.status(400).json({ message: 'cardId là bắt buộc' })
  const result = parkingService.openSession(cardId, zone)
  if (!result.success) return res.status(400).json(result)
  res.json(result)
}

// POST /api/parking/entry/offline
exports.entryOffline = (req, res) => {
  const { cardId, zone } = req.body
  if (!cardId) return res.status(400).json({ message: 'cardId là bắt buộc' })
  const result = parkingService.openSessionOffline(cardId, zone)
  res.json(result)
}

// POST /api/parking/exit
exports.exit = (req, res) => {
  const { sessionId, paymentMethod } = req.body
  if (!sessionId) return res.status(400).json({ message: 'sessionId là bắt buộc' })
  const result = parkingService.closeSession(sessionId, paymentMethod || 'cash')
  if (!result.success) return res.status(400).json(result)
  res.json(result)
}

// GET /api/parking/sessions
exports.getAllSessions = (req, res) => {
  res.json(parkingService.getAllSessions())
}

// GET /api/parking/sessions/active?card=
exports.getActiveSession = (req, res) => {
  const { card } = req.query
  if (!card) return res.status(400).json({ message: 'card là bắt buộc' })
  const session = parkingService.getActiveSession(card)
  res.json({ session: session || null })
}

// GET /api/parking/sessions/:id
exports.getSessionById = (req, res) => {
  const session = parkingService.getSessionById(req.params.id)
  if (!session) return res.status(404).json({ message: 'Không tìm thấy phiên' })
  res.json(session)
}

// POST /api/parking/guest-tickets
exports.createGuestTicket = (req, res) => {
  const { plate, vehicleType, zone } = req.body
  if (!plate || !vehicleType) return res.status(400).json({ message: 'plate và vehicleType là bắt buộc' })
  const ticket = parkingService.createGuestTicket(plate, vehicleType, zone)
  res.json({ success: true, ticket })
}

// GET /api/parking/guest-tickets/:id
exports.getGuestTicket = (req, res) => {
  const ticket = parkingService.getGuestTicket(req.params.id)
  if (!ticket) return res.status(404).json({ message: 'Không tìm thấy vé' })
  res.json(ticket)
}

// GET /api/parking/guest-tickets
exports.getAllGuestTickets = (req, res) => {
  res.json(parkingService.getAllGuestTickets())
}

// POST /api/parking/guest-tickets/:id/exit
exports.expireGuestTicket = (req, res) => {
  const ticket = parkingService.expireGuestTicket(req.params.id)
  if (!ticket) return res.status(404).json({ message: 'Không tìm thấy vé hoặc vé đã hết hạn' })
  res.json({ success: true, ticket, fee: ticket.fee })
}

// GET /api/parking/access-log
exports.getAccessLog = (req, res) => {
  const limit = parseInt(req.query.limit) || 50
  res.json(parkingService.getAccessLog(limit))
}

// GET /api/parking/cards/validate?card=
exports.validateCard = (req, res) => {
  const { card } = req.query
  if (!card) return res.status(400).json({ message: 'card là bắt buộc' })
  const cardInfo = parkingService.validateCard(card)
  if (!cardInfo) return res.status(404).json({ valid: false, message: 'Thẻ không hợp lệ' })
  res.json({ valid: true, cardInfo })
}

// GET /api/parking/sync/pending
exports.getPendingSync = (req, res) => {
  res.json(parkingService.getPendingSync())
}

// DELETE /api/parking/sync/pending
exports.clearPendingSync = (req, res) => {
  parkingService.clearPendingSync()
  res.json({ success: true })
}

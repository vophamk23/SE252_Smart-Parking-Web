// backend/controllers/payment.controller.js

const paymentService = require('../services/payment.service')

// GET /api/payment/debt?email=
exports.getDebtSessions = (req, res) => {
  const { email } = req.query
  if (!email) return res.status(400).json({ message: 'email là bắt buộc' })
  res.json(paymentService.getDebtSessions(email))
}

// POST /api/payment/debt/:sessionId/pay
exports.markSessionPaid = (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ message: 'email là bắt buộc' })
  const result = paymentService.markSessionPaid(req.params.sessionId, email)
  if (!result.success) return res.status(400).json(result)
  res.json(result)
}

// GET /api/payment/history?email=&limit=
exports.getHistory = (req, res) => {
  const { email, limit } = req.query
  if (!email) return res.status(400).json({ message: 'email là bắt buộc' })
  res.json(paymentService.getCompletedSessions(email, parseInt(limit) || 20))
}

// GET /api/payment/balance?email=
exports.getBalance = (req, res) => {
  const { email } = req.query
  if (!email) return res.status(400).json({ message: 'email là bắt buộc' })
  const data = paymentService.getBalance(email)
  if (!data) return res.status(404).json({ message: 'User không tồn tại' })
  res.json(data)
}

// POST /api/payment/balance/update
exports.updateBalance = (req, res) => {
  const { email, amount } = req.body
  if (!email || amount === undefined) return res.status(400).json({ message: 'email và amount là bắt buộc' })
  const result = paymentService.updateBalance(email, amount)
  if (!result.success) return res.status(400).json(result)
  res.json(result)
}

// GET /api/payment/revenue
exports.getRevenue = (req, res) => {
  res.json(paymentService.getRevenueSummary())
}

// GET /api/payment/contact-email?email=
exports.getContactEmail = (req, res) => {
  const { email } = req.query
  if (!email) return res.status(400).json({ message: 'email là bắt buộc' })
  res.json({ contactEmail: paymentService.getContactEmail(email) })
}

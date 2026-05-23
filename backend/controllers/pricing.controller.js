// backend/controllers/pricing.controller.js

const paymentService = require('../services/payment.service')

// GET /api/pricing
exports.get = (req, res) => {
  res.json(paymentService.getPricing())
}

// PUT /api/pricing — Admin only
exports.update = (req, res) => {
  const updated = paymentService.updatePricing(req.body)
  res.json({ success: true, pricing: updated })
}

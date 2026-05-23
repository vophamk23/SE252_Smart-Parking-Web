// backend/controllers/devices.controller.js

const db = require('../data/db')

// GET /api/devices
exports.getAll = (req, res) => {
  res.json([...db.devices])
}

// PUT /api/devices/:id/status
exports.updateStatus = (req, res) => {
  const { status } = req.body
  if (!status) return res.status(400).json({ message: 'status là bắt buộc' })

  const device = db.devices.find(d => d.id === req.params.id)
  if (!device) return res.status(404).json({ message: 'Thiết bị không tồn tại' })

  device.status = status
  res.json({ success: true, device })
}

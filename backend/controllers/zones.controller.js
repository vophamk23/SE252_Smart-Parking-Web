// backend/controllers/zones.controller.js

const parkingService = require('../services/parking.service')

// GET /api/zones
exports.getAll = (req, res) => {
  res.json(parkingService.getZones())
}

// GET /api/zones/:id/capacity
exports.getCapacity = (req, res) => {
  const data = parkingService.getZoneCapacity(req.params.id)
  if (!data) return res.status(404).json({ message: 'Khu vực không tồn tại' })
  res.json(data)
}

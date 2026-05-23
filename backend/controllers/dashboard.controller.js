// backend/controllers/dashboard.controller.js

const dashboardService = require('../services/dashboard.service')

// GET /api/dashboard/admin
exports.adminStats = (req, res) => {
  res.json(dashboardService.getAdminStats())
}

// GET /api/dashboard/staff
exports.staffStats = (req, res) => {
  res.json(dashboardService.getStaffStats())
}

// GET /api/dashboard/user?email=
exports.userStats = (req, res) => {
  const email = req.query.email || req.user?.email
  if (!email) return res.status(400).json({ message: 'email là bắt buộc' })
  const stats = dashboardService.getUserStats(email)
  if (!stats) return res.status(404).json({ message: 'User không tồn tại' })
  res.json(stats)
}

// backend/middlewares/auth.middleware.js
// Bảo vệ các route yêu cầu đăng nhập (JWT guard)

const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/env.config')

/**
 * Middleware xác thực JWT
 * Gắn req.user = { id, email, role } nếu token hợp lệ
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Không có token xác thực' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' })
  }
}

/**
 * Middleware kiểm tra role
 * Dùng sau authenticate
 * @param {...string} roles — Danh sách role được phép
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Không có quyền truy cập' })
  }
  next()
}

module.exports = { authenticate, requireRole }

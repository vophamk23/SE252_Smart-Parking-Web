// backend/services/auth.service.js

const db = require('../data/db')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/env.config')

class AuthService {
  async login(email, password) {
    const user = db.users[email]
    if (!user) throw new Error('Email không tồn tại')
    if (user.password !== password) throw new Error('Sai mật khẩu')

    const payload = { email: user.email, role: user.role, name: user.name }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    return {
      token,
      user: { email: user.email, name: user.name, role: user.role, title: user.title, card: user.card, vehicle: user.vehicle },
    }
  }

  async getCurrentUser(token) {
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = db.users[decoded.email]
    if (!user) throw new Error('User không tồn tại')
    const { password, ...safeUser } = user
    return safeUser
  }

  async logout() {
    // JWT là stateless — client tự xóa token
    return { success: true }
  }
}

module.exports = new AuthService()
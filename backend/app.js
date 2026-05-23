// backend/app.js
// Express app — đăng ký tất cả routes

const express = require('express')
const cors = require('cors')
const { CLIENT_URL, ALLOWED_ORIGINS, NODE_ENV } = require('./config/env.config')

const app = express()

// ─── CORS ─────────────────────────────────────────────────────
// Danh sách origin được phép (localhost + LAN + production)
const allowedList = ALLOWED_ORIGINS || [CLIENT_URL]

const corsOptions = {
  origin: (origin, callback) => {
    // Cho phép requests không có origin (Postman, mobile app, curl...)
    if (!origin) return callback(null, true)

    // Development: cho phép tất cả localhost và LAN IP
    if (NODE_ENV === 'development') {
      const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1')
      const isLAN = /^https?:\/\/192\.168\.|^https?:\/\/10\.|^https?:\/\/172\.(1[6-9]|2[0-9]|3[01])\./.test(origin)
      if (isLocalhost || isLAN) return callback(null, true)
    }

    // Kiểm tra trong danh sách cho phép
    if (allowedList.some(allowed => origin.startsWith(allowed))) {
      return callback(null, true)
    }

    callback(new Error(`CORS: Origin "${origin}" không được phép`))
  },
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())

// ─── Health check ──────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: NODE_ENV,
    allowedOrigins: allowedList,
  })
})

// ─── Routes ────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth.routes'))
app.use('/api/email',     require('./routes/email.routes'))
app.use('/api/parking',   require('./routes/parking.routes'))
app.use('/api/zones',     require('./routes/zones.routes'))
app.use('/api/payment',   require('./routes/payment.routes'))
app.use('/api/users',     require('./routes/users.routes'))
app.use('/api/pricing',   require('./routes/pricing.routes'))
app.use('/api/devices',   require('./routes/devices.routes'))
app.use('/api/dashboard', require('./routes/dashboard.routes'))

// ─── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route không tồn tại: ${req.method} ${req.path}` })
})

// ─── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.message)
  res.status(err.status || 500).json({ message: err.message || 'Lỗi server' })
})

module.exports = app
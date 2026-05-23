// backend/controllers/users.controller.js

const db = require('../data/db')

// GET /api/users — Admin only
exports.getAll = (req, res) => {
  const users = Object.values(db.users).map(u => ({
    email: u.email,
    name: u.name,
    role: u.role,
    title: u.title,
    card: u.card || null,
    vehicle: u.vehicle || null,
    balance: u.balance || 0,
    unpaidBalance: u.unpaidBalance || 0,
  }))
  res.json(users)
}

// GET /api/users/profile?email=
exports.getProfile = (req, res) => {
  const email = req.query.email || req.user?.email
  if (!email) return res.status(400).json({ message: 'email là bắt buộc' })

  const user = db.users[email]
  if (!user) return res.status(404).json({ message: 'User không tồn tại' })

  const { password, ...safeUser } = user
  res.json(safeUser)
}

// PUT /api/users/profile
exports.updateProfile = (req, res) => {
  const email = req.body.email || req.user?.email
  if (!email) return res.status(400).json({ message: 'email là bắt buộc' })

  const user = db.users[email]
  if (!user) return res.status(404).json({ message: 'User không tồn tại' })

  const { name, title, vehicle, contactEmail } = req.body
  if (name) user.name = name
  if (title) user.title = title
  if (vehicle) user.vehicle = vehicle
  if (contactEmail) user.contactEmail = contactEmail

  const { password, ...safeUser } = user
  res.json({ success: true, user: safeUser })
}

// GET /api/users/cards — Danh sách thẻ đã đăng ký
exports.getCards = (req, res) => {
  res.json(db.registeredCards)
}

// GET /api/users/cards/:cardId
exports.getCardById = (req, res) => {
  const card = db.registeredCards.find(c => c.card === req.params.cardId)
  if (!card) return res.status(404).json({ message: 'Không tìm thấy thẻ' })
  res.json(card)
}

// POST /api/users
exports.createUser = (req, res) => {
  const { email, password, role, name, title, vehicle, card, balance } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Email và password là bắt buộc' })
  if (db.users[email]) return res.status(400).json({ message: 'Email đã tồn tại' })
  
  db.users[email] = {
    email, password, role: role || 'user', name, title, vehicle, card,
    balance: balance || 0, unpaidBalance: 0
  }
  const { password: _, ...safeUser } = db.users[email]
  res.status(201).json(safeUser)
}

// PUT /api/users/:email
exports.updateUser = (req, res) => {
  const { email } = req.params
  const user = db.users[email]
  if (!user) return res.status(404).json({ message: 'User không tồn tại' })

  const updates = req.body
  Object.keys(updates).forEach(key => {
    if (key !== 'email' && key !== 'password' && updates[key] !== undefined) {
      user[key] = updates[key]
    }
  })
  const { password, ...safeUser } = user
  res.json(safeUser)
}

// DELETE /api/users/:email
exports.deleteUser = (req, res) => {
  const { email } = req.params
  if (!db.users[email]) return res.status(404).json({ message: 'User không tồn tại' })
  delete db.users[email]
  res.json({ success: true })
}


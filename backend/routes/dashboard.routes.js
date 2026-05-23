// backend/routes/dashboard.routes.js

const router = require('express').Router()
const ctrl = require('../controllers/dashboard.controller')
const { authenticate, requireRole } = require('../middlewares/auth.middleware')

router.get('/admin', authenticate, requireRole('admin'), ctrl.adminStats)
router.get('/staff', authenticate, requireRole('admin', 'staff'), ctrl.staffStats)
router.get('/user',  authenticate, ctrl.userStats)

module.exports = router

// backend/routes/devices.routes.js

const router = require('express').Router()
const ctrl = require('../controllers/devices.controller')
const { authenticate, requireRole } = require('../middlewares/auth.middleware')

router.get('/',              authenticate, ctrl.getAll)
router.put('/:id/status',   authenticate, requireRole('admin', 'staff'), ctrl.updateStatus)

module.exports = router

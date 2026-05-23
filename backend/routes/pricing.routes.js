// backend/routes/pricing.routes.js

const router = require('express').Router()
const ctrl = require('../controllers/pricing.controller')
const { authenticate, requireRole } = require('../middlewares/auth.middleware')

router.get('/',  authenticate, ctrl.get)
router.put('/',  authenticate, requireRole('admin'), ctrl.update)

module.exports = router

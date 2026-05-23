// backend/routes/zones.routes.js

const router = require('express').Router()
const ctrl = require('../controllers/zones.controller')
const { authenticate } = require('../middlewares/auth.middleware')

router.get('/',         authenticate, ctrl.getAll)
router.get('/:id/capacity', authenticate, ctrl.getCapacity)

module.exports = router

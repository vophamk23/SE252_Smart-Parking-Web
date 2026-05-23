// backend/routes/payment.routes.js

const router = require('express').Router()
const ctrl = require('../controllers/payment.controller')
const { authenticate, requireRole } = require('../middlewares/auth.middleware')

router.get('/debt',                        authenticate, ctrl.getDebtSessions)
router.post('/debt/:sessionId/pay',        authenticate, ctrl.markSessionPaid)
router.get('/history',                     authenticate, ctrl.getHistory)
router.get('/balance',                     authenticate, ctrl.getBalance)
router.post('/balance/update',             authenticate, ctrl.updateBalance)
router.get('/revenue',                     authenticate, requireRole('admin'), ctrl.getRevenue)
router.get('/contact-email',               authenticate, ctrl.getContactEmail)

module.exports = router

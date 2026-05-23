// backend/routes/parking.routes.js

const router = require('express').Router()
const ctrl = require('../controllers/parking.controller')
const { authenticate, requireRole } = require('../middlewares/auth.middleware')

// Card validation — ai cũng dùng được
router.get('/cards/validate', authenticate, ctrl.validateCard)

// Sessions
router.post('/entry',         authenticate, requireRole('admin', 'staff'), ctrl.entry)
router.post('/entry/offline', authenticate, requireRole('admin', 'staff'), ctrl.entryOffline)
router.post('/exit',          authenticate, requireRole('admin', 'staff'), ctrl.exit)
router.get('/sessions',       authenticate, requireRole('admin', 'staff'), ctrl.getAllSessions)
router.get('/sessions/active', authenticate, ctrl.getActiveSession)
router.get('/sessions/:id',   authenticate, ctrl.getSessionById)

// Guest tickets
router.post('/guest-tickets',           authenticate, requireRole('admin', 'staff'), ctrl.createGuestTicket)
router.get('/guest-tickets',            authenticate, requireRole('admin', 'staff'), ctrl.getAllGuestTickets)
router.get('/guest-tickets/:id',        authenticate, ctrl.getGuestTicket)
router.post('/guest-tickets/:id/exit',  authenticate, requireRole('admin', 'staff'), ctrl.expireGuestTicket)

// Access log
router.get('/access-log', authenticate, requireRole('admin', 'staff'), ctrl.getAccessLog)

// Offline sync
router.get('/sync/pending',    authenticate, requireRole('admin', 'staff'), ctrl.getPendingSync)
router.delete('/sync/pending', authenticate, requireRole('admin', 'staff'), ctrl.clearPendingSync)

module.exports = router

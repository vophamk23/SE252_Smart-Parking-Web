// backend/routes/users.routes.js

const router = require('express').Router()
const ctrl = require('../controllers/users.controller')
const { authenticate, requireRole } = require('../middlewares/auth.middleware')

router.get('/',           authenticate, requireRole('admin'), ctrl.getAll)
router.post('/',          authenticate, requireRole('admin'), ctrl.createUser)
router.put('/:email',     authenticate, requireRole('admin'), ctrl.updateUser)
router.delete('/:email',  authenticate, requireRole('admin'), ctrl.deleteUser)

router.get('/profile',    authenticate, ctrl.getProfile)
router.put('/profile',    authenticate, ctrl.updateProfile)
router.get('/cards',      authenticate, ctrl.getCards)
router.get('/cards/:cardId', authenticate, ctrl.getCardById)

module.exports = router

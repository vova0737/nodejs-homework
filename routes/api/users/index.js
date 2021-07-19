const express = require('express')
const router = express.Router()
const {
  register,
  login,
  logout,
  avatars,
  verify,
  repeatSendEmailVerify,
} = require('../../../controllers/users.js')
const guard = require('../../../helpers/guard')
const upload = require('../../../helpers/upload')

router.get('/verify/:token', verify)
router.post('/verify', repeatSendEmailVerify)
router.post('/register', register)
router.post('/login', login)
router.post('/logout', guard, logout)
router.patch('/avatars', [guard, upload.single('avatar')], avatars)

module.exports = router

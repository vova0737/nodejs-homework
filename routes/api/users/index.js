const express = require('express')
const router = express.Router()
const {
  register,
  login,
  logout,
  avatars,
} = require('../../../controllers/users.js')
const guard = require('../../../helpers/guard')
const upload = require('../../../helpers/upload')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', guard, logout)
router.patch('/avatars', [guard, upload.single('avatar')], avatars)

module.exports = router

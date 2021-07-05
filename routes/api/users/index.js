const express = require('express')
const router = express.Router()
const { register, login, logout } = require('../../../controllers/users.js')
const guard = require('../../../helpers/guard')

router.post('/register', register)
router.post('/login', login)
router.post('/logout', guard, logout)

module.exports = router

const express = require('express')
const router = express.Router()
const { getAll, getById, add, remove, update } = require('../../../controllers/contacts')
const { validateCreateContact, validateUpdateContact } = require('./validation')
const guard = require('../../../helpers/guard')

router.get('/', guard, getAll)

router.get('/:contactId', guard, getById)

router.post('/', guard, validateCreateContact, add)

router.delete('/:contactId', guard, remove)

router.patch('/:contactId', guard, validateUpdateContact, update)

module.exports = router

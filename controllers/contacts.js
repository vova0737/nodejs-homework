const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('../model/index')
const { httpCode } = require('../helpers/constants')

const getAll = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { contacts, total, page, limit } = await listContacts(
      userId,
      req.query
    )
    return res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
      data: { total, page, limit, contacts },
    })
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const userId = req.user.id
    const { contactId } = req.params
    const contact = await getContactById(userId, contactId)
    if (contact) {
      return res
        .status(httpCode.OK)
        .json({ status: 'success', code: httpCode.OK, data: { contact } })
    }
    return res.status(httpCode.NOT_FOUND).json({
      status: 'error',
      code: httpCode.NOT_FOUND,
      message: 'Not found!',
    })
  } catch (error) {
    next(error)
  }
}

const add = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await addContact({ ...req.body, owner: userId })
    return res
      .status(httpCode.OK)
      .json({ status: 'success', code: httpCode.OK, data: { contact } })
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.status = httpCode.BAD_REQUEST
    }
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await removeContact(userId, req.params.contactId)
    if (contact) {
      return res
        .status(httpCode.OK)
        .json({ status: 'success', code: httpCode.OK, data: { contact } })
    }
    return res.status(httpCode.NOT_FOUND).json({
      status: 'error',
      code: httpCode.NOT_FOUND,
      message: 'Not found!',
    })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await updateContact(userId, req.params.contactId, req.body)
    if (contact) {
      return res
        .status(httpCode.OK)
        .json({ status: 'success', code: httpCode.OK, data: { contact } })
    }
    return res.status(httpCode.NOT_FOUND).json({
      status: 'error',
      code: httpCode.NOT_FOUND,
      message: 'Not found!',
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAll,
  getById,
  add,
  remove,
  update,
}

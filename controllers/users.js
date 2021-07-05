const jwt = require('jsonwebtoken')
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
require('dotenv').config()
const Users = require('../model/schemas/users')
const { httpCode } = require('../helpers/constants')

const register = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email)
    if (user) {
      return res.status(httpCode.CONFLICT).json({
        status: 'error',
        code: httpCode.CONFLICT,
        message: 'Email is already used',
      })
    }
    const newUser = await Users.create(req.body)
    const { id, name, email, subscription } = newUser
    return res.status(httpCode.CREATED).json({
      status: 'success',
      code: httpCode.CREATED,
      data: {
        id,
        name,
        email,
        subscription,
      },
    })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await Users.findByEmail(email)
    const isValidPassword = await user.validPassword(password)
    if (!user || !isValidPassword) {
      return res.status(httpCode.UNAUTHORIZATED).json({
        status: 'error',
        code: httpCode.UNAUTHORIZATED,
        message: 'Invalid credentials',
      })
    }
    const payload = { id: user.id }
    const token = jwt.sign(payload, `${JWT_SECRET_KEY}`, { expiresIn: '2h' })
    await Users.updateToken(user.id, token)
    return res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
      data: {
        token,
      },
    })
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  await Users.updateToken(req.user.id, null)
  return res.status(httpCode.NO_CONTENT).json({})
}

module.exports = {
  register,
  login,
  logout,
}

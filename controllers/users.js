const jwt = require('jsonwebtoken')
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY
require('dotenv').config()
const UploadAvatar = require('../services/upload-avatars-local')
const Users = require('../model/schemas/users')
const { httpCode } = require('../helpers/constants')
const EmailService = require('../services/email')
const {
  СreateSenderSengrid,
  СreateSenderNodemailer,
} = require('../services/sender-email')
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS

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
    const { id, name, email, subscription, avatar, verifyToken } = newUser
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new СreateSenderSengrid()
      )
      await emailService.sendVeryPasswordEmail(verifyToken, email, name)
    } catch (error) {
      console.log(error.message)
    }
    return res.status(httpCode.CREATED).json({
      status: 'success',
      code: httpCode.CREATED,
      data: {
        id,
        name,
        email,
        subscription,
        avatar,
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
    const isValidPassword = await user?.validPassword(password)
    if (!user || !isValidPassword || !user.verify) {
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

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id
    const temp = new UploadAvatar(AVATARS_OF_USERS)
    const avatarURL = await temp.saveAvatarToStatic({
      idUser: id,
      pathFile: req.file.path,
      name: req.file.filename,
      oldFile: req.user.avatar,
    })
    await Users.updateAvatar(id, avatarURL)
    console.log(req.hostname)
    return res.json({
      status: 'success',
      code: httpCode.OK,
      data: { avatarURL },
    })
  } catch (error) {
    next(error)
  }
}

const verify = async (req, res, next) => {
  try {
    const user = await Users.getUserByVerifyToken(req.params.token)
    console.log(user)
    if (user) {
      await Users.updateVerifyToken(user.id, true, null)
      return res.status(httpCode.OK).json({
        status: 'success',
        code: httpCode.OK,
        message: 'Verification successfull!',
      })
    }
    return res.status(httpCode.NOT_FOUND).json({
      status: 'error',
      code: httpCode.NOT_FOUND,
      message: 'Your verification token is not valid!',
    })
  } catch (error) {
    next(error)
  }
}
const repeatSendEmailVerify = async (req, res, next) => {
  const user = await Users.findByEmail(req.body.email)
  if (user) {
    const { name, email, verifyToken, verify } = user
    if (!verify) {
      try {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new СreateSenderSengrid()
        )
        await emailService.sendVeryPasswordEmail(verifyToken, email, name)
        return res.status(httpCode.OK).json({
          status: 'success',
          code: httpCode.OK,
          message: 'Verification email resubmited',
        })
      } catch (error) {
        console.log(error.message)
        return next(error)
      }
    }
    return res.status(httpCode.CONFLICT).json({
      status: 'error',
      code: httpCode.CONFLICT,
      message: 'Email has already been verified',
    })
  }
  return res.status(httpCode.NOT_FOUND).json({
    status: 'error',
    code: httpCode.NOT_FOUND,
    message: 'User not found!',
  })
}

module.exports = {
  register,
  login,
  logout,
  avatars,
  verify,
  repeatSendEmailVerify,
}

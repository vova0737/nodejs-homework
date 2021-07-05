const passport = require('passport')
require('../config/passport')
const { httpCode } = require('./constants')

const guard = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user) => {
    let token = null
    if (req.get('Authorization')) {
      token = req.get('Authorization').split(' ')[1]
    }
    if (!user || err || token !== user.token) {
      return res.status(httpCode.UNAUTHORIZATED).json({
        status: 'error',
        code: httpCode.UNAUTHORIZATED,
        message: 'Access is denied'
      })
    }
    req.user = user
    return next()
  })(req, res, next)
}

module.exports = guard

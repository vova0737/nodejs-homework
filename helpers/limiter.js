const rateLimit = require('express-rate-limit')
const { httpCode } = require('../helpers/constants')
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 100 requests per windowMs
  handler: (req, res) => {
    res.status(httpCode.BAD_REQUEST).json({
      status: 'error',
      code: httpCode.BAD_REQUEST,
      message: 'Too many request, please try again later.',
    })
  },
})

module.exports = limiter

const express = require('express')
const logger = require('morgan')
const helmet = require('helmet')
const path = require('path')
const cors = require('cors')
const boolParser = require('express-query-boolean')
const limiter = require('./helpers/limiter')
const { httpCode } = require('./helpers/constants')

const contactsRouter = require('./routes/api/contacts')
const usersRouter = require('./routes/api/users')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'
app.use(helmet())

require('dotenv').config()

const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS
app.use(express.static(path.join(__dirname, AVATARS_OF_USERS)))

app.use(limiter)
app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json({ limit: 15000 }))
app.use(boolParser())
app.use('/api/users', usersRouter)
app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res
    .status(httpCode.NOT_FOUND)
    .json({ status: 'error', code: httpCode.NOT_FOUND, message: 'Not found' })
})

app.use((err, req, res, next) => {
  const code = err.status || httpCode.INTERNAL_SERVER_ERROR
  const status = err.status ? 'error' : 'fail'
  res.status(code).json({ status: status, code: code, message: err.message })
})

module.exports = app

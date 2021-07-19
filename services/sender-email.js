const sgMail = require('@sendgrid/mail')
const nodemailer = require('nodemailer')
const configEmail = require('../config/config')
require('dotenv').config()

class СreateSenderSengrid {
  async send(msg) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)

    return await sgMail.send({ ...msg, from: configEmail.email.sendgrid })
  }
}

class СreateSenderNodemailer {
  async send(msg) {
    const options = {
      host: 'smtp.meta.ua',
      port: 465,
      secure: true,
      auth: {
        user: configEmail.email.nodemailer,
        pass: process.env.PASSWORD,
      },
    }

    const transporter = nodemailer.createTransport(options)
    const emailOptions = {
      from: configEmail.email.nodemailer,
      ...msg,
    }

    return await transporter.sendMail(emailOptions)
  }
}

module.exports = { СreateSenderSengrid, СreateSenderNodemailer }

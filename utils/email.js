const nodemailer = require('nodemailer')

// Read SMTP config from env
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.example.com',
  port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
})

async function sendOtpEmail({ to, name, otp }) {
  const from = process.env.FROM_EMAIL || 'no-reply@example.com'
  const subject = 'Your password reset code'
  const html = `
    <p>Hi ${name || ''},</p>
    <p>Your password reset code is: <strong>${otp}</strong></p>
    <p>This code is valid for 5 minutes. If you did not request this, you can ignore this email.</p>
  `

  const info = await transport.sendMail({
    from,
    to,
    subject,
    html,
  })
  return info
}

module.exports = { sendOtpEmail }

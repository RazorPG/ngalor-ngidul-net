const { User } = require('../models/user')
const { sendOtpEmail } = require('../utils/email')
const crypto = require('crypto')
const util = require('util')

module.exports.registerForm = (req, res) => {
  res.render('pages/auth/register', { currentUser: req.user })
}

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body

    // Check if username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) {
      if (existingUser.username === username) {
        req.flash('error', 'Username is already taken')
      } else {
        req.flash('error', 'Email is already registered')
      }
      return res.redirect('/register')
    }

    const user = new User({ username, email })
    await User.register(user, password)
    req.flash('success', 'success register, you can login now!')
    res.redirect('/login')
  } catch (err) {
    if (err.message) req.flash('error', err.message)
    else req.flash('error', 'Failed to register. Please try again.')

    res.redirect('/register')
  }
}

module.exports.loginForm = (req, res) => {
  res.render('pages/auth/login', { currentUser: req.user })
}

module.exports.login = (req, res) => {
  req.flash('success', 'success login!')
  res.redirect('/home')
}

module.exports.logout = (req, res) => {
  req.logOut(err => {
    if (err) return next(err)
    res.redirect('/login')
  })
}

// ----- Forgot password + OTP flow -----
module.exports.forgotPasswordForm = (req, res) => {
  res.render('pages/auth/forgot-password', { currentUser: req.user })
}

module.exports.handleForgotPassword = async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if (!user) {
    req.flash('error', 'No account with that email address exists.')
    return res.redirect('/forgot')
  }

  // generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  // hash OTP before storing (HMAC-SHA256 with OTP_SECRET)
  // NOTE: set process.env.OTP_SECRET in production to a secure random value
  const otpSecret = process.env.OTP_SECRET || 'change_me_otp_secret'
  const hashOtp = value =>
    crypto.createHmac('sha256', otpSecret).update(value).digest('hex')
  const otpHash = hashOtp(otp)

  // store hashed OTP and expiry (5 minutes)
  user.otpToken = otpHash
  user.otpExpires = Date.now() + 5 * 60 * 1000
  await user.save()

  // send otp email
  try {
    await sendOtpEmail({ to: user.email, name: user.username, otp })
    // store email in session to track reset flow
    req.session.resetEmail = user.email
    req.flash('success', 'OTP sent to your email. It is valid for 5 minutes.')
    res.redirect('/verify-otp')
  } catch (err) {
    console.error('Failed sending OTP email:', err)
    req.flash('error', 'Failed to send OTP email. Please try again later.')
    res.redirect('/forgot')
  }
}

module.exports.verifyOtpForm = (req, res) => {
  res.render('pages/auth/verify-otp', { currentUser: req.user })
}

module.exports.handleVerifyOtp = async (req, res) => {
  const { otp } = req.body
  const email = req.session.resetEmail
  if (!email) {
    req.flash('error', 'No password reset request found. Please try again.')
    return res.redirect('/forgot')
  }
  const user = await User.findOne({ email })
  if (!user || !user.otpToken) {
    req.flash('error', 'Invalid or expired OTP. Please request a new one.')
    return res.redirect('/forgot')
  }

  if (Date.now() > user.otpExpires) {
    user.otpToken = undefined
    user.otpExpires = undefined
    await user.save()
    req.flash('error', 'OTP expired. Please request a new one.')
    return res.redirect('/forgot')
  }

  // Hash submitted OTP and compare with stored hashed token using timing-safe compare
  const otpSecret = process.env.OTP_SECRET || 'change_me_otp_secret'
  const hashOtp = value =>
    crypto.createHmac('sha256', otpSecret).update(value).digest('hex')
  const submittedHash = hashOtp(otp)

  let isValid = false
  try {
    const a = Buffer.from(submittedHash, 'hex')
    const b = Buffer.from(user.otpToken, 'hex')
    if (a.length === b.length && crypto.timingSafeEqual(a, b)) isValid = true
  } catch (err) {
    // any error -> invalid
    isValid = false
  }

  if (!isValid) {
    req.flash('error', 'Invalid OTP code.')
    return res.redirect('/verify-otp')
  }

  // OTP valid: allow password reset
  req.session.allowPasswordReset = true
  // clear otp to prevent reuse
  user.otpToken = undefined
  user.otpExpires = undefined
  await user.save()
  res.redirect('/reset-password')
}

module.exports.resetPasswordForm = (req, res) => {
  if (!req.session.allowPasswordReset) {
    req.flash('error', 'You are not authorized to reset password.')
    return res.redirect('/forgot')
  }
  res.render('pages/auth/reset-password', { currentUser: req.user })
}

module.exports.handleResetPassword = async (req, res, next) => {
  if (!req.session.allowPasswordReset) {
    req.flash('error', 'You are not authorized to reset password.')
    return res.redirect('/forgot')
  }

  const email = req.session.resetEmail
  const { password, confirmPassword } = req.body
  if (!password || password !== confirmPassword) {
    req.flash('error', 'Passwords do not match.')
    return res.redirect('/reset-password')
  }

  const user = await User.findOne({ email })
  if (!user) {
    req.flash('error', 'User not found. Please request reset again.')
    return res.redirect('/forgot')
  }

  // setPassword uses callback; wrap in a promise
  await new Promise((resolve, reject) => {
    user.setPassword(password, async err => {
      if (err) return reject(err)
      // clear session flags
      req.session.allowPasswordReset = undefined
      req.session.resetEmail = undefined
      await user.save()
      resolve()
    })
  })

  req.flash('success', 'Password has been reset. You can login now.')
  res.redirect('/login')
}

const { User } = require('../models/user')

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

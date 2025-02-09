const { User } = require('../models/user')

module.exports.registerForm = (req, res) => {
  res.render('pages/auth/register', { currentUser: req.user })
}

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    const user = new User({ username, email })
    await User.register(user, password)
    req.flash('success', 'success register, you can login now!')
    res.redirect('/login')
  } catch (err) {
    req.flash('error', 'Failed to register. Please try again.')
    res.redirect('/register')
  }
}

module.exports.loginForm = (req, res) => {
  res.render('pages/auth/login', { currentUser: req.user })
}

module.exports.login = (req, res) => {
  req.flash('success', 'success login!')
  res.redirect('/main')
}

module.exports.logout = (req, res) => {
  req.logOut(err => {
    if (err) return next(err)
    res.redirect('/login')
  })
}

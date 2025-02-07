const user = require('../models/user')

module.exports.registerForm = (req, res) => {
  res.render('pages/auth/register', { currentUser: req.user })
}

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body
    const user = new User({ username, email })
    await User.register(user, password)
    res.redirect('/login')
  } catch (err) {
    next(new ErrorHandler('Failed to register. Please try again.', 403))
  }
}

module.exports.loginForm = (req, res) => {
  res.render('pages/auth/login', { currentUser: req.user })
}

module.exports.logout = (req, res) => {
  req.logOut(err => {
    if (err) return next(err)
    res.redirect('/login')
  })
}

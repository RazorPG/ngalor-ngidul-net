module.exports = (req, res, next) => {
  const { username, password } = req.body
  if (!username || !password) {
    req.flash('error', 'username or password is required!')
    return res.redirect('/login')
  }
  next()
}

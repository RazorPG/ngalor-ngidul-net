module.exports = (req, res, next) => {
  if (req.user) {
    req.flash('error', 'you have logged in before')
    return res.redirect('/home')
  }
  next()
}

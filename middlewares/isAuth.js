module.exports = (req, res, next) => {
  if (req.user) {
    return next()
  }
  req.flash('error', 'You must be signed in first!')
  res.redirect('/login')
}

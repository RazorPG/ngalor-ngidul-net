module.exports = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      const message = error.details.map(msg => msg.message).join(',')
      req.flash('error', message)
      return res.redirect(req.originalUrl)
    }
    return next()
  }
}
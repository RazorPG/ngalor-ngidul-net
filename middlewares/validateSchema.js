const { ErrorHandler } = require('../utils/ErrorHandler')

module.exports = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      const message = error.details.map(msg => msg.message).join(',')
      req.flash('error', message)
      res.redirect('/register')
    }
    return next()
  }
}

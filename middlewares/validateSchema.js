const { ErrorHandler } = require('../utils/ErrorHandler')

module.exports = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error) {
      const message = error.details.map(msg => msg.message).join(',')
      return next(new ErrorHandler(message, 400))
    }
    return next()
  }
}

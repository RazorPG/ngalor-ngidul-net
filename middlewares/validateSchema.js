module.exports = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body)
    if (error)
      return res.status(error.statusCode).json({ error: error.message })
    next()
  }
}

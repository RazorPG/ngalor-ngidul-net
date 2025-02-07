const Joi = require('joi')

const userSchema = Joi.object({
  username: Joi.string().min(8).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

module.exports = { userSchema }

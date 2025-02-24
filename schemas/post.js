const Joi = require('joi')

const postSchema = Joi.object({
  title: Joi.string().min(5).max(20).required(),
  content: Joi.string().min(10).max(200).required(),
  createAt: Joi.date(),
})

module.exports = { postSchema }

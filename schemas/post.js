const Joi = require('joi')

const postSchema = Joi.object({
  title: Joi.string().min(5).max(50).required().messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 5 characters long',
    'string.max': 'Title must be at most 50 characters long',
  }),
  content: Joi.string().min(10).max(200).required().messages({
    'string.base': 'Content must be a string',
    'string.empty': 'Content is required',
    'string.min': 'Content must be at least 10 characters long',
    'string.max': 'Content must be at most 200 characters long',
  }),
  createAt: Joi.date(),
})

module.exports = { postSchema }

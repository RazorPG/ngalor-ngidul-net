const Joi = require('joi')

const loginSchema = Joi.object({
  username: Joi.string().min(5).max(30).pattern(/^\S+$/).required().messages({
    'string.base': 'Username must be a string',
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 5 characters long',
    'string.max': 'Username must be at most 30 characters long',
    'string.pattern.base': 'Username must not contain spaces',
  }),
  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/
    )
    .required()
    .messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base':
        'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character',
    }),
})

const registerSchema = Joi.object({
  username: Joi.string().min(5).max(30).pattern(/^\S+$/).required().messages({
    'string.base': 'Username must be a string',
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 5 characters long',
    'string.max': 'Username must be at most 30 characters long',
    'string.pattern.base': 'Username must not contain spaces',
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.empty': 'Email is required',
    'string.email': 'Email must be a valid email address',
  }),
  password: Joi.string()
    .min(8)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/
    )
    .required()
    .messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base':
        'Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 special character',
    }),
})

module.exports = { loginSchema, registerSchema }

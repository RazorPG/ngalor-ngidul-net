const express = require('express')
const { ErrorHandler } = require('../utils/ErrorHandler')
const passport = require('passport')
const { User } = require('../models/user')
const { userSchema } = require('../schemas/user')
const validateSchema = require('../middlewares/validateSchema')
const controllerAuth = require('../controllers/auth')
const wrapAsync = require('../utils/wrapAsync')
const router = express.Router()

router
  .route('/register')
  .get(controllerAuth.registerForm)
  .post(validateSchema(userSchema), wrapAsync(controllerAuth.register))

router
  .route('/login')
  .get(controllerAuth.loginForm)
  .post(
    passport.authenticate('local', {
      successRedirect: '/main',
      failureRedirect: '/login',
    })
  )

router.post('/logout', controllerAuth.logout)

module.exports = router

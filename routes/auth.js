const express = require('express')
const passport = require('passport')
const { loginSchema, registerSchema } = require('../schemas/user')
const validateSchema = require('../middlewares/validateSchema')
const controllerAuth = require('../controllers/auth')
const wrapAsync = require('../utils/wrapAsync')
const isGuest = require('../middlewares/isGuest')
const validateCredentials = require('../middlewares/validateCredentials')
const router = express.Router()

router
  .route('/register')
  .get(isGuest, controllerAuth.registerForm)
  .post(validateSchema(registerSchema), wrapAsync(controllerAuth.register))

router
  .route('/login')
  .get(isGuest, controllerAuth.loginForm)
  .post(
    validateSchema(loginSchema),
    validateCredentials,
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: {
        type: 'error',
        msg: 'invalid username or password',
      },
    }),
    controllerAuth.login
  )

router.post('/logout', controllerAuth.logout)

module.exports = router

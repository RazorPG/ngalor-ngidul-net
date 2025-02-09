const express = require('express')
const passport = require('passport')
const { userSchema } = require('../schemas/user')
const validateSchema = require('../middlewares/validateSchema')
const controllerAuth = require('../controllers/auth')
const wrapAsync = require('../utils/wrapAsync')
const isGuest = require('../middlewares/isGuest')
const router = express.Router()

router
  .route('/register')
  .get(isGuest, controllerAuth.registerForm)
  .post(validateSchema(userSchema), wrapAsync(controllerAuth.register))

router
  .route('/login')
  .get(isGuest, controllerAuth.loginForm)
  .post(
    passport.authenticate('local', {
      failureRedirect: '/login',
    }),
    controllerAuth.login
  )

router.post('/logout', controllerAuth.logout)

module.exports = router

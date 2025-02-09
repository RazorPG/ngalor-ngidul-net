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
    (req, res, next) => {
      const { username, password } = req.body
      if (!username || !password) {
        req.flash('error', 'username or password is required!')
        return res.redirect('/login')
      }

      next()
    },
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

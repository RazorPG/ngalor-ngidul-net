const express = require('express')
const { ErrorHandler } = require('../utils/ErrorHandler')
const passport = require('passport')
const { User } = require('../models/user')
const { userSchema } = require('../schemas/user')
const validateSchema = require('../middlewares/validateSchema')
const wrapAsync = require('../utils/wrapAsync')
const router = express.Router()

router
  .route('/register')
  .get((req, res) => {
    res.render('pages/auth/register', { currentUser: req.user })
  })
  .post(
    validateSchema(userSchema),
    wrapAsync(async (req, res, next) => {
      try {
        const { username, email, password } = req.body
        const user = new User({ username, email })
        await User.register(user, password)
        res.redirect('/login')
      } catch (err) {
        next(new ErrorHandler('Failed to register. Please try again.', 403))
      }
    })
  )

router
  .route('/login')
  .get((req, res) => {
    res.render('pages/auth/login', { currentUser: req.user })
  })
  .post(
    passport.authenticate('local', {
      successRedirect: '/main',
      failureRedirect: '/login',
    })
  )

router.post('/logout', (req, res) => {
  req.logOut(err => {
    if (err) return next(err)
    res.redirect('/login')
  })
})

module.exports = router

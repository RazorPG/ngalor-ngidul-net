const express = require('express')
const { ErrorHandler } = require('../utils/ErrorHandler')
const passport = require('passport')
const router = express.Router()

router
  .route('/register')
  .get((req, res) => {
    res.render('pages/auth/register')
  })
  .post(async (req, res, next) => {
    try {
      const { username, email, password } = req.body
      const user = new User({ username, email })
      await User.register(user, password)
      res.redirect('/login')
    } catch (error) {
      return next(
        new ErrorHandler('Failed to register. Please try again.', 403)
      )
    }
  })

router
  .route('/login')
  .get((req, res) => {
    res.render('pages/auth/login')
  })
  .post(
    passport.authenticate('local', {
      failureRedirect: '/login',
    }),
    async (req, res) => {
      const { username } = req.body
      const user = await User.findOne({ username })
      if (!user) {
        return res.redirect('/login')
      }
      res.redirect(`/main/${user._id}`)
    }
  )

router.post('/logout', (req, res) => {
  req.logOut(err => {
    if (err) return next(err)
    res.redirect('/login')
  })
})

module.exports = router

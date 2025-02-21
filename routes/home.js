const express = require('express')
const passport = require('passport')
const { Post } = require('../models/post')
const validateSchema = require('../middlewares/validateSchema')
const controllerAuth = require('../controllers/auth')
const wrapAsync = require('../utils/wrapAsync')
const isGuest = require('../middlewares/isGuest')
const validateCredentials = require('../middlewares/validateCredentials')
const isAuth = require('../middlewares/isAuth')
const router = express.Router()

router.route('/').get(isAuth, async (req, res) => {
  if (!req.user) return res.redirect('/login')
  const posts = await Post.find({})
  res.render('pages/home/index', { currentUser: req.user, posts })
})

router
  .route('/post')
  .get(isAuth, async (req, res) => {
    res.render('pages/home/post')
  })
  .post(
    wrapAsync(async (req, res) => {
      const { title, content } = req.body
      const post = new Post({
        title,
        content,
        createAt: Date.now(),
        user_id: req.user._id,
      })
      await post.save()
      res.redirect('/home')
    })
  )

module.exports = router

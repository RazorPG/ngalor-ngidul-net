const isAuth = require('../middlewares/isAuth')
const controllerHome = require('../controllers/home.js')
const wrapAsync = require('../utils/wrapAsync.js')
const express = require('express')
const validateSchema = require('../middlewares/validateSchema.js')
const { postSchema } = require('../schemas/post.js')
const isAuthorPost = require('../middlewares/isAuthorPost.js')

const router = express.Router()

router.route('/').get(wrapAsync(controllerHome.homePage))

router
  .route('/post')
  .get(isAuth, controllerHome.postPage)
  .post(wrapAsync(controllerHome.postStore))

router
  .route('/post/:id/edit')
  .get(isAuth, isAuthorPost, wrapAsync(controllerHome.editPage))
  .put(
    isAuth,
    wrapAsync(isAuthorPost),
    validateSchema(postSchema),
    wrapAsync(controllerHome.update)
  )

module.exports = router

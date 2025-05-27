const isAuth = require('../middlewares/isAuth')
const controllerHome = require('../controllers/home.js')
const wrapAsync = require('../utils/wrapAsync.js')
const express = require('express')
const validateSchema = require('../middlewares/validateSchema.js')
const { postSchema } = require('../schemas/post.js')
const isAuthorPost = require('../middlewares/isAuthorPost.js')
const { upload } = require('../utils/upload.js')
const router = express.Router()

router.route('/').get(wrapAsync(controllerHome.homePage))

router
  .route('/posts')
  .get(isAuth, controllerHome.postPage)
  .post(upload.single('image'), wrapAsync(controllerHome.postStore))

router
  .route('/posts/:id')
  .put(
    upload.single('image'),
    isAuth,
    isAuthorPost,
    validateSchema(postSchema),
    wrapAsync(controllerHome.update)
  )
  .delete(isAuth, isAuthorPost, wrapAsync(controllerHome.destroy))

router
  .route('/posts/:id/edit')
  .get(isAuth, isAuthorPost, controllerHome.editPage)

module.exports = router

const isAuth = require('../middlewares/isAuth')
const controllerHome = require('../controllers/home.js')
const wrapAsync = require('../utils/wrapAsync.js')
const express = require('express')
const validateSchema = require('../middlewares/validateSchema.js')
const { postSchema } = require('../schemas/post.js')

const router = express.Router()

router.route('/').get(wrapAsync(controllerHome.homePage))

router
  .route('/post')
  .get(isAuth, controllerHome.postPage)
  .post(wrapAsync(controllerHome.postStore))

router
  .route('/post/:id/edit')
  .get(isAuth, wrapAsync(controllerHome.editPage))
  .put(isAuth, validateSchema(postSchema), wrapAsync(controllerHome.update))

module.exports = router

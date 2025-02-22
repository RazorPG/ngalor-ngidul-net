const isAuth = require('../middlewares/isAuth')
const controllerHome = require('../controllers/home.js')
const wrapAsync = require('../utils/wrapAsync.js')
const express = require('express')

const router = express.Router()

router.route('/').get(controllerHome.homePage)

router
  .route('/post')
  .get(isAuth, controllerHome.postPage)
  .post(wrapAsync(controllerHome.postStore))

module.exports = router

const express = require('express')
const router = express.Router()

router.get('/privacy-policy', (req, res) => {
  res.render('pages/info/privacy-policy')
})

router.get('/terms-of-service', (req, res) => {
  res.render('pages/info/terms-of-service')
})

router.get('/contact-us', (req, res) => {
  res.render('pages/info/contact-us')
})

module.exports = router

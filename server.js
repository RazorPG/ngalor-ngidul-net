const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const LocalStrategy = require('passport-local').Strategy
const ejsMate = require('ejs-mate')
require('./config/db') // konfigurasi database

const { User } = require('./models/user')

// load environment variables
dotenv.config()

const app = express()

// tempate engine ejs Mate
app.engine('ejs', ejsMate)

// konfigurasi express-session
app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
  })
)

// inisiasi passport dan sesi passport
app.use(passport.initialize())
app.use(passport.session())

// konfigurasi lokal passport
passport.use(new LocalStrategy(User.authenticate()))

// getter dan setter pengguna
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// template engine ejs
app.set('view engine', 'ejs')
// directory untuk file view (EJS)
app.set('views', path.join(__dirname, 'views'))

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

//
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})

app.get('/', (req, res) => {
  res.render('pages/index')
})

app.use('/', require('./routes/auth'))

app.get('/main', (req, res) => {
  if (!req.user) return res.redirect('/login')
  res.render('pages/main', { currentUser: req.user })
})

// middleware untuk error
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err
  if (!err.message) err.message = 'oh no, something went wrong!'
  res.status(statusCode).render('pages/error', { err })
})

app.listen(3000, () => {
  console.log(`app listen to http://localhost:${process.env.PORT}`)
})

const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const flash = require('connect-flash')
const passport = require('passport')
const session = require('express-session')
const methodOverride = require('method-override')
const { ErrorHandler } = require('./utils/ErrorHandler')
const LocalStrategy = require('passport-local').Strategy
const ejsMate = require('ejs-mate')
const connectMongo = require('./config/db')

const { User } = require('./models/user')
const isGuest = require('./middlewares/isGuest')

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

// parsing body untuk form
app.use(methodOverride('_method'))

// konfigurasi pesan cepat (flash)
app.use(flash())

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

// varible local session / cookie
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.success_msg = req.flash('success')
  res.locals.error_msg = req.flash('error')
  next()
})

app.get('/', isGuest, (req, res) => {
  res.render('pages/index')
})

app.use('/', require('./routes/auth'))
app.use('/home', require('./routes/home'))
app.use('/', require('./routes/info'))

app.all('*', (req, res, next) => {
  next(new ErrorHandler('page no found!', 404))
})
// middleware untuk error
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err
  if (!err.message) err.message = 'oh no, something went wrong!'
  res.status(statusCode).render('pages/error', { err })
})

connectMongo()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 App listening at http://localhost:${process.env.PORT}`)
    })
  })
  .catch(err => {
    console.error('❌ Failed to connect to MongoDB. Server not started.')
  })

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

// middlware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  res.render('pages/index')
})

app.get('/register', (req, res) => {
  res.render('pages/auth/register')
})

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body
    const user = new User({ username, email })
    await User.register(user, password)
    res.redirect('/login')
  } catch (error) {
    console.error(error.message)
    res.redirect('/register')
  }
})

app.get('/login', (req, res) => {
  res.render('pages/auth/login')
})

app.post(
  '/login',
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

app.post('/logout', (req, res) => {
  req.logOut(err => {
    if (err) return next(err)
    res.redirect('/login')
  })
})

app.get('/main/:id', async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)
  res.render('pages/main', { user })
})

app.listen(3000, () => {
  console.log(`app listen to http://localhost:${process.env.PORT}`)
})

const express = require('express')
const dotenv = require('dotenv')
const path = require('path')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const ejsMate = require('ejs-mate')
require('./config/db') // konfigurasi database

const { User } = require('./models/user')

// load environment variables
dotenv.config()

const app = express()

// tempate engine ejs Mate
app.engine('ejs', ejsMate)

// template engine ejs
app.set('view engine', 'ejs')
// directory untuk file view (EJS)
app.set('views', path.join(__dirname, 'views'))

// middlware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

// contoh route
app.get('/', (req, res) => {
  res.render('pages/index')
})

app.get('/register', (req, res) => {
  res.render('pages/auth/register')
})

app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    res.redirect('/login')
  } catch (error) {
    console.error(error.message)
  }
})

app.get('/login', (req, res) => {
  res.render('pages/auth/login')
})

app.post('/login', async (req, res) => {
  try {
    const user = req.body
    const isUser = await User.findOne(user)
    if (isUser) {
      res.redirect(`/main/${isUser._id}`)
    }
  } catch (error) {
    console.error(error.message)
    res.redirect('/login')
  }
})

app.get('/main/:id', async (req, res) => {
  const { id } = req.params
  const user = await User.findById(id)
  res.render('pages/main', { user })
})

app.listen(3000, () => {
  console.log(`app listen to http://localhost:${process.env.PORT}`)
})

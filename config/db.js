// config/db.js
const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

let isConnected = false

async function connectMongo() {
  if (isConnected) {
    console.log('🟡 MongoDB already connected, using existing connection')
    return
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'sosmed_db',
    })

    isConnected = true
    console.log('🟢 MongoDB connected successfully')
  } catch (err) {
    console.error('🔴 MongoDB connection error:', err.message)
    throw err
  }
}

module.exports = connectMongo

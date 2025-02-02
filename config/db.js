const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

module.exports = mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('success connected to mongodb'))
  .catch(err => console.error(err))

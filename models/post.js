const mongoose = require('mongoose')
const { Schema } = mongoose

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
})

module.exports = mongoose.model('Post', postSchema)

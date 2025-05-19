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
  image: {
    type: String,
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

const Post = mongoose.model('Post', postSchema)
module.exports = { Post }

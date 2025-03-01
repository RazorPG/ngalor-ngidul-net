const { Post } = require('../models/post')

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params
    const posts = await Post.findById(id).populate('user_id')

    if (!posts) {
      req.flash('error', 'post is not found!')
      return res.redirect('/home')
    }
    if (posts.user_id._id.toString() !== req.user._id.toString()) {
      req.flash('error', "you don't permission!")
      return res.redirect('/home')
    }
    req.post = posts
    next()
  } catch (err) {
    next(err)
  }
}

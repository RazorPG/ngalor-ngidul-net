const { Post } = require('../models/post')

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params
    const post = await Post.findById(id).populate('user_id')

    if (!post) {
      req.flash('error', 'post is not found!')
      return res.redirect('/home')
    }
    if (post.user_id._id.toString() !== req.user._id.toString()) {
      req.flash('error', "you don't permission!")
      return res.redirect('/home')
    }
    req.post = post
    next()
  } catch (err) {
    next(err)
  }
}

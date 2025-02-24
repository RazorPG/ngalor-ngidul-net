const { Post } = require('../models/post')
const { ErrorHandler } = require('../utils/ErrorHandler')

module.exports.homePage = async (req, res) => {
  if (!req.user) return res.redirect('/login')
  const posts = await Post.find().populate('user_id')
  res.render('pages/home/index', { currentUser: req.user, posts })
}

module.exports.postPage = (req, res) => {
  res.render('pages/home/post')
}

module.exports.postStore = async (req, res) => {
  const { title, content } = req.body
  const post = new Post({
    title,
    content,
    createAt: Date.now(),
    user_id: req.user._id,
  })
  await post.save()
  res.redirect('/home')
}

module.exports.editPage = async (req, res, next) => {
  const { id } = req.params
  const post = await Post.findById(id)
  if (post) {
    res.render('pages/home/editPost', { post })
  } else {
    next(new ErrorHandler('post_id not found!', 404))
  }
}

module.exports.update = async (req, res, next) => {
  const { title, content } = req.body
  const { id } = req.params

  const post = await Post.findById(id)

  if (post) {
    await Post.findByIdAndUpdate(id, {
      title,
      content,
      createAt: Date.now(),
    })
    req.flash('success', 'success update post!')
    res.redirect(`/home`)
  } else {
    req.flash('error', 'failed update post!')
    res.redirect(`/home/post/${id}/edit`)
  }
}

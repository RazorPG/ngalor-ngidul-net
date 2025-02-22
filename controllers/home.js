const isAuth = require('../middlewares/isAuth')
const { Post } = require('../models/post')

module.exports.homePage = async (req, res) => {
  if (!req.user) return res.redirect('/login')
  const posts = await Post.find({})
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

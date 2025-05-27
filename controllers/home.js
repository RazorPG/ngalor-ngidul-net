const { Post } = require('../models/post')
const { ErrorHandler } = require('../utils/ErrorHandler')
const cloudinary = require('cloudinary').v2
const path = require('path')
const fs = require('fs')

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

  if (req.file) {
    const pathfile = req.file.path
    try {
      post.image = {
        url: pathfile,
        public_id: req.file.filename,
      }
    } catch (err) {
      req.flash('error', 'failed upload image to cloudinary: ' + err.message)
      return res.redirect('/home')
    }
  }

  await post.save()
  req.flash('success', 'success upload post!')
  res.redirect('/home')
}

module.exports.editPage = (req, res, next) => {
  if (res.headersSent) return

  if (req.post) {
    res.render('pages/home/editPost', { post: req.post })
  } else {
    next(new ErrorHandler('post_id not found!', 404))
  }
}

module.exports.update = async (req, res, next) => {
  const { title, content } = req.body
  const { id } = req.params
  const post = await Post.findById(id).populate('user_id')

  // Cek apakah ada file baru diupload
  if (req.file) {
    const newImagePath = req.file.path
    // Simpan gambar

    try {
      if (post.image && post.image.public_id) {
        await cloudinary.uploader.destroy(post.image.public_id)
      }
      post.image = {
        url: newImagePath,
        public_id: req.file.filename,
      }
    } catch (err) {
      req.flash('error', 'failed update image to cloudinary: ' + err.message)
      return res.redirect('/home')
    }
  }

  await post.save()

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

module.exports.destroy = async (req, res) => {
  const { id } = req.params
  const post = await Post.findByIdAndDelete(id)
  // Hapus gambar jika ada
  if (post.image && post.image.public_id) {
    try {
      await cloudinary.uploader.destroy(post.image.public_id)
    } catch (err) {
      req.flash('error', 'failed delete image in cloudinary')
      req.redirect('/home')
    }
  }

  if (post) {
    req.flash('success', 'success delete post!')
    res.redirect('/home')
  } else {
    req.flash('error', 'failed delete post!')
    res.redirect(`/home/post/${id}/edit`)
  }
}

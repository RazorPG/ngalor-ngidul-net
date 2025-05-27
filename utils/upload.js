const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const path = require('path')
const cloudinary = require('cloudinary').v2

// konfigurasi cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // nama folder di Cloudinary
    format: async (req, file) => {
      // otomatis gunakan ekstensi asli (jpg, png, dll)
      return path.extname(file.originalname).slice(1)
    },
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
      return file.fieldname + '-' + uniqueSuffix
    },
  },
})

const upload = multer({ storage: storage })

module.exports = { upload, cloudinary }

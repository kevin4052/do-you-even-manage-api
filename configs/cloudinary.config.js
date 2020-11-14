const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  // folder: 'doYouManage',
  // allowedFormats: ['jpg', 'png'],
  params: {
    folder: 'doYouManage',
    allowedFormats: ['ipg', 'png']
  },
  // params: { resource_type: 'raw' }, => this is in case you want to upload other type of files, not just images
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

module.exports = multer({ storage });

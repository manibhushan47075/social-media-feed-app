// middleware/uploadMiddleware.js

const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;

  const isValidExt = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only image files (jpeg, jpg, png, gif, webp) are allowed'
      )
    );
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

module.exports = upload;
const multer = require('multer');
const { ApiError } = require('../utils/ApiError');

const MAX_SIZE = 50 * 1024 * 1024; // 50 MB

const ALLOWED_MIMES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
  'video/quicktime',
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_SIZE },
  fileFilter: (_req, file, cb) => {
    console.log('📁 File received:', file.originalname, '| MIME:', file.mimetype);
    if (!ALLOWED_MIMES.includes(file.mimetype)) {
      return cb(
        ApiError.badRequest(
          `File type not allowed: ${file.mimetype}`,
          'INVALID_FILE_TYPE'
        )
      );
    }
    cb(null, true);
  },
});

const uploadSingle = upload.single('file');

function handleUpload(req, res, next) {
  console.log('📥 Upload request received');
  console.log('   Content-Type:', req.headers['content-type']);

  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.error('❌ Multer error:', err.code, err.message);
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(ApiError.badRequest('File too large (max 50 MB)', 'FILE_TOO_LARGE'));
      }
      return next(ApiError.badRequest(err.message, 'UPLOAD_ERROR'));
    }
    if (err) {
      console.error('❌ Upload error:', err.message);
      return next(err);
    }
    console.log('✅ File parsed:', req.file ? req.file.originalname : 'NO FILE');
    next();
  });
}

module.exports = { handleUpload };
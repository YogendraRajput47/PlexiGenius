const multer = require('multer');
const path = require('path');
const DatauriParser = require('datauri/parser');
const cloudinary = require('../config/cloudinary');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const parser = new DatauriParser();

async function uploadBufferToCloudinary(buffer, originalname) {
  const ext = path.extname(originalname).toString();
  const dataUri = parser.format(ext, buffer);
  const result = await cloudinary.uploader.upload(dataUri.content, {
    folder: 'crm_leads',
    use_filename: true,
    unique_filename: false,
  });
  return result.secure_url;
}

module.exports = (req, res, next) => {
  const single = upload.single('image');
  single(req, res, async (err) => {
    if (err) return next(err);
    try {
      if (req.file && req.file.buffer) {
        const url = await uploadBufferToCloudinary(req.file.buffer, req.file.originalname);
        req.file.path = url;
      }
      next();
    } catch (error) {
      next(error);
    }
  });
};

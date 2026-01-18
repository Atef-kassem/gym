const multer = require("multer");
const path = require("path");
const appError = require("./appError");

// إعداد multer لتخزين الملفات محليًا
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "Uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  if (filetypes.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new appError("Images only (JPEG/PNG)", 400));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // حد 5 ميجابايت
});

module.exports = {
  uploadFile: (fieldName) => upload.single(fieldName), // لتحديد اسم الحقل (مثل 'icon' أو 'image')
};

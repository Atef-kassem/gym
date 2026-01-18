const multer = require("multer");
const path = require("path");
const fs = require("fs");
const appError = require("../utils/appError");

// إعداد Multer لرفع الملفات محليًا
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../Uploads");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // حد 10 ميجا للملفات
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new appError("فقط الصور (jpg, jpeg, png) وملفات PDF مسموح بها", 400));
  },
});

// دالة ديناميكية لمعالجة الملفات المرفوعة محليًا
const uploadFilesLocally = async (files, modelFields) => {
  // فحص وجود الملفات
  if (!files) {
    console.log('No files provided to uploadFilesLocally');
    return [];
  }
  
  console.log('📦 معالجة الملفات:', {
    filesType: Array.isArray(files) ? 'Array' : 'Object',
    filesLength: Array.isArray(files) ? files.length : Object.keys(files).length,
    modelFields
  });
  
  const uploadedFiles = [];
  
  // إذا كانت files مصفوفة (من upload.any())
  if (Array.isArray(files)) {
    for (const file of files) {
      if (file && file.filename && file.fieldname) {
        // البحث عن اسم الحقل في modelFields
        const matchingField = modelFields.find(field => 
          file.fieldname === field || file.fieldname.startsWith(field)
        );
        
        if (matchingField) {
          uploadedFiles.push({
            fieldName: matchingField,
            link: `/Uploads/${file.filename}`,
          });
          console.log(`✅ ملف تم رفعه: ${matchingField} -> /Uploads/${file.filename}`);
        } else {
          console.log(`⚠️ ملف غير متطابق: ${file.fieldname}`);
        }
      }
    }
  } 
  // إذا كانت files كائن (من upload.fields())
  else if (typeof files === 'object') {
    for (const fieldName of modelFields) {
      if (files[fieldName] && Array.isArray(files[fieldName]) && files[fieldName].length > 0) {
        const file = files[fieldName][0];
        if (file && file.filename) {
          uploadedFiles.push({
            fieldName,
            link: `/Uploads/${file.filename}`,
          });
          console.log(`✅ ملف تم رفعه: ${fieldName} -> /Uploads/${file.filename}`);
        }
      }
    }
  }
  
  console.log(`📊 إجمالي الملفات المرفوعة: ${uploadedFiles.length}`);
  return uploadedFiles;
};

// Middleware ديناميكي لرفع الملفات بناءً على حقول الموديل
const dynamicUpload = (modelFields) => {
  return upload.fields(modelFields.map((field) => ({ name: field, maxCount: 1 })));
};

// Middleware عام لرفع أي ملفات
const uploadHandler = upload.any();

module.exports = { dynamicUpload, uploadFilesLocally, uploadHandler };

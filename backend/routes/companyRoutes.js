const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const companyController = require("../controllers/companyController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

// تطبيق middleware المصادقة على جميع المسارات
router.use(isLoggedIn);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images, PDFs, and common document formats
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'), false);
    }
  }
});

// Company routes
router
  .route("/")
  .get(companyController.getAllCompanies)
  .post(companyController.createCompany);

router
  .route("/current")
  .get(companyController.getCurrentCompany);

router
  .route("/:id")
  .get(companyController.getCompany)
  .put(companyController.updateCompany)
  .delete(companyController.deleteCompany);

// Company attachments routes
router
  .route("/:id/attachments")
  .get(companyController.getCompanyAttachments)
  .post(upload.single('file'), companyController.uploadAttachment);

router
  .route("/:id/attachments/:attachmentId")
  .delete(companyController.deleteAttachment);

// Company account routes
router
  .route("/:id/account")
  .get(companyController.getCompanyAccount)
  .post(companyController.upsertCompanyAccount)
  .put(companyController.upsertCompanyAccount);

router
  .route("/:id/account/password")
  .put(companyController.updateAccountPassword);

module.exports = router;

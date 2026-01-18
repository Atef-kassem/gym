const express = require("express");
const router = express.Router();
const branchController = require("../controllers/branchesController");
const storageController = require("../controllers/storageController");

const { dynamicUpload } = require("../middlewares/fileUpload");

const branchFileFields = ["branchImageAttachment", "licenceAttachment", "anotherAttachments"];
const storageFileFields = [
  "storageImageAttachment",
  "licenceAttachment",
  "safetyCertificationAttachment",
  "WarehousePlansAttachment",
  "inventoryReportsAttachment",
  "anotherAttachments",
];

router.route("/")
  .get(branchController.getAllBranches)
  .post(dynamicUpload(branchFileFields), branchController.createBranch);

// GET /api/v1/branches/active - الحصول على الفروع النشطة فقط
router.get("/active", async (req, res) => {
  try {
    const { Branch } = require("../Model/index");
    
    console.log('🔍 جلب الفروع النشطة...');
    
    const branches = await Branch.findAll({
      where: { isActive: 1 },
      attributes: ['id', 'arabicName', 'englishName', 'code'],
      order: [['arabicName', 'ASC']]
    });
    
    console.log(`✅ تم العثور على ${branches.length} فرع نشط`);
    
    res.json({
      success: true,
      data: branches
    });
  } catch (error) {
    console.error('❌ خطأ في جلب الفروع النشطة:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب الفروع النشطة',
      error: error.message
    });
  }
});
router
  .route("/:id/storages")
  .post(dynamicUpload(storageFileFields), branchController.createStorage)
  .get(branchController.getBranchStorages);
router
  .route("/:id")
  .get(branchController.getBranchById)
  .patch(dynamicUpload(branchFileFields), branchController.updateBranch)

  .delete(branchController.deleteBranch);

module.exports = router;

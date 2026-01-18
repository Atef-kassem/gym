const { Product, Storage, Branch, ProductStorage } = require("../Model");

const appError = require("../utils/appError");
const { uploadFilesLocally } = require("../middlewares/fileUpload");

// Get All Storages
exports.getAllStorages = async (req, res) => {
  try {
    const storages = await Storage.findAll({
      include: { model: Branch, as: "branch" },
    });
    res.status(200).json({ success: true, data: storages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Storage by ID
exports.getStorageById = async (req, res) => {
  try {
    const storage = await Storage.findByPk(req.params.id, {
      include: { model: Branch, as: "branch" },
    });
    if (!storage) return res.status(404).json({ success: false, message: "Storage not found" });
    res.status(200).json({ success: true, data: storage });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const storageFileFields = [
  "storageImageAttachment",
  "licenceAttachment",
  "safetyCertificationAttachment",
  "WarehousePlansAttachment",
  "inventoryReportsAttachment",
  "anotherAttachments",
];
// Update Storage
exports.updateStorage = async (req, res, next) => {
  try {
    const storage = await Storage.findByPk(req.params.id);
    if (!storage) {
      throw new appError("Storage not found", 404);
    }
    // معالجة الملفات المرفوعة محليًا إذا وُجدت
    const uploadedFiles = await uploadFilesLocally(req.files, storageFileFields);

    // تحديث البيانات مع مسارات الملفات الجديدة
    const updateData = { ...req.body };
    uploadedFiles.forEach((file) => {
      updateData[file.fieldName] = file.link;
    });

    await storage.update(updateData);
    res.status(200).json({ success: true, data: storage });
  } catch (error) {
    next(error);
  }
};

// Delete Storage
exports.deleteStorage = async (req, res) => {
  try {
    const storage = await Storage.findByPk(req.params.id);
    if (!storage) return res.status(404).json({ success: false, message: "Storage not found" });
    await storage.destroy();
    res.status(200).json({ success: true, message: "Storage deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addProductToStorage = async (req, res, next) => {
  try {
    const storageId = req.params.id;
    const storage = await ProductStorage.create({ storageId, ...req.body });
    res.status(201).json({ success: true, data: storage });
  } catch (error) {
    next(err);
  }
};

exports.getStorageProducts = async (req, res, next) => {
  try {
    const products = await ProductStorage.findAll({
      where: { storageId: req.params.id },
      include: { model: Product },
    });
    res.status(200).json({
      status: "success",
      data: {
        products,
      },
    });
  } catch (err) {
    next(err);
  }
};

const { Consumables } = require("../Model"); // Adjust path based on your project structure
const AppError = require("../utils/appError");
const { uploadFilesLocally } = require("../middlewares/fileUpload");

// Create a new consumable
const consumablesFileFields = ["attachmentImage"];

exports.createConsumable = async (req, res, next) => {
  try {
    // استخدام Middleware لرفع الملفات تم تهيئته في الـ router
    // معالجة الملفات المرفوعة محليًا
    if (req.files) {
      const uploadedFiles = await uploadFilesLocally(req.files, consumablesFileFields);
      const consumableData = { ...req.body };
      uploadedFiles.forEach((file) => {
        consumableData[file.fieldName] = file.link;
      });
      console.log(req.body);
      const consumable = await Consumables.create(consumableData);
      res.status(201).json({
        status: "success",
        data: consumable,
      });
    } else {
      const uploadedFiles = [];

      // إعداد البيانات مع مسارات الملفات
      const consumableData = { ...req.body };
      uploadedFiles.forEach((file) => {
        consumableData[file.fieldName] = file.link;
      });
      console.log(req.body);
      const consumable = await Consumables.create(consumableData);
      res.status(201).json({
        status: "success",
        data: consumable,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Get all consumables
exports.getAllConsumables = async (req, res, next) => {
  try {
    const consumables = await Consumables.findAll();
    res.status(200).json({
      status: "success",
      data: consumables,
    });
  } catch (error) {
    next(error);
  }
};

// Get single consumable by ID
exports.getConsumableById = async (req, res, next) => {
  try {
    const consumable = await Consumables.findByPk(req.params.id);
    if (!consumable) {
      throw new AppError("Consumable not found", 404);
    }
    res.status(200).json({
      status: "success",
      data: consumable,
    });
  } catch (error) {
    next(error);
  }
};

// Update a consumable
exports.updateConsumable = async (req, res, next) => {
  try {
    const consumable = await Consumables.findByPk(req.params.id);
    if (!consumable) {
      throw new AppError("Consumable not found", 404);
    }
    
    // معالجة رفع الصور إذا كانت موجودة
    const consumableData = { ...req.body };
    if (req.files && Object.keys(req.files).length > 0) {
      try {
        console.log('📦 الملفات المستلمة للتحديث:', req.files);
        const uploadedFiles = await uploadFilesLocally(req.files, consumablesFileFields);
        console.log('📤 الملفات المرفوعة:', uploadedFiles);
        uploadedFiles.forEach((file) => {
          consumableData[file.fieldName] = file.link;
        });
        console.log('✅ تم رفع صورة المادة المستهلكة:', consumableData.attachmentImage);
      } catch (error) {
        console.error('❌ خطأ في رفع الصورة:', error);
      }
    }
    
    await consumable.update(consumableData);
    
    console.log('💾 المادة المستهلكة المحدثة في قاعدة البيانات:', {
      id: consumable.id,
      nameAr: consumable.nameAr,
      attachmentImage: consumable.attachmentImage
    });
    
    res.status(200).json({
      status: "success",
      data: consumable,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a consumable
exports.deleteConsumable = async (req, res, next) => {
  try {
    const consumable = await Consumables.findByPk(req.params.id);
    if (!consumable) {
      throw new AppError("Consumable not found", 404);
    }
    await consumable.destroy();
    res.status(204).json({
      status: "success",
      message: "Consumable deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Set consumable stock quantity (for stock taking)
exports.setConsumableStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || quantity === null) {
      throw new AppError("Quantity is required", 400);
    }

    const consumable = await Consumables.findByPk(id);
    if (!consumable) {
      throw new AppError("Consumable not found", 404);
    }

    await consumable.update({ currentStock: parseFloat(quantity) });

    res.status(200).json({
      status: "success",
      message: "Stock set successfully",
      data: { currentStock: parseFloat(quantity) },
    });
  } catch (error) {
    next(error);
  }
};

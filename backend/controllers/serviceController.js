const serviceRepository = require("../Model/repository/serviceRepository");
const catchAsync = require("../utils/catchAsync");
const { uploadFilesLocally } = require("../middlewares/fileUpload");

// حقول الملفات للخدمات
const serviceFileFields = ["image"];

const serviceController = {
  createService: catchAsync(async (req, res) => {
    let serviceData = { ...req.body };
    
    // معالجة رفع الصور إذا كانت موجودة
    if (req.files && Object.keys(req.files).length > 0) {
      try {
        console.log('📦 الملفات المستلمة للخدمة:', req.files);
        const uploadedFiles = await uploadFilesLocally(req.files, serviceFileFields);
        console.log('📤 الملفات المرفوعة:', uploadedFiles);
        uploadedFiles.forEach((file) => {
          if (file.fieldName === 'image') {
            serviceData.imageUrl = file.link;
          }
        });
        console.log('✅ تم رفع صورة الخدمة:', serviceData.imageUrl);
      } catch (error) {
        console.error('❌ خطأ في رفع الصورة:', error);
      }
    }
    
    console.log('📝 بيانات الخدمة قبل الحفظ:', {
      arabicName: serviceData.arabicName,
      imageUrl: serviceData.imageUrl
    });
    
    const service = await serviceRepository.create(serviceData);
    
    console.log('💾 الخدمة المحفوظة في قاعدة البيانات:', {
      id: service.id,
      arabicName: service.arabicName,
      imageUrl: service.imageUrl
    });
    
    res.status(201).json({
      status: "success",
      data: { service },
    });
  }),

  getAllServices: catchAsync(async (req, res) => {
    const services = await serviceRepository.findAll(req.query);
    res.status(200).json({
      status: "success",
      data: { services },
    });
  }),

  getServiceById: catchAsync(async (req, res) => {
    const service = await serviceRepository.findById(req.params.id);
    if (!service) {
      return res.status(404).json({
        status: "fail",
        message: "Service not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: { service },
    });
  }),

  updateService: catchAsync(async (req, res) => {
    let serviceData = { ...req.body };
    
    // معالجة رفع الصور إذا كانت موجودة
    if (req.files && Object.keys(req.files).length > 0) {
      try {
        console.log('📦 الملفات المستلمة للتحديث:', req.files);
        const uploadedFiles = await uploadFilesLocally(req.files, serviceFileFields);
        console.log('📤 الملفات المرفوعة:', uploadedFiles);
        uploadedFiles.forEach((file) => {
          if (file.fieldName === 'image') {
            serviceData.imageUrl = file.link;
          }
        });
        console.log('✅ تم رفع صورة الخدمة:', serviceData.imageUrl);
      } catch (error) {
        console.error('❌ خطأ في رفع الصورة:', error);
      }
    }
    
    console.log('📝 بيانات الخدمة للتحديث:', {
      id: req.params.id,
      imageUrl: serviceData.imageUrl
    });
    
    const service = await serviceRepository.update(req.params.id, serviceData);
    if (!service) {
      return res.status(404).json({
        status: "fail",
        message: "Service not found",
      });
    }
    
    console.log('💾 الخدمة المحدثة في قاعدة البيانات:', {
      id: service.id,
      imageUrl: service.imageUrl
    });
    
    res.status(200).json({
      status: "success",
      data: { service },
    });
  }),

  deleteService: catchAsync(async (req, res) => {
    const deleted = await serviceRepository.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        status: "fail",
        message: "Service not found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Service deleted successfully",
    });
  }),

  getServicesByBranch: catchAsync(async (req, res) => {
    const services = await serviceRepository.findByBranch(req.params.branchId);
    res.status(200).json({
      status: "success",
      data: { services },
    });
  }),

  getActiveServices: catchAsync(async (req, res) => {
    const services = await serviceRepository.findActiveServices(req.query);
    res.status(200).json({
      status: "success",
      data: { services },
    });
  }),

  calculateServicePrice: catchAsync(async (req, res) => {
    const priceInfo = await serviceRepository.calculatePriceWithTax(req.params.id);
    res.status(200).json({
      status: "success",
      data: { priceInfo },
    });
  }),
};

module.exports = serviceController;

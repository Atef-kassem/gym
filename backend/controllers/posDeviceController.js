const { POSDevice, Branch, Company, warehousesSchema, User } = require('../Model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Op } = require('sequelize');

// إنشاء جهاز جديد
exports.createDevice = catchAsync(async (req, res, next) => {
  const {
    name,
    serialNumber,
    deviceType,
    branchId,
    warehouseId,
    cashDrawerId,
    ipAddress,
    printerType,
    macAddress,
    operatingSystem,
    softwareVersion,
    notes
  } = req.body;

  const companyId = req.user.companyId;

  // التحقق من عدم تكرار الرقم التسلسلي
  const existingDevice = await POSDevice.findOne({
    where: { serialNumber, companyId }
  });

  if (existingDevice) {
    return next(new AppError('الرقم التسلسلي موجود مسبقاً', 400));
  }

  const device = await POSDevice.create({
    name,
    serialNumber,
    deviceType,
    branchId,
    warehouseId,
    cashDrawerId,
    ipAddress,
    printerType,
    macAddress,
    operatingSystem,
    softwareVersion,
    notes,
    companyId,
    createdBy: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: { device }
  });
});

// الحصول على جميع الأجهزة
exports.getAllDevices = catchAsync(async (req, res, next) => {
  const { branchId, deviceType, isActive, search } = req.query;
  const companyId = req.user.companyId;

  const whereClause = { companyId };

  if (branchId) whereClause.branchId = branchId;
  if (deviceType) whereClause.deviceType = deviceType;
  if (isActive !== undefined) whereClause.isActive = isActive === 'true';
  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { serialNumber: { [Op.iLike]: `%${search}%` } },
      { ipAddress: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const devices = await POSDevice.findAll({
    where: whereClause,
    include: [
      {
        model: Branch,
        as: 'deviceBranch',
        attributes: ['id', 'arabicName', 'englishName', 'code']
      },
      {
        model: warehousesSchema,
        as: 'deviceWarehouse',
        attributes: ['warehouse_id', 'name_ar', 'name_en']
      },
      {
        model: User,
        as: 'deviceCreator',
        attributes: ['id', 'arabicName', 'englinshName']
      }
    ],
    order: [['createdAt', 'DESC']]
  });

  res.status(200).json({
    status: 'success',
    results: devices.length,
    data: { devices }
  });
});

// الحصول على جهاز واحد
exports.getDevice = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const device = await POSDevice.findOne({
    where: { id, companyId },
    include: [
      {
        model: Branch,
        as: 'deviceBranch',
        attributes: ['id', 'arabicName', 'englishName', 'code', 'country', 'city', 'street']
      },
      {
        model: warehousesSchema,
        as: 'deviceWarehouse',
        attributes: ['warehouse_id', 'name_ar', 'name_en', 'country', 'city', 'street']
      },
      {
        model: User,
        as: 'deviceCreator',
        attributes: ['id', 'arabicName', 'englinshName', 'email']
      },
      {
        model: User,
        as: 'deviceUpdater',
        attributes: ['id', 'arabicName', 'englinshName', 'email']
      }
    ]
  });

  if (!device) {
    return next(new AppError('لم يتم العثور على الجهاز', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { device }
  });
});

// تحديث جهاز
exports.updateDevice = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const device = await POSDevice.findOne({
    where: { id, companyId }
  });

  if (!device) {
    return next(new AppError('لم يتم العثور على الجهاز', 404));
  }

  // التحقق من عدم تكرار الرقم التسلسلي إذا تم تغييره
  if (req.body.serialNumber && req.body.serialNumber !== device.serialNumber) {
    const existingDevice = await POSDevice.findOne({
      where: { serialNumber: req.body.serialNumber, companyId }
    });

    if (existingDevice) {
      return next(new AppError('الرقم التسلسلي موجود مسبقاً', 400));
    }
  }

  await device.update({
    ...req.body,
    updatedBy: req.user.id
  });

  res.status(200).json({
    status: 'success',
    data: { device }
  });
});

// حذف جهاز
exports.deleteDevice = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const device = await POSDevice.findOne({
    where: { id, companyId }
  });

  if (!device) {
    return next(new AppError('لم يتم العثور على الجهاز', 404));
  }

  await device.destroy();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// تبديل حالة الجهاز
exports.toggleDeviceStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const device = await POSDevice.findOne({
    where: { id, companyId }
  });

  if (!device) {
    return next(new AppError('لم يتم العثور على الجهاز', 404));
  }

  device.isActive = !device.isActive;
  device.updatedBy = req.user.id;
  await device.save();

  res.status(200).json({
    status: 'success',
    data: { device }
  });
});

// مزامنة الأجهزة
exports.syncDevices = catchAsync(async (req, res, next) => {
  const companyId = req.user.companyId;

  // تحديث آخر مزامنة لجميع الأجهزة النشطة
  await POSDevice.update(
    { lastSync: new Date(), updatedBy: req.user.id },
    { where: { companyId, isActive: true } }
  );

  res.status(200).json({
    status: 'success',
    message: 'تم مزامنة جميع الأجهزة بنجاح'
  });
});

// إحصائيات الأجهزة
exports.getDeviceStats = catchAsync(async (req, res, next) => {
  const companyId = req.user.companyId;

  const stats = await POSDevice.findAll({
    where: { companyId },
    attributes: [
      'deviceType',
      'isActive',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['deviceType', 'isActive']
  });

  const totalDevices = await POSDevice.count({ where: { companyId } });
  const activeDevices = await POSDevice.count({ where: { companyId, isActive: true } });

  res.status(200).json({
    status: 'success',
    data: {
      stats,
      totalDevices,
      activeDevices,
      inactiveDevices: totalDevices - activeDevices
    }
  });
});

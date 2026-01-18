const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const { DeliveryDriver, Branch, Company, DeliveryOrder } = require("../Model/index");
const { Op } = require("sequelize");
const sequelize = require("../Config/sequelize");

// إنشاء سائق توصيل جديد
exports.createDeliveryDriver = catchAsync(async (req, res, next) => {
  const {
    driverCode,
    name,
    nameEn,
    phone,
    email,
    nationalId,
    licenseNumber,
    licenseType,
    licenseExpiry,
    dateOfBirth,
    address,
    emergencyContact,
    emergencyPhone,
    hireDate,
    salary,
    commissionRate,
    notes,
    branchId,
    companyId
  } = req.body;

  // التحقق من وجود الفرع والشركة
  const branch = await Branch.findByPk(branchId);
  if (!branch) {
    return next(new appError("الفرع غير موجود", 404));
  }

  const company = await Company.findByPk(companyId);
  if (!company) {
    return next(new appError("الشركة غير موجودة", 404));
  }

  // التحقق من عدم تكرار رمز السائق أو رقم الهاتف
  const existingDriver = await DeliveryDriver.findOne({
    where: {
      [Op.or]: [
        { driverCode },
        { phone },
        { nationalId }
      ]
    }
  });

  if (existingDriver) {
    return next(new appError("رمز السائق أو رقم الهاتف أو رقم الهوية موجود مسبقاً", 400));
  }

  const driver = await DeliveryDriver.create({
    driverCode,
    name,
    nameEn,
    phone,
    email,
    nationalId,
    licenseNumber,
    licenseType,
    licenseExpiry,
    dateOfBirth,
    address,
    emergencyContact,
    emergencyPhone,
    hireDate,
    salary,
    commissionRate,
    notes,
    branchId,
    companyId,
    createdBy: req.user?.id || null
  });

  res.status(201).json({
    status: "success",
    data: {
      driver
    }
  });
});

// الحصول على جميع سائقي التوصيل
exports.getAllDeliveryDrivers = catchAsync(async (req, res, next) => {
  const { 
    page, 
    limit, 
    status, 
    isAvailable, 
    branchId, 
    companyId,
    licenseType
  } = req.query;

  const whereClause = {};
  if (status) whereClause.status = status;
  if (isAvailable !== undefined) whereClause.isAvailable = isAvailable === "true";
  if (branchId) whereClause.branchId = branchId;
  if (companyId) whereClause.companyId = companyId;
  if (licenseType) whereClause.licenseType = licenseType;

  const queryOptions = {
    where: whereClause,
    include: [
      {
        model: Branch,
        as: "branch",
        attributes: ["id", "arabicName", "englishName"]
      },
      {
        model: Company,
        as: "company",
        attributes: ["id", "arabicName", "englishName"]
      }
    ],
    order: [["createdAt", "DESC"]]
  };

  // فقط إذا تم تحديد page و limit، نستخدم pagination
  if (page && limit) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    queryOptions.limit = parseInt(limit);
    queryOptions.offset = parseInt(offset);
  }

  const drivers = await DeliveryDriver.findAndCountAll(queryOptions);

  const response = {
    status: "success",
    data: {
      drivers: drivers.rows,
      totalCount: drivers.count
    }
  };

  // إضافة معلومات pagination فقط إذا تم استخدامها
  if (page && limit) {
    response.data.currentPage = parseInt(page);
    response.data.totalPages = Math.ceil(drivers.count / parseInt(limit));
  }

  res.status(200).json(response);
});

// الحصول على سائق توصيل محدد
exports.getDeliveryDriver = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const driver = await DeliveryDriver.findByPk(id, {
    include: [
      {
        model: Branch,
        as: "branch",
        attributes: ["id", "arabicName", "englishName"]
      },
      {
        model: Company,
        as: "company",
        attributes: ["id", "arabicName", "englishName"]
      },
      {
        model: DeliveryOrder,
        as: "deliveryOrders",
        attributes: ["id", "orderNumber", "status", "orderDate", "totalAmount"],
        order: [["orderDate", "DESC"]],
        limit: 10
      }
    ]
  });

  if (!driver) {
    return next(new appError("سائق التوصيل غير موجود", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      driver
    }
  });
});

// تحديث سائق التوصيل
exports.updateDeliveryDriver = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const driver = await DeliveryDriver.findByPk(id);
  if (!driver) {
    return next(new appError("سائق التوصيل غير موجود", 404));
  }

  // التحقق من عدم تكرار البيانات إذا تم تغييرها
  if (updateData.driverCode || updateData.phone || updateData.nationalId) {
    const existingDriver = await DeliveryDriver.findOne({
      where: {
        id: { [Op.ne]: id },
        [Op.or]: [
          { driverCode: updateData.driverCode },
          { phone: updateData.phone },
          { nationalId: updateData.nationalId }
        ]
      }
    });

    if (existingDriver) {
      return next(new appError("رمز السائق أو رقم الهاتف أو رقم الهوية موجود مسبقاً", 400));
    }
  }

  updateData.updatedBy = req.user?.id || null;
  await driver.update(updateData);

  res.status(200).json({
    status: "success",
    data: {
      driver
    }
  });
});

// حذف سائق التوصيل
exports.deleteDeliveryDriver = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const driver = await DeliveryDriver.findByPk(id);
  if (!driver) {
    return next(new appError("سائق التوصيل غير موجود", 404));
  }

  // التحقق من عدم وجود طلبات توصيل مرتبطة بالسائق
  const deliveryOrders = await DeliveryOrder.count({
    where: { driverId: id }
  });

  if (deliveryOrders > 0) {
    return next(new appError("لا يمكن حذف السائق لوجود طلبات توصيل مرتبطة به", 400));
  }

  await driver.destroy();

  res.status(204).json({
    status: "success",
    data: null
  });
});

// تحديث حالة السائق
exports.updateDriverStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status, isAvailable, currentLocation, notes } = req.body;

  const driver = await DeliveryDriver.findByPk(id);
  if (!driver) {
    return next(new appError("سائق التوصيل غير موجود", 404));
  }

  const updateData = {
    status,
    notes: notes || driver.notes,
    updatedBy: req.user?.id || null
  };

  if (isAvailable !== undefined) {
    updateData.isAvailable = isAvailable;
  }

  if (currentLocation) {
    updateData.currentLocation = currentLocation;
    updateData.lastActiveTime = new Date();
  }

  await driver.update(updateData);

  res.status(200).json({
    status: "success",
    data: {
      driver
    }
  });
});

// تحديث موقع السائق
exports.updateDriverLocation = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { latitude, longitude, address, speed, direction, altitude, accuracy, batteryLevel, signalStrength } = req.body;

  const driver = await DeliveryDriver.findByPk(id);
  if (!driver) {
    return next(new appError("سائق التوصيل غير موجود", 404));
  }

  const currentLocation = {
    latitude,
    longitude,
    address,
    speed,
    direction,
    altitude,
    accuracy,
    batteryLevel,
    signalStrength,
    timestamp: new Date()
  };

  await driver.update({
    currentLocation,
    lastActiveTime: new Date(),
    updatedBy: req.user?.id || null
  });

  res.status(200).json({
    status: "success",
    data: {
      driver
    }
  });
});

// الحصول على إحصائيات السائقين
exports.getDriverStats = catchAsync(async (req, res, next) => {
  const { branchId, companyId } = req.query;

  const whereClause = {};
  if (branchId) whereClause.branchId = branchId;
  if (companyId) whereClause.companyId = companyId;

  const totalDrivers = await DeliveryDriver.count({ where: whereClause });
  
  const statusStats = await DeliveryDriver.findAll({
    attributes: [
      "status",
      [sequelize.fn("COUNT", sequelize.col("id")), "count"]
    ],
    where: whereClause,
    group: ["status"]
  });

  const licenseTypeStats = await DeliveryDriver.findAll({
    attributes: [
      "licenseType",
      [sequelize.fn("COUNT", sequelize.col("id")), "count"]
    ],
    where: whereClause,
    group: ["licenseType"]
  });

  const availableDrivers = await DeliveryDriver.count({
    where: { ...whereClause, isAvailable: true, status: "نشط" }
  });

  const totalEarnings = await DeliveryDriver.sum("totalEarnings", { where: whereClause });
  const averageRating = await DeliveryDriver.avg("averageRating", { where: whereClause });

  res.status(200).json({
    status: "success",
    data: {
      totalDrivers,
      availableDrivers,
      statusStats,
      licenseTypeStats,
      totalEarnings: totalEarnings || 0,
      averageRating: averageRating || 0
    }
  });
});

// البحث في سائقي التوصيل
exports.searchDeliveryDrivers = catchAsync(async (req, res, next) => {
  const { q, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  if (!q) {
    return next(new appError("يرجى إدخال كلمة البحث", 400));
  }

  const drivers = await DeliveryDriver.findAndCountAll({
    where: {
      [Op.or]: [
        { driverCode: { [Op.like]: `%${q}%` } },
        { name: { [Op.like]: `%${q}%` } },
        { nameEn: { [Op.like]: `%${q}%` } },
        { phone: { [Op.like]: `%${q}%` } },
        { nationalId: { [Op.like]: `%${q}%` } },
        { licenseNumber: { [Op.like]: `%${q}%` } }
      ]
    },
    include: [
      {
        model: Branch,
        as: "branch",
        attributes: ["id", "arabicName", "englishName"]
      },
      {
        model: Company,
        as: "company",
        attributes: ["id", "arabicName", "englishName"]
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["createdAt", "DESC"]]
  });

  res.status(200).json({
    status: "success",
    data: {
      drivers: drivers.rows,
      totalCount: drivers.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(drivers.count / limit)
    }
  });
});

// الحصول على السائقين المتاحين
exports.getAvailableDrivers = catchAsync(async (req, res, next) => {
  const { branchId, companyId, licenseType } = req.query;

  const whereClause = {
    isAvailable: true,
    status: "نشط"
  };
  
  if (branchId) whereClause.branchId = branchId;
  if (companyId) whereClause.companyId = companyId;
  if (licenseType) whereClause.licenseType = licenseType;

  const drivers = await DeliveryDriver.findAll({
    where: whereClause,
    include: [
      {
        model: Branch,
        as: "branch",
        attributes: ["id", "arabicName", "englishName"]
      }
    ],
    order: [["lastActiveTime", "DESC"]]
  });

  res.status(200).json({
    status: "success",
    data: {
      drivers
    }
  });
});

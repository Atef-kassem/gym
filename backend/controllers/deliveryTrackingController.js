const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const { 
  DeliveryTracking, 
  DeliveryOrder, 
  Motorcycle, 
  DeliveryDriver, 
  Branch, 
  Company 
} = require("../Model/index");
const { Op } = require("sequelize");
const sequelize = require("../Config/sequelize");

// إنشاء سجل تتبع جديد
exports.createTrackingRecord = catchAsync(async (req, res, next) => {
  const {
    deliveryOrderId,
    motorcycleId,
    driverId,
    status,
    latitude,
    longitude,
    address,
    speed,
    direction,
    altitude,
    accuracy,
    batteryLevel,
    signalStrength,
    notes,
    branchId,
    companyId
  } = req.body;

  // التحقق من وجود طلب التوصيل
  const deliveryOrder = await DeliveryOrder.findByPk(deliveryOrderId);
  if (!deliveryOrder) {
    return next(new appError("طلب التوصيل غير موجود", 404));
  }

  const trackingRecord = await DeliveryTracking.create({
    deliveryOrderId,
    motorcycleId,
    driverId,
    status,
    latitude,
    longitude,
    address,
    speed,
    direction,
    altitude,
    accuracy,
    batteryLevel,
    signalStrength,
    timestamp: new Date(),
    notes,
    branchId,
    companyId
  });

  res.status(201).json({
    status: "success",
    data: {
      trackingRecord
    }
  });
});

// الحصول على جميع سجلات التتبع
exports.getAllTrackingRecords = catchAsync(async (req, res, next) => {
  const { 
    page = 1, 
    limit = 10, 
    deliveryOrderId, 
    motorcycleId, 
    driverId,
    status,
    branchId, 
    companyId,
    startDate,
    endDate
  } = req.query;
  
  const offset = (page - 1) * limit;

  const whereClause = {};
  if (deliveryOrderId) whereClause.deliveryOrderId = deliveryOrderId;
  if (motorcycleId) whereClause.motorcycleId = motorcycleId;
  if (driverId) whereClause.driverId = driverId;
  if (status) whereClause.status = status;
  if (branchId) whereClause.branchId = branchId;
  if (companyId) whereClause.companyId = companyId;
  
  if (startDate && endDate) {
    whereClause.timestamp = {
      [Op.between]: [startDate, endDate]
    };
  }

  const trackingRecords = await DeliveryTracking.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: DeliveryOrder,
        as: "deliveryOrder",
        attributes: ["id", "orderNumber", "customerName", "deliveryAddress"]
      },
      {
        model: Motorcycle,
        as: "motorcycle",
        attributes: ["id", "motorcycleCode", "plateNumber", "brand", "model"]
      },
      {
        model: DeliveryDriver,
        as: "driver",
        attributes: ["id", "driverCode", "name", "phone"]
      },
      {
        model: Branch,
        as: "branch",
        attributes: ["id", "branchName", "branchNameEn"]
      },
      {
        model: Company,
        as: "company",
        attributes: ["id", "companyName", "companyNameEn"]
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["timestamp", "DESC"]]
  });

  res.status(200).json({
    status: "success",
    data: {
      trackingRecords: trackingRecords.rows,
      totalCount: trackingRecords.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(trackingRecords.count / limit)
    }
  });
});

// الحصول على سجل تتبع محدد
exports.getTrackingRecord = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const trackingRecord = await DeliveryTracking.findByPk(id, {
    include: [
      {
        model: DeliveryOrder,
        as: "deliveryOrder",
        attributes: ["id", "orderNumber", "customerName", "deliveryAddress", "status"]
      },
      {
        model: Motorcycle,
        as: "motorcycle",
        attributes: ["id", "motorcycleCode", "plateNumber", "brand", "model", "color"]
      },
      {
        model: DeliveryDriver,
        as: "driver",
        attributes: ["id", "driverCode", "name", "phone", "licenseNumber"]
      },
      {
        model: Branch,
        as: "branch",
        attributes: ["id", "branchName", "branchNameEn"]
      },
      {
        model: Company,
        as: "company",
        attributes: ["id", "companyName", "companyNameEn"]
      }
    ]
  });

  if (!trackingRecord) {
    return next(new appError("سجل التتبع غير موجود", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      trackingRecord
    }
  });
});

// تحديث سجل التتبع
exports.updateTrackingRecord = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const trackingRecord = await DeliveryTracking.findByPk(id);
  if (!trackingRecord) {
    return next(new appError("سجل التتبع غير موجود", 404));
  }

  await trackingRecord.update(updateData);

  res.status(200).json({
    status: "success",
    data: {
      trackingRecord
    }
  });
});

// حذف سجل التتبع
exports.deleteTrackingRecord = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const trackingRecord = await DeliveryTracking.findByPk(id);
  if (!trackingRecord) {
    return next(new appError("سجل التتبع غير موجود", 404));
  }

  await trackingRecord.destroy();

  res.status(204).json({
    status: "success",
    data: null
  });
});

// الحصول على مسار التتبع لطلب توصيل
exports.getDeliveryTrackingPath = catchAsync(async (req, res, next) => {
  const { deliveryOrderId } = req.params;

  const trackingRecords = await DeliveryTracking.findAll({
    where: { deliveryOrderId },
    include: [
      {
        model: Motorcycle,
        as: "motorcycle",
        attributes: ["id", "motorcycleCode", "plateNumber"]
      },
      {
        model: DeliveryDriver,
        as: "driver",
        attributes: ["id", "driverCode", "name"]
      }
    ],
    order: [["timestamp", "ASC"]]
  });

  res.status(200).json({
    status: "success",
    data: {
      trackingPath: trackingRecords
    }
  });
});

// الحصول على الموقع الحالي للدراجة النارية
exports.getCurrentMotorcycleLocation = catchAsync(async (req, res, next) => {
  const { motorcycleId } = req.params;

  const latestTracking = await DeliveryTracking.findOne({
    where: { motorcycleId },
    order: [["timestamp", "DESC"]],
    include: [
      {
        model: DeliveryOrder,
        as: "deliveryOrder",
        attributes: ["id", "orderNumber", "customerName", "deliveryAddress", "status"]
      },
      {
        model: DeliveryDriver,
        as: "driver",
        attributes: ["id", "driverCode", "name", "phone"]
      }
    ]
  });

  if (!latestTracking) {
    return next(new appError("لا توجد بيانات تتبع للدراجة النارية", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      currentLocation: latestTracking
    }
  });
});

// الحصول على الموقع الحالي للسائق
exports.getCurrentDriverLocation = catchAsync(async (req, res, next) => {
  const { driverId } = req.params;

  const latestTracking = await DeliveryTracking.findOne({
    where: { driverId },
    order: [["timestamp", "DESC"]],
    include: [
      {
        model: DeliveryOrder,
        as: "deliveryOrder",
        attributes: ["id", "orderNumber", "customerName", "deliveryAddress", "status"]
      },
      {
        model: Motorcycle,
        as: "motorcycle",
        attributes: ["id", "motorcycleCode", "plateNumber", "brand", "model"]
      }
    ]
  });

  if (!latestTracking) {
    return next(new appError("لا توجد بيانات تتبع للسائق", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      currentLocation: latestTracking
    }
  });
});

// الحصول على إحصائيات التتبع
exports.getTrackingStats = catchAsync(async (req, res, next) => {
  const { branchId, companyId, startDate, endDate } = req.query;

  const whereClause = {};
  if (branchId) whereClause.branchId = branchId;
  if (companyId) whereClause.companyId = companyId;
  
  if (startDate && endDate) {
    whereClause.timestamp = {
      [Op.between]: [startDate, endDate]
    };
  }

  const totalTrackingRecords = await DeliveryTracking.count({ where: whereClause });
  
  const statusStats = await DeliveryTracking.findAll({
    attributes: [
      "status",
      [sequelize.fn("COUNT", sequelize.col("id")), "count"]
    ],
    where: whereClause,
    group: ["status"]
  });

  const averageSpeed = await DeliveryTracking.avg("speed", { where: whereClause });
  const averageAccuracy = await DeliveryTracking.avg("accuracy", { where: whereClause });

  res.status(200).json({
    status: "success",
    data: {
      totalTrackingRecords,
      statusStats,
      averageSpeed: averageSpeed || 0,
      averageAccuracy: averageAccuracy || 0
    }
  });
});

// البحث في سجلات التتبع
exports.searchTrackingRecords = catchAsync(async (req, res, next) => {
  const { q, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  if (!q) {
    return next(new appError("يرجى إدخال كلمة البحث", 400));
  }

  const trackingRecords = await DeliveryTracking.findAndCountAll({
    where: {
      [Op.or]: [
        { address: { [Op.like]: `%${q}%` } },
        { notes: { [Op.like]: `%${q}%` } }
      ]
    },
    include: [
      {
        model: DeliveryOrder,
        as: "deliveryOrder",
        attributes: ["id", "orderNumber", "customerName", "deliveryAddress"]
      },
      {
        model: Motorcycle,
        as: "motorcycle",
        attributes: ["id", "motorcycleCode", "plateNumber", "brand", "model"]
      },
      {
        model: DeliveryDriver,
        as: "driver",
        attributes: ["id", "driverCode", "name", "phone"]
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["timestamp", "DESC"]]
  });

  res.status(200).json({
    status: "success",
    data: {
      trackingRecords: trackingRecords.rows,
      totalCount: trackingRecords.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(trackingRecords.count / limit)
    }
  });
});

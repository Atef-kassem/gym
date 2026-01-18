const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const { Motorcycle, Branch, Company, MotorcycleMaintenance, DeliveryDriver } = require("../Model/index");
const { Op } = require("sequelize");
const sequelize = require("../Config/sequelize");

// الحصول على الرمز التالي للدراجة النارية
exports.getNextMotorcycleCode = catchAsync(async (req, res, next) => {
  // الحصول على آخر دراجة نارية
  const lastMotorcycle = await Motorcycle.findOne({
    order: [['createdAt', 'DESC']],
    attributes: ['motorcycleCode']
  });

  let nextCode = 'MC00001';
  
  if (lastMotorcycle && lastMotorcycle.motorcycleCode) {
    // استخراج الرقم من الرمز
    const lastCode = lastMotorcycle.motorcycleCode;
    const match = lastCode.match(/MC(\d+)/);
    
    if (match) {
      const lastNumber = parseInt(match[1]);
      const nextNumber = lastNumber + 1;
      nextCode = `MC${nextNumber.toString().padStart(5, '0')}`;
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      nextCode
    }
  });
});

// إنشاء دراجة نارية جديدة
exports.createMotorcycle = catchAsync(async (req, res, next) => {
  const {
    motorcycleCode,
    plateNumber,
    brand,
    model,
    year,
    color,
    engineNumber,
    chassisNumber,
    capacity,
    fuelType,
    purchaseDate,
    purchasePrice,
    currentValue,
    insuranceNumber,
    insuranceExpiry,
    registrationExpiry,
    maxLoad,
    fuelCapacity,
    averageFuelConsumption,
    driverId,
    branchId,
    companyId,
    notes
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

  // التحقق من عدم تكرار رمز الدراجة أو رقم اللوحة
  const existingMotorcycle = await Motorcycle.findOne({
    where: {
      [Op.or]: [
        { motorcycleCode },
        { plateNumber }
      ]
    }
  });

  if (existingMotorcycle) {
    return next(new appError("رمز الدراجة أو رقم اللوحة موجود مسبقاً", 400));
  }

  const motorcycle = await Motorcycle.create({
    motorcycleCode,
    plateNumber,
    brand,
    model,
    year,
    color,
    engineNumber,
    chassisNumber,
    capacity,
    fuelType,
    purchaseDate,
    purchasePrice,
    currentValue,
    insuranceNumber,
    insuranceExpiry,
    registrationExpiry,
    maxLoad,
    fuelCapacity,
    averageFuelConsumption,
    driverId,
    branchId,
    companyId,
    notes,
    createdBy: req.user?.id || null
  });

  res.status(201).json({
    status: "success",
    data: {
      motorcycle
    }
  });
});

// الحصول على جميع الدراجات النارية
exports.getAllMotorcycles = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status, branchId, companyId } = req.query;
  const offset = (page - 1) * limit;

  const whereClause = {};
  if (status) whereClause.status = status;
  if (branchId) whereClause.branchId = branchId;
  if (companyId) whereClause.companyId = companyId;

  const motorcycles = await Motorcycle.findAndCountAll({
    where: whereClause,
    include: [
      {
        model: Branch,
        as: "branch",
        attributes: ["id", "arabicName", "englishName", "code"],
        required: false
      },
      {
        model: Company,
        as: "company",
        attributes: ["id", "arabicName", "englishName", "symbol"],
        required: false
      },
      {
        model: DeliveryDriver,
        as: "driver",
        attributes: ["id", "name", "driverCode", "phone"],
        required: false
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["createdAt", "DESC"]]
  });

  res.status(200).json({
    status: "success",
    data: {
      motorcycles: motorcycles.rows,
      totalCount: motorcycles.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(motorcycles.count / limit)
    }
  });
});

// الحصول على دراجة نارية محددة
exports.getMotorcycle = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const motorcycle = await Motorcycle.findByPk(id, {
    include: [
      {
        model: Branch,
        as: "branch",
        attributes: ["id", "arabicName", "englishName", "code"]
      },
      {
        model: Company,
        as: "company",
        attributes: ["id", "arabicName", "englishName", "symbol"]
      },
      {
        model: DeliveryDriver,
        as: "driver",
        attributes: ["id", "name", "driverCode", "phone"],
        required: false
      },
      {
        model: MotorcycleMaintenance,
        as: "maintenances",
        order: [["maintenanceDate", "DESC"]],
        limit: 5
      }
    ]
  });

  if (!motorcycle) {
    return next(new appError("الدراجة النارية غير موجودة", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      motorcycle
    }
  });
});

// تحديث دراجة نارية
exports.updateMotorcycle = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const motorcycle = await Motorcycle.findByPk(id);
  if (!motorcycle) {
    return next(new appError("الدراجة النارية غير موجودة", 404));
  }

  // التحقق من عدم تكرار رمز الدراجة أو رقم اللوحة إذا تم تغييرهما
  if (updateData.motorcycleCode || updateData.plateNumber) {
    const existingMotorcycle = await Motorcycle.findOne({
      where: {
        id: { [Op.ne]: id },
        [Op.or]: [
          { motorcycleCode: updateData.motorcycleCode },
          { plateNumber: updateData.plateNumber }
        ]
      }
    });

    if (existingMotorcycle) {
      return next(new appError("رمز الدراجة أو رقم اللوحة موجود مسبقاً", 400));
    }
  }

  updateData.updatedBy = req.user.id;
  await motorcycle.update(updateData);

  res.status(200).json({
    status: "success",
    data: {
      motorcycle
    }
  });
});

// حذف دراجة نارية
exports.deleteMotorcycle = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const motorcycle = await Motorcycle.findByPk(id);
  if (!motorcycle) {
    return next(new appError("الدراجة النارية غير موجودة", 404));
  }

  // التحقق من عدم وجود طلبات توصيل مرتبطة بالدراجة
  const deliveryOrders = await DeliveryOrder.count({
    where: { motorcycleId: id }
  });

  if (deliveryOrders > 0) {
    return next(new appError("لا يمكن حذف الدراجة النارية لوجود طلبات توصيل مرتبطة بها", 400));
  }

  await motorcycle.destroy();

  res.status(204).json({
    status: "success",
    data: null
  });
});

// تحديث حالة الدراجة النارية
exports.updateMotorcycleStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const motorcycle = await Motorcycle.findByPk(id);
  if (!motorcycle) {
    return next(new appError("الدراجة النارية غير موجودة", 404));
  }

  await motorcycle.update({
    status,
    notes: notes || motorcycle.notes,
    updatedBy: req.user?.id || null
  });

  res.status(200).json({
    status: "success",
    data: {
      motorcycle
    }
  });
});

// الحصول على إحصائيات الدراجات النارية
exports.getMotorcycleStats = catchAsync(async (req, res, next) => {
  const { branchId, companyId } = req.query;

  const whereClause = {};
  if (branchId) whereClause.branchId = branchId;
  if (companyId) whereClause.companyId = companyId;

  // إحصائيات الدراجات النارية
  const totalMotorcycles = await Motorcycle.count({ where: whereClause });
  
  const availableMotorcycles = await Motorcycle.count({ 
    where: { ...whereClause, status: "متاح" } 
  });

  const inServiceMotorcycles = await Motorcycle.count({ 
    where: { ...whereClause, status: "في الخدمة" } 
  });

  const maintenanceMotorcycles = await Motorcycle.count({ 
    where: { ...whereClause, status: "صيانة" } 
  });

  // إحصائيات التوصيل
  const { DeliveryOrder, DeliveryDriver, MotorcycleMaintenance } = require("../Model/index");
  
  const totalDeliveries = await DeliveryOrder.count({ where: whereClause });
  
  const activeDrivers = await DeliveryDriver.count({ 
    where: { ...whereClause, status: "نشط", isAvailable: true } 
  });

  // الصيانة المعلقة
  const pendingMaintenance = await MotorcycleMaintenance.count({ 
    where: { ...whereClause, status: { [Op.in]: ["مجدولة", "قيد التنفيذ"] } } 
  });

  // متوسط التقييم
  const averageRating = await DeliveryDriver.findOne({
    attributes: [[sequelize.fn("AVG", sequelize.col("averageRating")), "avgRating"]],
    where: whereClause,
    raw: true
  });
  
  const statusStats = await Motorcycle.findAll({
    attributes: [
      "status",
      [sequelize.fn("COUNT", sequelize.col("id")), "count"]
    ],
    where: whereClause,
    group: ["status"],
    raw: true
  });

  const fuelTypeStats = await Motorcycle.findAll({
    attributes: [
      "fuelType",
      [sequelize.fn("COUNT", sequelize.col("id")), "count"]
    ],
    where: whereClause,
    group: ["fuelType"],
    raw: true
  });

  res.status(200).json({
    status: "success",
    data: {
      totalMotorcycles,
      availableMotorcycles,
      inServiceMotorcycles,
      maintenanceMotorcycles,
      totalDeliveries,
      activeDrivers,
      pendingMaintenance,
      averageRating: parseFloat(averageRating?.avgRating || 0),
      statusStats,
      fuelTypeStats
    }
  });
});

// البحث في الدراجات النارية
exports.searchMotorcycles = catchAsync(async (req, res, next) => {
  const { q, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  if (!q) {
    return next(new appError("يرجى إدخال كلمة البحث", 400));
  }

  const motorcycles = await Motorcycle.findAndCountAll({
    where: {
      [Op.or]: [
        { motorcycleCode: { [Op.like]: `%${q}%` } },
        { plateNumber: { [Op.like]: `%${q}%` } },
        { brand: { [Op.like]: `%${q}%` } },
        { model: { [Op.like]: `%${q}%` } },
        { color: { [Op.like]: `%${q}%` } }
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
      motorcycles: motorcycles.rows,
      totalCount: motorcycles.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(motorcycles.count / limit)
    }
  });
});

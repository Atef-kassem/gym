const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const { MotorcycleMaintenance, Motorcycle, Branch, Company } = require("../Model/index");
const { Op } = require("sequelize");
const sequelize = require("../Config/sequelize");

// إنشاء سجل صيانة جديد
exports.createMaintenance = catchAsync(async (req, res, next) => {
  const {
    motorcycleId,
    maintenanceType,
    maintenanceDate,
    maintenanceTime,
    description,
    mileage,
    cost,
    laborCost,
    partsCost,
    workshopName,
    workshopContact,
    technicianName,
    nextMaintenanceDate,
    nextMaintenanceMileage,
    notes,
    branchId,
    companyId
  } = req.body;

  // التحقق من وجود الدراجة النارية
  const motorcycle = await Motorcycle.findByPk(motorcycleId);
  if (!motorcycle) {
    return next(new appError("الدراجة النارية غير موجودة", 404));
  }

  // إنشاء رمز الصيانة الفريد
  const maintenanceCode = `MAINT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

  const maintenance = await MotorcycleMaintenance.create({
    maintenanceCode,
    motorcycleId,
    maintenanceType,
    maintenanceDate,
    maintenanceTime,
    description,
    mileage,
    cost,
    laborCost,
    partsCost,
    workshopName,
    workshopContact,
    technicianName,
    nextMaintenanceDate,
    nextMaintenanceMileage,
    notes,
    branchId,
    companyId,
    createdBy: req.user?.id || null
  });

  // تحديث معلومات الصيانة في الدراجة النارية
  await motorcycle.update({
    lastMaintenanceDate: maintenanceDate,
    nextMaintenanceDate: nextMaintenanceDate,
    mileage: mileage || motorcycle.mileage,
    updatedBy: req.user?.id || null
  });

  res.status(201).json({
    status: "success",
    data: {
      maintenance
    }
  });
});

// الحصول على جميع سجلات الصيانة
exports.getAllMaintenances = catchAsync(async (req, res, next) => {
  const { 
    page, 
    limit, 
    motorcycleId, 
    maintenanceType, 
    status, 
    branchId, 
    companyId,
    startDate,
    endDate
  } = req.query;

  const whereClause = {};
  if (motorcycleId) whereClause.motorcycleId = motorcycleId;
  if (maintenanceType) whereClause.maintenanceType = maintenanceType;
  if (status) whereClause.status = status;
  if (branchId) whereClause.branchId = branchId;
  if (companyId) whereClause.companyId = companyId;
  
  if (startDate && endDate) {
    whereClause.maintenanceDate = {
      [Op.between]: [startDate, endDate]
    };
  }

  const queryOptions = {
    where: whereClause,
    include: [
      {
        model: Motorcycle,
        as: "motorcycle",
        attributes: ["id", "motorcycleCode", "plateNumber", "brand", "model"]
      },
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
    order: [["maintenanceDate", "DESC"]]
  };

  // فقط إذا تم تحديد page و limit، نستخدم pagination
  if (page && limit) {
    const offset = (parseInt(page) - 1) * parseInt(limit);
    queryOptions.limit = parseInt(limit);
    queryOptions.offset = parseInt(offset);
  }

  const maintenances = await MotorcycleMaintenance.findAndCountAll(queryOptions);

  const response = {
    status: "success",
    data: {
      maintenances: maintenances.rows,
      totalCount: maintenances.count
    }
  };

  // إضافة معلومات pagination فقط إذا تم استخدامها
  if (page && limit) {
    response.data.currentPage = parseInt(page);
    response.data.totalPages = Math.ceil(maintenances.count / parseInt(limit));
  }

  res.status(200).json(response);
});

// الحصول على سجل صيانة محدد
exports.getMaintenance = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const maintenance = await MotorcycleMaintenance.findByPk(id, {
    include: [
      {
        model: Motorcycle,
        as: "motorcycle",
        attributes: ["id", "motorcycleCode", "plateNumber", "brand", "model", "year", "color"]
      },
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
    ]
  });

  if (!maintenance) {
    return next(new appError("سجل الصيانة غير موجود", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      maintenance
    }
  });
});

// تحديث سجل الصيانة
exports.updateMaintenance = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const maintenance = await MotorcycleMaintenance.findByPk(id);
  if (!maintenance) {
    return next(new appError("سجل الصيانة غير موجود", 404));
  }

  updateData.updatedBy = req.user?.id || null;
  await maintenance.update(updateData);

  res.status(200).json({
    status: "success",
    data: {
      maintenance
    }
  });
});

// حذف سجل الصيانة
exports.deleteMaintenance = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const maintenance = await MotorcycleMaintenance.findByPk(id);
  if (!maintenance) {
    return next(new appError("سجل الصيانة غير موجود", 404));
  }

  await maintenance.destroy();

  res.status(204).json({
    status: "success",
    data: null
  });
});

// تحديث حالة الصيانة
exports.updateMaintenanceStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status, completedDate, completedTime, notes } = req.body;

  const maintenance = await MotorcycleMaintenance.findByPk(id);
  if (!maintenance) {
    return next(new appError("سجل الصيانة غير موجود", 404));
  }

  const updateData = {
    status,
    notes: notes || maintenance.notes,
    updatedBy: req.user?.id || null
  };

  if (status === "مكتملة" && completedDate) {
    updateData.completedDate = completedDate;
    updateData.completedTime = completedTime;
  }

  await maintenance.update(updateData);

  res.status(200).json({
    status: "success",
    data: {
      maintenance
    }
  });
});

// الحصول على إحصائيات الصيانة
exports.getMaintenanceStats = catchAsync(async (req, res, next) => {
  const { branchId, companyId, startDate, endDate } = req.query;

  const whereClause = {};
  if (branchId) whereClause.branchId = branchId;
  if (companyId) whereClause.companyId = companyId;
  
  if (startDate && endDate) {
    whereClause.maintenanceDate = {
      [Op.between]: [startDate, endDate]
    };
  }

  const totalMaintenances = await MotorcycleMaintenance.count({ where: whereClause });
  
  const statusStats = await MotorcycleMaintenance.findAll({
    attributes: [
      "status",
      [sequelize.fn("COUNT", sequelize.col("id")), "count"]
    ],
    where: whereClause,
    group: ["status"]
  });

  const typeStats = await MotorcycleMaintenance.findAll({
    attributes: [
      "maintenanceType",
      [sequelize.fn("COUNT", sequelize.col("id")), "count"]
    ],
    where: whereClause,
    group: ["maintenanceType"]
  });

  const totalCost = await MotorcycleMaintenance.sum("cost", { where: whereClause });
  const totalLaborCost = await MotorcycleMaintenance.sum("laborCost", { where: whereClause });
  const totalPartsCost = await MotorcycleMaintenance.sum("partsCost", { where: whereClause });

  res.status(200).json({
    status: "success",
    data: {
      totalMaintenances,
      statusStats,
      typeStats,
      totalCost: totalCost || 0,
      totalLaborCost: totalLaborCost || 0,
      totalPartsCost: totalPartsCost || 0
    }
  });
});

// الحصول على صيانة الدراجات النارية القادمة
exports.getUpcomingMaintenances = catchAsync(async (req, res, next) => {
  const { days = 30, branchId, companyId } = req.query;
  
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + parseInt(days));

  const whereClause = {
    nextMaintenanceDate: {
      [Op.lte]: futureDate,
      [Op.gte]: new Date()
    }
  };
  
  if (branchId) whereClause.branchId = branchId;
  if (companyId) whereClause.companyId = companyId;

  const upcomingMaintenances = await MotorcycleMaintenance.findAll({
    where: whereClause,
    include: [
      {
        model: Motorcycle,
        as: "motorcycle",
        attributes: ["id", "motorcycleCode", "plateNumber", "brand", "model"]
      },
      {
        model: Branch,
        as: "branch",
        attributes: ["id", "branchName", "branchNameEn"]
      }
    ],
    order: [["nextMaintenanceDate", "ASC"]]
  });

  res.status(200).json({
    status: "success",
    data: {
      upcomingMaintenances
    }
  });
});

const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const { 
  DeliveryOrder, 
  DeliveryOrderItem, 
  DeliveryTracking, 
  Motorcycle, 
  DeliveryDriver, 
  Branch, 
  Company 
} = require("../Model/index");
const { Op } = require("sequelize");
const sequelize = require("../Config/sequelize");

// إنشاء طلب توصيل جديد
exports.createDeliveryOrder = catchAsync(async (req, res, next) => {
  const {
    customerName,
    customerPhone,
    customerAddress,
    deliveryAddress,
    deliveryLatitude,
    deliveryLongitude,
    scheduledDeliveryDate,
    motorcycleId,
    driverId,
    orderValue,
    deliveryFee,
    paymentMethod,
    priority,
    deliveryType,
    specialInstructions,
    customerNotes,
    items,
    branchId,
    companyId
  } = req.body;

  // إنشاء رقم طلب التوصيل الفريد
  const orderNumber = `DEL-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

  // حساب المبلغ الإجمالي
  const totalAmount = (orderValue || 0) + (deliveryFee || 0);

  const deliveryOrder = await DeliveryOrder.create({
    orderNumber,
    customerName,
    customerPhone,
    customerAddress,
    deliveryAddress,
    deliveryLatitude,
    deliveryLongitude,
    orderDate: new Date(),
    scheduledDeliveryDate,
    motorcycleId,
    driverId,
    orderValue,
    deliveryFee,
    totalAmount,
    paymentMethod,
    priority,
    deliveryType,
    specialInstructions,
    customerNotes,
    branchId,
    companyId,
    createdBy: req.user?.id || null
  });

  // إضافة عناصر الطلب
  if (items && items.length > 0) {
    const orderItems = items.map(item => ({
      deliveryOrderId: deliveryOrder.id,
      productId: item.productId,
      productName: item.productName,
      productCode: item.productCode,
      description: item.description,
      quantity: item.quantity,
      unit: item.unit,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      discount: item.discount || 0,
      discountPercentage: item.discountPercentage || 0,
      tax: item.tax || 0,
      taxPercentage: item.taxPercentage || 0,
      netAmount: item.netAmount,
      notes: item.notes,
      branchId,
      companyId
    }));

    await DeliveryOrderItem.bulkCreate(orderItems);
  }

  res.status(201).json({
    status: "success",
    data: {
      deliveryOrder
    }
  });
});

// الحصول على جميع طلبات التوصيل
exports.getAllDeliveryOrders = catchAsync(async (req, res, next) => {
  const { 
    page = 1, 
    limit = 10, 
    status, 
    paymentStatus, 
    priority, 
    deliveryType,
    branchId, 
    companyId,
    startDate,
    endDate,
    driverId,
    motorcycleId
  } = req.query;
  
  const offset = (page - 1) * limit;

  const whereClause = {};
  if (status) whereClause.status = status;
  if (paymentStatus) whereClause.paymentStatus = paymentStatus;
  if (priority) whereClause.priority = priority;
  if (deliveryType) whereClause.deliveryType = deliveryType;
  if (branchId) whereClause.branchId = branchId;
  if (companyId) whereClause.companyId = companyId;
  if (driverId) whereClause.driverId = driverId;
  if (motorcycleId) whereClause.motorcycleId = motorcycleId;
  
  if (startDate && endDate) {
    whereClause.orderDate = {
      [Op.between]: [startDate, endDate]
    };
  }

  const deliveryOrders = await DeliveryOrder.findAndCountAll({
    where: whereClause,
    include: [
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
        attributes: ["id", "arabicName", "englishName"]
      },
      {
        model: Company,
        as: "company",
        attributes: ["id", "arabicName", "englishName"]
      },
      {
        model: DeliveryOrderItem,
        as: "items",
        attributes: ["id", "productName", "quantity", "unitPrice", "totalPrice"]
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["orderDate", "DESC"]]
  });

  res.status(200).json({
    status: "success",
    data: {
      deliveryOrders: deliveryOrders.rows,
      totalCount: deliveryOrders.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(deliveryOrders.count / limit)
    }
  });
});

// الحصول على طلب توصيل محدد
exports.getDeliveryOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deliveryOrder = await DeliveryOrder.findByPk(id, {
    include: [
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
        attributes: ["id", "arabicName", "englishName"]
      },
      {
        model: Company,
        as: "company",
        attributes: ["id", "arabicName", "englishName"]
      },
      {
        model: DeliveryOrderItem,
        as: "items"
      },
      {
        model: DeliveryTracking,
        as: "tracking",
        order: [["timestamp", "DESC"]],
        limit: 10
      }
    ]
  });

  if (!deliveryOrder) {
    return next(new appError("طلب التوصيل غير موجود", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      deliveryOrder
    }
  });
});

// تحديث طلب التوصيل
exports.updateDeliveryOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const deliveryOrder = await DeliveryOrder.findByPk(id);
  if (!deliveryOrder) {
    return next(new appError("طلب التوصيل غير موجود", 404));
  }

  // إعادة حساب المبلغ الإجمالي إذا تم تحديث القيم
  if (updateData.orderValue !== undefined || updateData.deliveryFee !== undefined) {
    const orderValue = updateData.orderValue !== undefined ? updateData.orderValue : deliveryOrder.orderValue;
    const deliveryFee = updateData.deliveryFee !== undefined ? updateData.deliveryFee : deliveryOrder.deliveryFee;
    updateData.totalAmount = orderValue + deliveryFee;
  }

  updateData.updatedBy = req.user?.id || null;
  await deliveryOrder.update(updateData);

  res.status(200).json({
    status: "success",
    data: {
      deliveryOrder
    }
  });
});

// حذف طلب التوصيل
exports.deleteDeliveryOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deliveryOrder = await DeliveryOrder.findByPk(id);
  if (!deliveryOrder) {
    return next(new appError("طلب التوصيل غير موجود", 404));
  }

  // التحقق من إمكانية الحذف (فقط الطلبات الجديدة يمكن حذفها)
  if (deliveryOrder.status !== "جديد") {
    return next(new appError("لا يمكن حذف طلب التوصيل بعد بدء المعالجة", 400));
  }

  // حذف عناصر الطلب أولاً
  await DeliveryOrderItem.destroy({
    where: { deliveryOrderId: id }
  });

  // حذف سجلات التتبع
  await DeliveryTracking.destroy({
    where: { deliveryOrderId: id }
  });

  // حذف الطلب
  await deliveryOrder.destroy();

  res.status(204).json({
    status: "success",
    data: null
  });
});

// تحديث حالة طلب التوصيل
exports.updateDeliveryOrderStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status, actualDeliveryDate, deliveryNotes, rating, feedback } = req.body;

  const deliveryOrder = await DeliveryOrder.findByPk(id);
  if (!deliveryOrder) {
    return next(new appError("طلب التوصيل غير موجود", 404));
  }

  const updateData = {
    status,
    updatedBy: req.user?.id || null
  };

  if (status === "تم التوصيل" && actualDeliveryDate) {
    updateData.actualDeliveryDate = actualDeliveryDate;
    
    // حساب الوقت الفعلي للتوصيل
    if (deliveryOrder.orderDate) {
      const orderTime = new Date(deliveryOrder.orderDate);
      const deliveryTime = new Date(actualDeliveryDate);
      const diffInMinutes = Math.round((deliveryTime - orderTime) / (1000 * 60));
      updateData.actualDeliveryTime = diffInMinutes;
    }
  }

  if (deliveryNotes) updateData.deliveryNotes = deliveryNotes;
  if (rating) updateData.rating = rating;
  if (feedback) updateData.feedback = feedback;

  await deliveryOrder.update(updateData);

  res.status(200).json({
    status: "success",
    data: {
      deliveryOrder
    }
  });
});

// إلغاء طلب التوصيل
exports.cancelDeliveryOrder = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { cancellationReason, cancelledBy } = req.body;

  const deliveryOrder = await DeliveryOrder.findByPk(id);
  if (!deliveryOrder) {
    return next(new appError("طلب التوصيل غير موجود", 404));
  }

  // التحقق من إمكانية الإلغاء
  if (deliveryOrder.status === "تم التوصيل") {
    return next(new appError("لا يمكن إلغاء طلب تم توصيله", 400));
  }

  await deliveryOrder.update({
    status: "ملغي",
    cancellationReason,
    cancelledBy,
    cancellationDate: new Date(),
    updatedBy: req.user?.id || null
  });

  res.status(200).json({
    status: "success",
    data: {
      deliveryOrder
    }
  });
});

// الحصول على إحصائيات طلبات التوصيل
exports.getDeliveryOrderStats = catchAsync(async (req, res, next) => {
  const { branchId, companyId, startDate, endDate } = req.query;

  const whereClause = {};
  if (branchId) whereClause.branchId = branchId;
  if (companyId) whereClause.companyId = companyId;
  
  if (startDate && endDate) {
    whereClause.orderDate = {
      [Op.between]: [startDate, endDate]
    };
  }

  const totalOrders = await DeliveryOrder.count({ where: whereClause });
  
  const statusStats = await DeliveryOrder.findAll({
    attributes: [
      "status",
      [sequelize.fn("COUNT", sequelize.col("id")), "count"]
    ],
    where: whereClause,
    group: ["status"]
  });

  const paymentStats = await DeliveryOrder.findAll({
    attributes: [
      "paymentStatus",
      [sequelize.fn("COUNT", sequelize.col("id")), "count"]
    ],
    where: whereClause,
    group: ["paymentStatus"]
  });

  const totalValue = await DeliveryOrder.sum("totalAmount", { where: whereClause });
  const totalDeliveryFee = await DeliveryOrder.sum("deliveryFee", { where: whereClause });
  const averageRating = await DeliveryOrder.avg("rating", { where: whereClause });

  res.status(200).json({
    status: "success",
    data: {
      totalOrders,
      statusStats,
      paymentStats,
      totalValue: totalValue || 0,
      totalDeliveryFee: totalDeliveryFee || 0,
      averageRating: averageRating || 0
    }
  });
});

// البحث في طلبات التوصيل
exports.searchDeliveryOrders = catchAsync(async (req, res, next) => {
  const { q, page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  if (!q) {
    return next(new appError("يرجى إدخال كلمة البحث", 400));
  }

  const deliveryOrders = await DeliveryOrder.findAndCountAll({
    where: {
      [Op.or]: [
        { orderNumber: { [Op.like]: `%${q}%` } },
        { customerName: { [Op.like]: `%${q}%` } },
        { customerPhone: { [Op.like]: `%${q}%` } },
        { customerAddress: { [Op.like]: `%${q}%` } },
        { deliveryAddress: { [Op.like]: `%${q}%` } }
      ]
    },
    include: [
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
      }
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [["orderDate", "DESC"]]
  });

  res.status(200).json({
    status: "success",
    data: {
      deliveryOrders: deliveryOrders.rows,
      totalCount: deliveryOrders.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(deliveryOrders.count / limit)
    }
  });
});

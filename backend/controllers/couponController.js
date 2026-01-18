const Coupon = require('../Model/couponModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Op, fn, col } = require('sequelize');

// إنشاء كوبون جديد
exports.createCoupon = catchAsync(async (req, res, next) => {
  const {
    code,
    name,
    description,
    type,
    value,
    minOrderAmount,
    maxDiscount,
    startDate,
    endDate,
    usageLimit,
    customerLimit,
    applicableServices,
    targetCustomers,
    branches,
    channels,
    autoApply,
    stackable,
    firstTimeOnly,
    terms
  } = req.body;

  // التحقق من وجود كوبون بنفس الرمز
  const existingCoupon = await Coupon.findOne({ where: { code } });
  if (existingCoupon) {
    return next(new AppError('رمز الكوبون موجود مسبقاً', 400));
  }

  // التحقق من صحة التواريخ
  if (new Date(startDate) >= new Date(endDate)) {
    return next(new AppError('تاريخ البداية يجب أن يكون قبل تاريخ النهاية', 400));
  }

  const coupon = await Coupon.create({
    code,
    name,
    description,
    type,
    value: parseFloat(value),
    minOrderAmount: parseFloat(minOrderAmount) || 0,
    maxDiscount: parseFloat(maxDiscount) || 0,
    startDate,
    endDate,
    usageLimit: parseInt(usageLimit) || 0,
    customerLimit: parseInt(customerLimit) || 1,
    applicableServices,
    targetCustomers,
    branches,
    channels,
    autoApply: Boolean(autoApply),
    stackable: Boolean(stackable),
    firstTimeOnly: Boolean(firstTimeOnly),
    terms,
    createdBy: null
  });

  res.status(201).json({
    status: 'success',
    data: {
      coupon
    }
  });
});

// الحصول على جميع الكوبونات مع التصفية والبحث
exports.getAllCoupons = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 100000000,
    search,
    status,
    type,
    startDate,
    endDate,
    sortBy = 'createdAt',
    sortOrder = 'DESC'
  } = req.query;

  const offset = (page - 1) * limit;
  
  // بناء شروط البحث
  const whereClause = { isActive: true };
  
  if (search) {
    whereClause[Op.or] = [
      { code: { [Op.like]: `%${search}%` } },
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }
  
  if (status && status !== 'all') {
    whereClause.status = status;
  }
  
  if (type && type !== 'all') {
    whereClause.type = type;
  }
  
  if (startDate && endDate) {
    whereClause.startDate = { [Op.gte]: startDate };
    whereClause.endDate = { [Op.lte]: endDate };
  }

  // بناء خيارات الترتيب
  const orderClause = [[sortBy, sortOrder.toUpperCase()]];

  const { count, rows: coupons } = await Coupon.findAndCountAll({
    where: whereClause,
    order: orderClause,
    limit: parseInt(limit),
    offset: parseInt(offset)
  });

  const totalPages = Math.ceil(count / limit);

  res.status(200).json({
    status: 'success',
    results: count,
    pagination: {
      currentPage: parseInt(page),
      totalPages,
      totalItems: count,
      itemsPerPage: parseInt(limit)
    },
    data: {
      coupons
    }
  });
});

// الحصول على كوبون واحد
exports.getCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findOne({
    where: { id, isActive: true }
  });

  if (!coupon) {
    return next(new AppError('الكوبون غير موجود', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      coupon
    }
  });
});

// تحديث كوبون
exports.updateCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const coupon = await Coupon.findOne({
    where: { id, isActive: true }
  });

  if (!coupon) {
    return next(new AppError('الكوبون غير موجود', 404));
  }

  // التحقق من صحة التواريخ إذا تم تحديثها
  if (updateData.startDate && updateData.endDate) {
    if (new Date(updateData.startDate) >= new Date(updateData.endDate)) {
      return next(new AppError('تاريخ البداية يجب أن يكون قبل تاريخ النهاية', 400));
    }
  }

  // التحقق من عدم تكرار الرمز إذا تم تحديثه
  if (updateData.code && updateData.code !== coupon.code) {
    const existingCoupon = await Coupon.findOne({ where: { code: updateData.code } });
    if (existingCoupon) {
      return next(new AppError('رمز الكوبون موجود مسبقاً', 400));
    }
  }

  // تحويل القيم الرقمية
  if (updateData.value) updateData.value = parseFloat(updateData.value);
  if (updateData.minOrderAmount) updateData.minOrderAmount = parseFloat(updateData.minOrderAmount);
  if (updateData.maxDiscount) updateData.maxDiscount = parseFloat(updateData.maxDiscount);
  if (updateData.usageLimit) updateData.usageLimit = parseInt(updateData.usageLimit);
  if (updateData.customerLimit) updateData.customerLimit = parseInt(updateData.customerLimit);

  // تحويل القيم المنطقية
  if (updateData.autoApply !== undefined) updateData.autoApply = Boolean(updateData.autoApply);
  if (updateData.stackable !== undefined) updateData.stackable = Boolean(updateData.stackable);
  if (updateData.firstTimeOnly !== undefined) updateData.firstTimeOnly = Boolean(updateData.firstTimeOnly);

  updateData.updatedBy = null;

  await coupon.update(updateData);

  res.status(200).json({
    status: 'success',
    data: {
      coupon
    }
  });
});

// حذف كوبون (Soft Delete)
exports.deleteCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findOne({
    where: { id, isActive: true }
  });

  if (!coupon) {
    return next(new AppError('الكوبون غير موجود', 404));
  }

  await coupon.destroy(); // Soft delete

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// تبديل حالة الكوبون
exports.toggleCouponStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const coupon = await Coupon.findOne({
    where: { id, isActive: true }
  });

  if (!coupon) {
    return next(new AppError('الكوبون غير موجود', 404));
  }

  const newStatus = coupon.status === 'نشط' ? 'متوقف' : 'نشط';
  await coupon.update({ status: newStatus });

  res.status(200).json({
    status: 'success',
    data: {
      coupon
    }
  });
});

// نسخ كوبون
exports.duplicateCoupon = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const originalCoupon = await Coupon.findOne({
    where: { id, isActive: true }
  });

  if (!originalCoupon) {
    return next(new AppError('الكوبون غير موجود', 404));
  }

  // إنشاء رمز جديد
  const timestamp = Date.now().toString().slice(-4);
  const newCode = `${originalCoupon.code}_COPY_${timestamp}`;

  const newCoupon = await Coupon.create({
    ...originalCoupon.toJSON(),
    id: undefined,
    code: newCode,
    name: `${originalCoupon.name} (نسخة)`,
    startDate: null,
    endDate: null,
    usedCount: 0,
    revenue: 0,
    conversionRate: 0,
    createdBy: null
  });

  res.status(201).json({
    status: 'success',
    data: {
      coupon: newCoupon
    }
  });
});

// الحصول على إحصائيات الكوبونات
exports.getCouponStats = catchAsync(async (req, res, next) => {
  const stats = await Coupon.findAll({
    where: { isActive: true },
    attributes: [
      'status',
      'type',
      [fn('COUNT', col('id')), 'count'],
      [fn('SUM', col('revenue')), 'totalRevenue'],
      [fn('AVG', col('conversionRate')), 'avgConversionRate'],
      [fn('SUM', col('usedCount')), 'totalUsage']
    ],
    group: ['status', 'type']
  });

  // حساب الإحصائيات الإجمالية
  const totalCoupons = await Coupon.count({ where: { isActive: true } });
  const activeCoupons = await Coupon.count({ where: { isActive: true, status: 'نشط' } });
  const totalRevenue = await Coupon.sum('revenue', { where: { isActive: true } });
  const totalUsage = await Coupon.sum('usedCount', { where: { isActive: true } });

  res.status(200).json({
    status: 'success',
    data: {
      summary: {
        totalCoupons,
        activeCoupons,
        totalRevenue: totalRevenue || 0,
        totalUsage: totalUsage || 0
      },
      detailedStats: stats
    }
  });
});

// البحث عن كوبون بالرمز
exports.findCouponByCode = catchAsync(async (req, res, next) => {
  const { code } = req.params;

  const coupon = await Coupon.findOne({
    where: { 
      code: code.toUpperCase(),
      isActive: true,
      status: 'نشط'
    }
  });

  if (!coupon) {
    return next(new AppError('الكوبون غير موجود أو غير نشط', 404));
  }

  // التحقق من صلاحية الكوبون
  const now = new Date();
  const startDate = new Date(coupon.startDate);
  const endDate = new Date(coupon.endDate);

  if (now < startDate) {
    return next(new AppError('الكوبون لم يبدأ بعد', 400));
  }

  if (now > endDate) {
    return next(new AppError('الكوبون منتهي الصلاحية', 400));
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return next(new AppError('تم استنفاذ حد استخدام الكوبون', 400));
  }

  res.status(200).json({
    status: 'success',
    data: {
      coupon
    }
  });
});

// تحديث عدد مرات الاستخدام
exports.updateCouponUsage = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { orderAmount, revenue } = req.body;

  const coupon = await Coupon.findOne({
    where: { id, isActive: true }
  });

  if (!coupon) {
    return next(new AppError('الكوبون غير موجود', 404));
  }

  // التحقق من الحد الأدنى للطلب
  if (orderAmount < coupon.minOrderAmount) {
    return next(new AppError(`الحد الأدنى للطلب هو ${coupon.minOrderAmount} جنيه`, 400));
  }

  // حساب قيمة الخصم
  let discountAmount = 0;
  if (coupon.type === 'نسبة مئوية') {
    discountAmount = (orderAmount * coupon.value) / 100;
    if (coupon.maxDiscount > 0) {
      discountAmount = Math.min(discountAmount, coupon.maxDiscount);
    }
  } else if (coupon.type === 'مبلغ ثابت') {
    discountAmount = coupon.value;
  }

  // تحديث إحصائيات الكوبون
  const newUsedCount = coupon.usedCount + 1;
  const newRevenue = coupon.revenue + (revenue || 0);
  const newAvgOrderValue = newRevenue / newUsedCount;

  await coupon.update({
    usedCount: newUsedCount,
    revenue: newRevenue,
    avgOrderValue: newAvgOrderValue
  });

  res.status(200).json({
    status: 'success',
    data: {
      coupon,
      discountAmount,
      finalAmount: orderAmount - discountAmount
    }
  });
});

// تصدير الكوبونات
exports.exportCoupons = catchAsync(async (req, res, next) => {
  const { format = 'json' } = req.query;

  const coupons = await Coupon.findAll({
    where: { isActive: true },
    order: [['createdAt', 'DESC']]
  });

  if (format === 'csv') {
    // إنشاء CSV
    const headers = ['الرمز', 'الاسم', 'النوع', 'القيمة', 'الحالة', 'الاستخدام', 'الإيرادات', 'تاريخ البداية', 'تاريخ النهاية'];
    const csvContent = [
      headers.join(','),
      ...coupons.map(coupon => [
        coupon.code,
        coupon.name,
        coupon.type,
        coupon.value,
        coupon.status,
        `${coupon.usedCount}/${coupon.usageLimit}`,
        coupon.revenue,
        coupon.startDate,
        coupon.endDate
      ].join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=coupons_${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csvContent);
  } else {
    // إرجاع JSON
    res.status(200).json({
      status: 'success',
      results: coupons.length,
      data: {
        coupons
      }
    });
  }
});

// الحصول على كوبونات منتهية الصلاحية
exports.getExpiredCoupons = catchAsync(async (req, res, next) => {
  const today = new Date().toISOString().split('T')[0];

  const expiredCoupons = await Coupon.findAll({
    where: {
      isActive: true,
      endDate: {
        [Op.lt]: today
      }
    },
    order: [['endDate', 'DESC']]
  });

  res.status(200).json({
    status: 'success',
    results: expiredCoupons.length,
    data: {
      coupons: expiredCoupons
    }
  });
});

// تحديث حالة الكوبونات منتهية الصلاحية
exports.updateExpiredCoupons = catchAsync(async (req, res, next) => {
  const today = new Date().toISOString().split('T')[0];

  const result = await Coupon.update(
    { status: 'منتهي' },
    {
      where: {
        isActive: true,
        status: 'نشط',
        endDate: {
          [Op.lt]: today
        }
      }
    }
  );

  res.status(200).json({
    status: 'success',
    message: `تم تحديث ${result[0]} كوبون منتهي الصلاحية`,
    updatedCount: result[0]
  });
});

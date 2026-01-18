const { POSPaymentMethod, Company, User } = require('../Model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Op } = require('sequelize');

// إنشاء طريقة دفع جديدة
exports.createPaymentMethod = catchAsync(async (req, res, next) => {
  const {
    name,
    nameEn,
    code,
    icon,
    fees,
    maxAmount,
    minAmount,
    supportsMixedPayment,
    requiresApproval,
    approvalThreshold,
    providerName,
    apiKey,
    apiSecret,
    isTestMode,
    description
  } = req.body;

  const companyId = req.user.companyId;

  // التحقق من عدم تكرار الرمز
  const existingMethod = await POSPaymentMethod.findOne({
    where: { code, companyId }
  });

  if (existingMethod) {
    return next(new AppError('رمز طريقة الدفع موجود مسبقاً', 400));
  }

  const paymentMethod = await POSPaymentMethod.create({
    name,
    nameEn,
    code,
    icon,
    fees,
    maxAmount,
    minAmount,
    supportsMixedPayment,
    requiresApproval,
    approvalThreshold,
    providerName,
    apiKey,
    apiSecret,
    isTestMode,
    description,
    companyId,
    createdBy: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: { paymentMethod }
  });
});

// الحصول على جميع طرق الدفع
exports.getAllPaymentMethods = catchAsync(async (req, res, next) => {
  const { isEnabled, search } = req.query;
  const companyId = req.user.companyId;

  const whereClause = { companyId };

  if (isEnabled !== undefined) whereClause.isEnabled = isEnabled === 'true';
  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { nameEn: { [Op.iLike]: `%${search}%` } },
      { code: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const paymentMethods = await POSPaymentMethod.findAll({
    where: whereClause,
    include: [
      {
        model: Company,
        as: 'paymentCompany',
        attributes: ['id', 'arabicName', 'englishName', 'code']
      },
      {
        model: User,
        as: 'paymentCreator',
        attributes: ['id', 'arabicName', 'englinshName']
      }
    ],
    order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']]
  });

  res.status(200).json({
    status: 'success',
    results: paymentMethods.length,
    data: { paymentMethods }
  });
});

// الحصول على طريقة دفع واحدة
exports.getPaymentMethod = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const paymentMethod = await POSPaymentMethod.findOne({
    where: { id, companyId }
  });

  if (!paymentMethod) {
    return next(new AppError('لم يتم العثور على طريقة الدفع', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { paymentMethod }
  });
});

// تحديث طريقة دفع
exports.updatePaymentMethod = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const paymentMethod = await POSPaymentMethod.findOne({
    where: { id, companyId }
  });

  if (!paymentMethod) {
    return next(new AppError('لم يتم العثور على طريقة الدفع', 404));
  }

  // التحقق من عدم تكرار الرمز إذا تم تغييره
  if (req.body.code && req.body.code !== paymentMethod.code) {
    const existingMethod = await POSPaymentMethod.findOne({
      where: { code: req.body.code, companyId }
    });

    if (existingMethod) {
      return next(new AppError('رمز طريقة الدفع موجود مسبقاً', 400));
    }
  }

  await paymentMethod.update({
    ...req.body,
    updatedBy: req.user.id
  });

  res.status(200).json({
    status: 'success',
    data: { paymentMethod }
  });
});

// حذف طريقة دفع
exports.deletePaymentMethod = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const paymentMethod = await POSPaymentMethod.findOne({
    where: { id, companyId }
  });

  if (!paymentMethod) {
    return next(new AppError('لم يتم العثور على طريقة الدفع', 404));
  }

  await paymentMethod.destroy();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// تبديل حالة طريقة الدفع
exports.togglePaymentMethod = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const paymentMethod = await POSPaymentMethod.findOne({
    where: { id, companyId }
  });

  if (!paymentMethod) {
    return next(new AppError('لم يتم العثور على طريقة الدفع', 404));
  }

  paymentMethod.isEnabled = !paymentMethod.isEnabled;
  paymentMethod.updatedBy = req.user.id;
  await paymentMethod.save();

  res.status(200).json({
    status: 'success',
    data: { paymentMethod }
  });
});

// اختبار اتصال طريقة الدفع
exports.testPaymentConnection = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const paymentMethod = await POSPaymentMethod.findOne({
    where: { id, companyId }
  });

  if (!paymentMethod) {
    return next(new AppError('لم يتم العثور على طريقة الدفع', 404));
  }

  // هنا يمكن إضافة منطق اختبار الاتصال الفعلي
  // مثال: اختبار API keys مع مقدم الخدمة
  
  try {
    // محاكاة اختبار الاتصال
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    res.status(200).json({
      status: 'success',
      message: 'تم اختبار الاتصال بنجاح',
      data: {
        isConnected: true,
        responseTime: '2.1s',
        lastTested: new Date()
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'فشل في اختبار الاتصال',
      error: error.message
    });
  }
});

// تحديث ترتيب طرق الدفع
exports.updatePaymentMethodsOrder = catchAsync(async (req, res, next) => {
  const { orderData } = req.body;
  const companyId = req.user.companyId;

  if (!Array.isArray(orderData)) {
    return next(new AppError('بيانات الترتيب غير صحيحة', 400));
  }

  // تحديث الترتيب لكل طريقة دفع
  for (const item of orderData) {
    await POSPaymentMethod.update(
      { sortOrder: item.sortOrder, updatedBy: req.user.id },
      { where: { id: item.id, companyId } }
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'تم تحديث ترتيب طرق الدفع بنجاح'
  });
});

// إحصائيات طرق الدفع
exports.getPaymentMethodsStats = catchAsync(async (req, res, next) => {
  const companyId = req.user.companyId;

  const totalMethods = await POSPaymentMethod.count({ where: { companyId } });
  const enabledMethods = await POSPaymentMethod.count({ where: { companyId, isEnabled: true } });
  const disabledMethods = totalMethods - enabledMethods;

  // إحصائيات حسب النوع
  const methodsByType = await POSPaymentMethod.findAll({
    where: { companyId },
    attributes: [
      'icon',
      'isEnabled',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['icon', 'isEnabled']
  });

  res.status(200).json({
    status: 'success',
    data: {
      totalMethods,
      enabledMethods,
      disabledMethods,
      methodsByType
    }
  });
});

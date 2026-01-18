const Plan = require('../Model/planModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Op } = require('sequelize');

// إنشاء خطة جديدة
exports.createPlan = catchAsync(async (req, res, next) => {
  const {
    name,
    price,
    interval,
    description,
    features,
    popular,
    color,
    maxUsers,
    maxServices
  } = req.body;

  // التحقق من وجود خطة بنفس الاسم
  const existingPlan = await Plan.findOne({ where: { name } });
  if (existingPlan) {
    return next(new AppError('اسم الخطة موجود مسبقاً', 400));
  }

  const plan = await Plan.create({
    name,
    price: parseFloat(price),
    interval,
    description,
    features: Array.isArray(features) ? features : features.split(',').map(f => f.trim()),
    popular: Boolean(popular),
    color,
    maxUsers: parseInt(maxUsers) || 1,
    maxServices: parseInt(maxServices) || 5,
    createdBy: null
  });

  res.status(201).json({
    status: 'success',
    data: {
      plan
    }
  });
});

// الحصول على جميع الخطط
exports.getAllPlans = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 100000000,
    search,
    interval,
    popular,
    sortBy = 'createdAt',
    sortOrder = 'DESC'
  } = req.query;

  const offset = (page - 1) * limit;
  
  // بناء شروط البحث
  const whereClause = { isActive: true };
  
  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } }
    ];
  }
  
  if (interval && interval !== 'all') {
    whereClause.interval = interval;
  }
  
  if (popular !== undefined) {
    whereClause.popular = popular === 'true';
  }

  // بناء خيارات الترتيب
  const orderClause = [[sortBy, sortOrder.toUpperCase()]];

  const { count, rows: plans } = await Plan.findAndCountAll({
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
      plans
    }
  });
});

// الحصول على خطة واحدة
exports.getPlan = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const plan = await Plan.findOne({
    where: { id, isActive: true }
  });

  if (!plan) {
    return next(new AppError('الخطة غير موجودة', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});

// تحديث خطة
exports.updatePlan = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const plan = await Plan.findOne({
    where: { id, isActive: true }
  });

  if (!plan) {
    return next(new AppError('الخطة غير موجودة', 404));
  }

  // التحقق من عدم تكرار الاسم إذا تم تحديثه
  if (updateData.name && updateData.name !== plan.name) {
    const existingPlan = await Plan.findOne({ where: { name: updateData.name } });
    if (existingPlan) {
      return next(new AppError('اسم الخطة موجود مسبقاً', 400));
    }
  }

  // تحويل القيم الرقمية
  if (updateData.price) updateData.price = parseFloat(updateData.price);
  if (updateData.maxUsers) updateData.maxUsers = parseInt(updateData.maxUsers);
  if (updateData.maxServices) updateData.maxServices = parseInt(updateData.maxServices);

  // تحويل القيم المنطقية
  if (updateData.popular !== undefined) updateData.popular = Boolean(updateData.popular);

  // تحويل الميزات إلى مصفوفة
  if (updateData.features && !Array.isArray(updateData.features)) {
    updateData.features = updateData.features.split(',').map(f => f.trim());
  }

  updateData.updatedBy = null;

  await plan.update(updateData);

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});

// حذف خطة
exports.deletePlan = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const plan = await Plan.findOne({
    where: { id, isActive: true }
  });

  if (!plan) {
    return next(new AppError('الخطة غير موجودة', 404));
  }

  await plan.destroy(); // Soft delete

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// تبديل حالة الخطة
exports.togglePlanStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const plan = await Plan.findOne({
    where: { id, isActive: true }
  });

  if (!plan) {
    return next(new AppError('الخطة غير موجودة', 404));
  }

  const newStatus = !plan.isActive;
  await plan.update({ isActive: newStatus });

  res.status(200).json({
    status: 'success',
    data: {
      plan
    }
  });
});

// نسخ خطة
exports.duplicatePlan = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const originalPlan = await Plan.findOne({
    where: { id, isActive: true }
  });

  if (!originalPlan) {
    return next(new AppError('الخطة غير موجودة', 404));
  }

  // إنشاء اسم جديد
  const newName = `${originalPlan.name} (نسخة)`;

  const newPlan = await Plan.create({
    ...originalPlan.toJSON(),
    id: undefined,
    name: newName,
    createdBy: null
  });

  res.status(201).json({
    status: 'success',
    data: {
      plan: newPlan
    }
  });
});

// الحصول على إحصائيات الخطط
exports.getPlanStats = catchAsync(async (req, res, next) => {
  const totalPlans = await Plan.count({ where: { isActive: true } });
  const activePlans = await Plan.count({ where: { isActive: true } });
  const popularPlans = await Plan.count({ where: { isActive: true, popular: true } });
  
  const plansByInterval = await Plan.findAll({
    where: { isActive: true },
    attributes: [
      'interval',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
    ],
    group: ['interval']
  });

  res.status(200).json({
    status: 'success',
    data: {
      summary: {
        totalPlans,
        activePlans,
        popularPlans
      },
      plansByInterval
    }
  });
});

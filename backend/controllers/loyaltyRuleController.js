const LoyaltyRule = require('../Model/loyaltyRuleModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Op } = require('sequelize');

// إنشاء قاعدة جديدة
exports.createRule = catchAsync(async (req, res, next) => {
  const {
    name,
    description,
    earnRate,
    redeemRate,
    minPurchase,
    maxPoints,
    expiryMonths,
    levelMultiplier
  } = req.body;

  // التحقق من عدم وجود قاعدة بنفس الاسم
  const existingRule = await LoyaltyRule.findOne({ where: { name } });
  if (existingRule) {
    return next(new AppError('اسم القاعدة موجود مسبقاً', 400));
  }

  const rule = await LoyaltyRule.create({
    name,
    description,
    earnRate: parseFloat(earnRate),
    redeemRate: parseFloat(redeemRate),
    minPurchase: parseFloat(minPurchase),
    maxPoints: parseFloat(maxPoints),
    expiryMonths: parseInt(expiryMonths),
    levelMultiplier: levelMultiplier || {
      "Bronze": 1,
      "Silver": 1.5,
      "Gold": 2,
      "Platinum": 3
    },
    createdBy: null
  });

  res.status(201).json({
    status: 'success',
    data: {
      rule
    }
  });
});

// الحصول على جميع القواعد
exports.getAllRules = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 100000000,
    search,
    active,
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
  
  if (active !== undefined) {
    whereClause.active = active === 'true';
  }

  // بناء خيارات الترتيب
  const orderClause = [[sortBy, sortOrder.toUpperCase()]];

  const { count, rows: rules } = await LoyaltyRule.findAndCountAll({
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
      rules
    }
  });
});

// الحصول على قاعدة واحدة
exports.getRule = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const rule = await LoyaltyRule.findOne({
    where: { id, isActive: true }
  });

  if (!rule) {
    return next(new AppError('القاعدة غير موجودة', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      rule
    }
  });
});

// تحديث قاعدة
exports.updateRule = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const rule = await LoyaltyRule.findOne({
    where: { id, isActive: true }
  });

  if (!rule) {
    return next(new AppError('القاعدة غير موجودة', 404));
  }

  // التحقق من عدم تكرار الاسم إذا تم تحديثه
  if (updateData.name && updateData.name !== rule.name) {
    const existingRule = await LoyaltyRule.findOne({ where: { name: updateData.name } });
    if (existingRule) {
      return next(new AppError('اسم القاعدة موجود مسبقاً', 400));
    }
  }

  // تحويل القيم الرقمية
  if (updateData.earnRate) updateData.earnRate = parseFloat(updateData.earnRate);
  if (updateData.redeemRate) updateData.redeemRate = parseFloat(updateData.redeemRate);
  if (updateData.minPurchase) updateData.minPurchase = parseFloat(updateData.minPurchase);
  if (updateData.maxPoints) updateData.maxPoints = parseFloat(updateData.maxPoints);
  if (updateData.expiryMonths) updateData.expiryMonths = parseInt(updateData.expiryMonths);

  // تحويل القيم المنطقية
  if (updateData.active !== undefined) updateData.active = Boolean(updateData.active);

  updateData.updatedBy = null;

  await rule.update(updateData);

  res.status(200).json({
    status: 'success',
    data: {
      rule
    }
  });
});

// حذف قاعدة
exports.deleteRule = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const rule = await LoyaltyRule.findOne({
    where: { id, isActive: true }
  });

  if (!rule) {
    return next(new AppError('القاعدة غير موجودة', 404));
  }

  await rule.destroy(); // Soft delete

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// تبديل حالة القاعدة
exports.toggleRuleStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const rule = await LoyaltyRule.findOne({
    where: { id, isActive: true }
  });

  if (!rule) {
    return next(new AppError('القاعدة غير موجودة', 404));
  }

  const newStatus = !rule.active;
  await rule.update({ active: newStatus });

  res.status(200).json({
    status: 'success',
    data: {
      rule
    }
  });
});

// نسخ قاعدة
exports.duplicateRule = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const originalRule = await LoyaltyRule.findOne({
    where: { id, isActive: true }
  });

  if (!originalRule) {
    return next(new AppError('القاعدة غير موجودة', 404));
  }

  // إنشاء اسم جديد
  const newName = `${originalRule.name} (نسخة)`;

  const newRule = await LoyaltyRule.create({
    ...originalRule.toJSON(),
    id: undefined,
    name: newName,
    createdBy: null
  });

  res.status(201).json({
    status: 'success',
    data: {
      rule: newRule
    }
  });
});

// الحصول على إحصائيات القواعد
exports.getRuleStats = catchAsync(async (req, res, next) => {
  const totalRules = await LoyaltyRule.count({ where: { isActive: true } });
  const activeRules = await LoyaltyRule.count({ where: { isActive: true, active: true } });
  const inactiveRules = await LoyaltyRule.count({ where: { isActive: true, active: false } });

  const rulesByEarnRate = await LoyaltyRule.findAll({
    where: { isActive: true },
    attributes: [
      'earnRate',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
    ],
    group: ['earnRate']
  });

  res.status(200).json({
    status: 'success',
    data: {
      summary: {
        totalRules,
        activeRules,
        inactiveRules
      },
      rulesByEarnRate
    }
  });
});

// الحصول على القواعد النشطة
exports.getActiveRules = catchAsync(async (req, res, next) => {
  const rules = await LoyaltyRule.findAll({
    where: { isActive: true, active: true },
    order: [['createdAt', 'ASC']]
  });

  res.status(200).json({
    status: 'success',
    results: rules.length,
    data: {
      rules
    }
  });
});

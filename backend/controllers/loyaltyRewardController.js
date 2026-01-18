const LoyaltyReward = require('../Model/loyaltyRewardModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Op } = require('sequelize');

// إنشاء مكافأة جديدة
exports.createReward = catchAsync(async (req, res, next) => {
  const {
    name,
    description,
    pointsRequired,
    discountValue,
    discountType,
    category,
    expiryDays,
    maxRedemptions
  } = req.body;

  // التحقق من عدم وجود مكافأة بنفس الاسم
  const existingReward = await LoyaltyReward.findOne({ where: { name } });
  if (existingReward) {
    return next(new AppError('اسم المكافأة موجود مسبقاً', 400));
  }

  const reward = await LoyaltyReward.create({
    name,
    description,
    pointsRequired: parseFloat(pointsRequired),
    discountValue: parseFloat(discountValue),
    discountType,
    category,
    expiryDays: parseInt(expiryDays),
    maxRedemptions: maxRedemptions ? parseInt(maxRedemptions) : null,
    currentRedemptions: 0,
    createdBy: null
  });

  res.status(201).json({
    status: 'success',
    data: {
      reward
    }
  });
});

// الحصول على جميع المكافآت
exports.getAllRewards = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 100000000,
    search,
    category,
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
  
  if (category && category !== 'all') {
    whereClause.category = category;
  }
  
  if (active !== undefined) {
    whereClause.active = active === 'true';
  }

  // بناء خيارات الترتيب
  const orderClause = [[sortBy, sortOrder.toUpperCase()]];

  const { count, rows: rewards } = await LoyaltyReward.findAndCountAll({
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
      rewards
    }
  });
});

// الحصول على مكافأة واحدة
exports.getReward = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const reward = await LoyaltyReward.findOne({
    where: { id, isActive: true }
  });

  if (!reward) {
    return next(new AppError('المكافأة غير موجودة', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      reward
    }
  });
});

// تحديث مكافأة
exports.updateReward = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const reward = await LoyaltyReward.findOne({
    where: { id, isActive: true }
  });

  if (!reward) {
    return next(new AppError('المكافأة غير موجودة', 404));
  }

  // التحقق من عدم تكرار الاسم إذا تم تحديثه
  if (updateData.name && updateData.name !== reward.name) {
    const existingReward = await LoyaltyReward.findOne({ where: { name: updateData.name } });
    if (existingReward) {
      return next(new AppError('اسم المكافأة موجود مسبقاً', 400));
    }
  }

  // تحويل القيم الرقمية
  if (updateData.pointsRequired) updateData.pointsRequired = parseFloat(updateData.pointsRequired);
  if (updateData.discountValue) updateData.discountValue = parseFloat(updateData.discountValue);
  if (updateData.expiryDays) updateData.expiryDays = parseInt(updateData.expiryDays);
  if (updateData.maxRedemptions) updateData.maxRedemptions = parseInt(updateData.maxRedemptions);

  // تحويل القيم المنطقية
  if (updateData.active !== undefined) updateData.active = Boolean(updateData.active);

  updateData.updatedBy = null;

  await reward.update(updateData);

  res.status(200).json({
    status: 'success',
    data: {
      reward
    }
  });
});

// حذف مكافأة
exports.deleteReward = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const reward = await LoyaltyReward.findOne({
    where: { id, isActive: true }
  });

  if (!reward) {
    return next(new AppError('المكافأة غير موجودة', 404));
  }

  await reward.destroy(); // Soft delete

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// تبديل حالة المكافأة
exports.toggleRewardStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const reward = await LoyaltyReward.findOne({
    where: { id, isActive: true }
  });

  if (!reward) {
    return next(new AppError('المكافأة غير موجودة', 404));
  }

  const newStatus = !reward.active;
  await reward.update({ active: newStatus });

  res.status(200).json({
    status: 'success',
    data: {
      reward
    }
  });
});

// نسخ مكافأة
exports.duplicateReward = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const originalReward = await LoyaltyReward.findOne({
    where: { id, isActive: true }
  });

  if (!originalReward) {
    return next(new AppError('المكافأة غير موجودة', 404));
  }

  // إنشاء اسم جديد
  const newName = `${originalReward.name} (نسخة)`;

  const newReward = await LoyaltyReward.create({
    ...originalReward.toJSON(),
    id: undefined,
    name: newName,
    currentRedemptions: 0,
    createdBy: null
  });

  res.status(201).json({
    status: 'success',
    data: {
      reward: newReward
    }
  });
});

// استرداد مكافأة
exports.redeemReward = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { customerId, customerName } = req.body;

  const reward = await LoyaltyReward.findOne({
    where: { id, isActive: true, active: true }
  });

  if (!reward) {
    return next(new AppError('المكافأة غير موجودة أو غير نشطة', 404));
  }

  // التحقق من الحد الأقصى للاستردادات
  if (reward.maxRedemptions && reward.currentRedemptions >= reward.maxRedemptions) {
    return next(new AppError('تم الوصول للحد الأقصى من الاستردادات لهذه المكافأة', 400));
  }

  // زيادة عدد الاستردادات
  await reward.update({
    currentRedemptions: reward.currentRedemptions + 1
  });

  res.status(200).json({
    status: 'success',
    data: {
      reward,
      redemptionInfo: {
        customerId,
        customerName,
        redeemedAt: new Date(),
        pointsRequired: reward.pointsRequired,
        discountValue: reward.discountValue,
        discountType: reward.discountType
      }
    }
  });
});

// الحصول على إحصائيات المكافآت
exports.getRewardStats = catchAsync(async (req, res, next) => {
  const totalRewards = await LoyaltyReward.count({ where: { isActive: true } });
  const activeRewards = await LoyaltyReward.count({ where: { isActive: true, active: true } });
  const totalRedemptions = await LoyaltyReward.sum('currentRedemptions', { where: { isActive: true } });

  const rewardsByCategory = await LoyaltyReward.findAll({
    where: { isActive: true },
    attributes: [
      'category',
      [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count'],
      [require('sequelize').fn('SUM', require('sequelize').col('currentRedemptions')), 'totalRedemptions']
    ],
    group: ['category']
  });

  const topRewards = await LoyaltyReward.findAll({
    where: { isActive: true },
    attributes: [
      'name',
      'currentRedemptions',
      'pointsRequired'
    ],
    order: [['currentRedemptions', 'DESC']],
    limit: 5
  });

  res.status(200).json({
    status: 'success',
    data: {
      summary: {
        totalRewards,
        activeRewards,
        totalRedemptions: totalRedemptions || 0
      },
      rewardsByCategory,
      topRewards
    }
  });
});

// الحصول على المكافآت المتاحة
exports.getAvailableRewards = catchAsync(async (req, res, next) => {
  const { customerPoints, category } = req.query;

  const whereClause = { isActive: true, active: true };
  
  if (category && category !== 'all') {
    whereClause.category = category;
  }

  if (customerPoints) {
    whereClause.pointsRequired = {
      [Op.lte]: parseFloat(customerPoints)
    };
  }

  const rewards = await LoyaltyReward.findAll({
    where: whereClause,
    order: [['pointsRequired', 'ASC']]
  });

  res.status(200).json({
    status: 'success',
    results: rewards.length,
    data: {
      rewards
    }
  });
});

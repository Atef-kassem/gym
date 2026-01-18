const PointsTransaction = require('../Model/pointsTransactionModel');
const LoyaltyMember = require('../Model/loyaltyMemberModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Op, fn, col } = require('sequelize');

// الحصول على جميع المعاملات
exports.getAllTransactions = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 100000000,
    search,
    type,
    customerId,
    startDate,
    endDate,
    sortBy = 'date',
    sortOrder = 'DESC'
  } = req.query;

  const offset = (page - 1) * limit;
  
  // بناء شروط البحث
  const whereClause = { isActive: true };
  
  if (search) {
    whereClause[Op.or] = [
      { customerName: { [Op.like]: `%${search}%` } },
      { reason: { [Op.like]: `%${search}%` } }
    ];
  }
  
  if (type && type !== 'all') {
    whereClause.type = type;
  }
  
  if (customerId) {
    whereClause.customerId = customerId;
  }
  
  if (startDate && endDate) {
    whereClause.date = {
      [Op.between]: [new Date(startDate), new Date(endDate)]
    };
  }

  // بناء خيارات الترتيب
  const orderClause = [[sortBy, sortOrder.toUpperCase()]];

  const { count, rows: transactions } = await PointsTransaction.findAndCountAll({
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
      transactions
    }
  });
});

// الحصول على معاملة واحدة
exports.getTransaction = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const transaction = await PointsTransaction.findOne({
    where: { id, isActive: true }
  });

  if (!transaction) {
    return next(new AppError('المعاملة غير موجودة', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      transaction
    }
  });
});

// إنشاء معاملة جديدة
exports.createTransaction = catchAsync(async (req, res, next) => {
  const {
    customerId,
    customerName,
    type,
    points,
    reason,
    relatedOrderId
  } = req.body;

  // التحقق من وجود العضو
  const member = await LoyaltyMember.findOne({
    where: { id: customerId, isActive: true }
  });

  if (!member) {
    return next(new AppError('العضو غير موجود', 404));
  }

  const pointsValue = parseFloat(points);
  if (isNaN(pointsValue) || pointsValue <= 0) {
    return next(new AppError('عدد النقاط غير صحيح', 400));
  }

  // التحقق من رصيد النقاط إذا كانت المعاملة استرداد
  if (type === 'redeemed' && member.currentBalance < pointsValue) {
    return next(new AppError('رصيد النقاط غير كافي', 400));
  }

  // إنشاء المعاملة
  const transaction = await PointsTransaction.create({
    customerId,
    customerName,
    type,
    points: pointsValue,
    reason,
    date: new Date(),
    relatedOrderId,
    createdBy: null
  });

  // تحديث رصيد العضو
  let updateData = {};
  if (type === 'earned' || type === 'bonus') {
    updateData = {
      totalEarned: member.totalEarned + pointsValue,
      currentBalance: member.currentBalance + pointsValue
    };
  } else if (type === 'redeemed') {
    updateData = {
      totalSpent: member.totalSpent + pointsValue,
      currentBalance: member.currentBalance - pointsValue
    };
  } else if (type === 'expired') {
    updateData = {
      currentBalance: member.currentBalance - pointsValue
    };
  }

  await member.update(updateData);

  res.status(201).json({
    status: 'success',
    data: {
      transaction,
      member
    }
  });
});

// تحديث معاملة
exports.updateTransaction = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const transaction = await PointsTransaction.findOne({
    where: { id, isActive: true }
  });

  if (!transaction) {
    return next(new AppError('المعاملة غير موجودة', 404));
  }

  // تحويل القيم الرقمية
  if (updateData.points) updateData.points = parseFloat(updateData.points);

  updateData.updatedBy = null;

  await transaction.update(updateData);

  res.status(200).json({
    status: 'success',
    data: {
      transaction
    }
  });
});

// حذف معاملة
exports.deleteTransaction = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const transaction = await PointsTransaction.findOne({
    where: { id, isActive: true }
  });

  if (!transaction) {
    return next(new AppError('المعاملة غير موجودة', 404));
  }

  await transaction.destroy(); // Soft delete

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// الحصول على إحصائيات المعاملات
exports.getTransactionStats = catchAsync(async (req, res, next) => {
  const totalTransactions = await PointsTransaction.count({ where: { isActive: true } });
  const totalEarned = await PointsTransaction.sum('points', { where: { isActive: true, type: 'earned' } });
  const totalRedeemed = await PointsTransaction.sum('points', { where: { isActive: true, type: 'redeemed' } });
  const totalBonus = await PointsTransaction.sum('points', { where: { isActive: true, type: 'bonus' } });

  const transactionsByType = await PointsTransaction.findAll({
    where: { isActive: true },
    attributes: [
      'type',
      [fn('COUNT', col('id')), 'count'],
      [fn('SUM', col('points')), 'totalPoints']
    ],
    group: ['type']
  });

  const transactionsByMonth = await PointsTransaction.findAll({
    where: { isActive: true },
    attributes: [
      [fn('DATE_FORMAT', col('date'), '%Y-%m'), 'month'],
      [fn('COUNT', col('id')), 'count'],
      [fn('SUM', col('points')), 'totalPoints']
    ],
    group: [fn('DATE_FORMAT', col('date'), '%Y-%m')],
    order: [[fn('DATE_FORMAT', col('date'), '%Y-%m'), 'DESC']],
    limit: 12
  });

  res.status(200).json({
    status: 'success',
    data: {
      summary: {
        totalTransactions,
        totalEarned: totalEarned || 0,
        totalRedeemed: totalRedeemed || 0,
        totalBonus: totalBonus || 0
      },
      transactionsByType,
      transactionsByMonth
    }
  });
});

// البحث عن معاملات العميل
exports.getCustomerTransactions = catchAsync(async (req, res, next) => {
  const { customerId } = req.params;

  const transactions = await PointsTransaction.findAll({
    where: { 
      customerId,
      isActive: true
    },
    order: [['date', 'DESC']]
  });

  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: {
      transactions
    }
  });
});

// تصدير المعاملات
exports.exportTransactions = catchAsync(async (req, res, next) => {
  const { format = 'json', customerId } = req.query;

  const whereClause = { isActive: true };
  if (customerId) {
    whereClause.customerId = customerId;
  }

  const transactions = await PointsTransaction.findAll({
    where: whereClause,
    order: [['date', 'DESC']]
  });

  if (format === 'csv') {
    // إنشاء CSV
    const headers = ['العضو', 'النوع', 'النقاط', 'السبب', 'التاريخ', 'رقم الطلب'];
    const csvContent = [
      headers.join(','),
      ...transactions.map(transaction => [
        transaction.customerName,
        transaction.type === 'earned' ? 'كسب' : 
        transaction.type === 'redeemed' ? 'استرداد' : 
        transaction.type === 'bonus' ? 'مكافأة' : 'منتهي',
        transaction.points,
        transaction.reason,
        new Date(transaction.date).toLocaleDateString('ar-SA'),
        transaction.relatedOrderId || ''
      ].join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=points_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csvContent);
  } else {
    // إرجاع JSON
    res.status(200).json({
      status: 'success',
      results: transactions.length,
      data: {
        transactions
      }
    });
  }
});

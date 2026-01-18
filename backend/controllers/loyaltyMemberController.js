const LoyaltyMember = require('../Model/loyaltyMemberModel');
const PointsTransaction = require('../Model/pointsTransactionModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Op, fn, col } = require('sequelize');

// إنشاء عضو جديد
exports.createMember = catchAsync(async (req, res, next) => {
  const {
    customerId,
    customerName,
    customerEmail,
    customerPhone,
    initialPoints
  } = req.body;

  // التحقق من عدم وجود عضو بنفس العميل
  const existingMember = await LoyaltyMember.findOne({ 
    where: { customerId, isActive: true } 
  });
  
  if (existingMember) {
    return next(new AppError('العميل مسجل بالفعل في برنامج الولاء', 400));
  }

  const joinDate = new Date();
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);

  const member = await LoyaltyMember.create({
    customerId,
    customerName,
    customerEmail,
    customerPhone,
    joinDate: joinDate.toISOString().split('T')[0],
    totalEarned: parseFloat(initialPoints) || 0,
    totalSpent: 0,
    currentBalance: parseFloat(initialPoints) || 0,
    expiryDate: expiryDate.toISOString().split('T')[0],
    createdBy: null
  });

  // إنشاء معاملة للنقاط الترحيبية إذا كانت موجودة
  if (parseFloat(initialPoints) > 0) {
    await PointsTransaction.create({
      customerId: member.id,
      customerName: member.customerName,
      type: 'bonus',
      points: parseFloat(initialPoints),
      reason: 'نقاط ترحيبية',
      date: new Date(),
      expiryDate: expiryDate.toISOString().split('T')[0],
      createdBy: null
    });
  }

  res.status(201).json({
    status: 'success',
    data: {
      member
    }
  });
});

// الحصول على جميع الأعضاء
exports.getAllMembers = catchAsync(async (req, res, next) => {
  const {
    page = 1,
    limit = 100000000,
    search,
    level,
    status,
    sortBy = 'createdAt',
    sortOrder = 'DESC'
  } = req.query;

  const offset = (page - 1) * limit;
  
  // بناء شروط البحث
  const whereClause = { isActive: true };
  
  if (search) {
    whereClause[Op.or] = [
      { customerName: { [Op.like]: `%${search}%` } },
      { customerEmail: { [Op.like]: `%${search}%` } },
      { customerPhone: { [Op.like]: `%${search}%` } }
    ];
  }
  
  if (level && level !== 'all') {
    whereClause.membershipLevel = level;
  }
  
  if (status && status !== 'all') {
    whereClause.status = status;
  }

  // بناء خيارات الترتيب
  const orderClause = [[sortBy, sortOrder.toUpperCase()]];

  const { count, rows: members } = await LoyaltyMember.findAndCountAll({
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
      members
    }
  });
});

// الحصول على عضو واحد
exports.getMember = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const member = await LoyaltyMember.findOne({
    where: { id, isActive: true }
  });

  if (!member) {
    return next(new AppError('العضو غير موجود', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      member
    }
  });
});

// تحديث عضو
exports.updateMember = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;

  const member = await LoyaltyMember.findOne({
    where: { id, isActive: true }
  });

  if (!member) {
    return next(new AppError('العضو غير موجود', 404));
  }

  // تحويل القيم الرقمية
  if (updateData.totalEarned) updateData.totalEarned = parseFloat(updateData.totalEarned);
  if (updateData.totalSpent) updateData.totalSpent = parseFloat(updateData.totalSpent);
  if (updateData.currentBalance) updateData.currentBalance = parseFloat(updateData.currentBalance);
  if (updateData.pointsExpiring) updateData.pointsExpiring = parseFloat(updateData.pointsExpiring);

  // تحويل القيم المنطقية
  if (updateData.birthdayBonus !== undefined) updateData.birthdayBonus = Boolean(updateData.birthdayBonus);
  if (updateData.nationalDayBonus !== undefined) updateData.nationalDayBonus = Boolean(updateData.nationalDayBonus);

  updateData.updatedBy = null;

  await member.update(updateData);

  res.status(200).json({
    status: 'success',
    data: {
      member
    }
  });
});

// حذف عضو
exports.deleteMember = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const member = await LoyaltyMember.findOne({
    where: { id, isActive: true }
  });

  if (!member) {
    return next(new AppError('العضو غير موجود', 404));
  }

  await member.destroy(); // Soft delete

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// تبديل حالة العضو
exports.toggleMemberStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  const member = await LoyaltyMember.findOne({
    where: { id, isActive: true }
  });

  if (!member) {
    return next(new AppError('العضو غير موجود', 404));
  }

  await member.update({ status });

  res.status(200).json({
    status: 'success',
    data: {
      member
    }
  });
});

// إضافة/خصم نقاط
exports.updatePoints = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { points, type, reason, relatedOrderId } = req.body;

  const member = await LoyaltyMember.findOne({
    where: { id, isActive: true }
  });

  if (!member) {
    return next(new AppError('العضو غير موجود', 404));
  }

  const pointsValue = parseFloat(points);
  if (isNaN(pointsValue) || pointsValue <= 0) {
    return next(new AppError('عدد النقاط غير صحيح', 400));
  }

  let updateData = {};
  let transactionType = type;

  if (type === 'earned' || type === 'bonus') {
    updateData = {
      totalEarned: member.totalEarned + pointsValue,
      currentBalance: member.currentBalance + pointsValue
    };
  } else if (type === 'redeemed') {
    if (member.currentBalance < pointsValue) {
      return next(new AppError('رصيد النقاط غير كافي', 400));
    }
    updateData = {
      totalSpent: member.totalSpent + pointsValue,
      currentBalance: member.currentBalance - pointsValue
    };
  } else if (type === 'expired') {
    if (member.currentBalance < pointsValue) {
      return next(new AppError('رصيد النقاط غير كافي', 400));
    }
    updateData = {
      currentBalance: member.currentBalance - pointsValue
    };
  }

  // تحديث العضو
  await member.update(updateData);

  // إنشاء معاملة
  const transaction = await PointsTransaction.create({
    customerId: member.id,
    customerName: member.customerName,
    type: transactionType,
    points: pointsValue,
    reason,
    date: new Date(),
    relatedOrderId,
    createdBy: null
  });

  res.status(200).json({
    status: 'success',
    data: {
      member,
      transaction
    }
  });
});

// الحصول على إحصائيات الأعضاء
exports.getMemberStats = catchAsync(async (req, res, next) => {
  const totalMembers = await LoyaltyMember.count({ where: { isActive: true } });
  const activeMembers = await LoyaltyMember.count({ where: { isActive: true, status: 'نشط' } });
  const totalPoints = await LoyaltyMember.sum('currentBalance', { where: { isActive: true } });
  const totalEarned = await LoyaltyMember.sum('totalEarned', { where: { isActive: true } });
  const totalSpent = await LoyaltyMember.sum('totalSpent', { where: { isActive: true } });

  const membersByLevel = await LoyaltyMember.findAll({
    where: { isActive: true },
    attributes: [
      'membershipLevel',
      [fn('COUNT', col('id')), 'count'],
      [fn('AVG', col('currentBalance')), 'avgBalance']
    ],
    group: ['membershipLevel']
  });

  res.status(200).json({
    status: 'success',
    data: {
      summary: {
        totalMembers,
        activeMembers,
        totalPoints: totalPoints || 0,
        totalEarned: totalEarned || 0,
        totalSpent: totalSpent || 0
      },
      membersByLevel
    }
  });
});

// البحث عن أعضاء العميل
exports.getCustomerMembers = catchAsync(async (req, res, next) => {
  const { customerId } = req.params;

  const members = await LoyaltyMember.findAll({
    where: { 
      customerId,
      isActive: true
    },
    order: [['createdAt', 'DESC']]
  });

  res.status(200).json({
    status: 'success',
    results: members.length,
    data: {
      members
    }
  });
});

// تصدير الأعضاء
exports.exportMembers = catchAsync(async (req, res, next) => {
  const { format = 'json' } = req.query;

  const members = await LoyaltyMember.findAll({
    where: { isActive: true },
    order: [['createdAt', 'DESC']]
  });

  if (format === 'csv') {
    // إنشاء CSV
    const headers = ['اسم العضو', 'البريد الإلكتروني', 'الجوال', 'المستوى', 'الرصيد الحالي', 'إجمالي المكتسب', 'إجمالي المستخدم', 'تاريخ الانضمام', 'آخر نشاط', 'الحالة'];
    const csvContent = [
      headers.join(','),
      ...members.map(member => [
        member.customerName,
        member.customerEmail,
        member.customerPhone,
        member.membershipLevel,
        member.currentBalance,
        member.totalEarned,
        member.totalSpent,
        member.joinDate,
        member.lastActivity,
        member.status
      ].join(','))
    ].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=loyalty_members_${new Date().toISOString().split('T')[0]}.csv`);
    res.send(csvContent);
  } else {
    // إرجاع JSON
    res.status(200).json({
      status: 'success',
      results: members.length,
      data: {
        members
      }
    });
  }
});

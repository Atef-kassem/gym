const { POSNotificationRule, Company, User } = require('../Model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Op } = require('sequelize');

// إنشاء قاعدة إشعار جديدة
exports.createNotificationRule = catchAsync(async (req, res, next) => {
  const {
    name,
    type,
    trigger,
    threshold,
    thresholdType,
    channels,
    recipients,
    messageTemplate,
    subjectTemplate,
    conditions,
    schedule,
    priority,
    groupBy,
    cooldownMinutes,
    maxNotificationsPerHour
  } = req.body;

  const companyId = req.user.companyId;

  const rule = await POSNotificationRule.create({
    name,
    type,
    trigger,
    threshold,
    thresholdType,
    channels,
    recipients,
    messageTemplate,
    subjectTemplate,
    conditions,
    schedule,
    priority,
    groupBy,
    cooldownMinutes,
    maxNotificationsPerHour,
    companyId,
    createdBy: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: { rule }
  });
});

// الحصول على جميع قواعد الإشعارات
exports.getAllNotificationRules = catchAsync(async (req, res, next) => {
  const { type, isActive, priority, search } = req.query;
  const companyId = req.user.companyId;

  const whereClause = { companyId };

  if (type) whereClause.type = type;
  if (isActive !== undefined) whereClause.isActive = isActive === 'true';
  if (priority) whereClause.priority = priority;
  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { trigger: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const rules = await POSNotificationRule.findAll({
    where: whereClause,
    include: [
      {
        model: Company,
        as: 'notificationCompany',
        attributes: ['id', 'arabicName', 'englishName', 'code']
      },
      {
        model: User,
        as: 'notificationCreator',
        attributes: ['id', 'arabicName', 'englinshName']
      }
    ],
    order: [['priority', 'ASC'], ['createdAt', 'ASC']]
  });

  res.status(200).json({
    status: 'success',
    results: rules.length,
    data: { rules }
  });
});

// الحصول على قاعدة إشعار واحدة
exports.getNotificationRule = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const rule = await POSNotificationRule.findOne({
    where: { id, companyId }
  });

  if (!rule) {
    return next(new AppError('لم يتم العثور على قاعدة الإشعار', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { rule }
  });
});

// تحديث قاعدة إشعار
exports.updateNotificationRule = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const rule = await POSNotificationRule.findOne({
    where: { id, companyId }
  });

  if (!rule) {
    return next(new AppError('لم يتم العثور على قاعدة الإشعار', 404));
  }

  await rule.update({
    ...req.body,
    updatedBy: req.user.id
  });

  res.status(200).json({
    status: 'success',
    data: { rule }
  });
});

// حذف قاعدة إشعار
exports.deleteNotificationRule = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const rule = await POSNotificationRule.findOne({
    where: { id, companyId }
  });

  if (!rule) {
    return next(new AppError('لم يتم العثور على قاعدة الإشعار', 404));
  }

  await rule.destroy();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// تبديل حالة قاعدة الإشعار
exports.toggleNotificationRule = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const rule = await POSNotificationRule.findOne({
    where: { id, companyId }
  });

  if (!rule) {
    return next(new AppError('لم يتم العثور على قاعدة الإشعار', 404));
  }

  rule.isActive = !rule.isActive;
  rule.updatedBy = req.user.id;
  await rule.save();

  res.status(200).json({
    status: 'success',
    data: { rule }
  });
});

// اختبار قاعدة الإشعار
exports.testNotificationRule = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { testData } = req.body;
  const companyId = req.user.companyId;

  const rule = await POSNotificationRule.findOne({
    where: { id, companyId }
  });

  if (!rule) {
    return next(new AppError('لم يتم العثور على قاعدة الإشعار', 404));
  }

  if (!rule.isActive) {
    return next(new AppError('القاعدة غير مفعلة', 400));
  }

  try {
    // محاكاة إرسال الإشعار
    const notificationResult = await simulateNotification(rule, testData);
    
    res.status(200).json({
      status: 'success',
      message: 'تم اختبار قاعدة الإشعار بنجاح',
      data: {
        rule,
        testResult: notificationResult,
        sentAt: new Date()
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'فشل في اختبار قاعدة الإشعار',
      error: error.message
    });
  }
});

// دالة مساعدة لمحاكاة الإشعار
async function simulateNotification(rule, testData) {
  // محاكاة تأخير الشبكة
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const result = {
    success: true,
    channels: {},
    message: `تم إرسال إشعار: ${rule.name}`,
    timestamp: new Date()
  };

  // محاكاة إرسال لكل قناة
  for (const channel of rule.channels) {
    result.channels[channel] = {
      sent: true,
      recipient: rule.recipients[0] || 'test@example.com',
      responseTime: Math.random() * 1000 + 500
    };
  }

  return result;
}

// إرسال إشعار فوري
exports.sendImmediateNotification = catchAsync(async (req, res, next) => {
  const { ruleId, message, recipients, channels } = req.body;
  const companyId = req.user.companyId;

  let rule;
  if (ruleId) {
    rule = await POSNotificationRule.findOne({
      where: { id: ruleId, companyId }
    });
    
    if (!rule) {
      return next(new AppError('لم يتم العثور على قاعدة الإشعار', 404));
    }
  }

  const notificationData = {
    message: message || rule?.messageTemplate || 'إشعار فوري',
    recipients: recipients || rule?.recipients || [],
    channels: channels || rule?.channels || ['inapp'],
    priority: rule?.priority || 'normal',
    companyId
  };

  try {
    // محاكاة إرسال الإشعار
    const result = await simulateNotification(notificationData);
    
    res.status(200).json({
      status: 'success',
      message: 'تم إرسال الإشعار بنجاح',
      data: {
        notification: notificationData,
        result,
        sentAt: new Date()
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'فشل في إرسال الإشعار',
      error: error.message
    });
  }
});

// تحديث ترتيب قواعد الإشعارات
exports.updateRulesOrder = catchAsync(async (req, res, next) => {
  const { orderData } = req.body;
  const companyId = req.user.companyId;

  if (!Array.isArray(orderData)) {
    return next(new AppError('بيانات الترتيب غير صحيحة', 400));
  }

  // تحديث الترتيب لكل قاعدة
  for (const item of orderData) {
    await POSNotificationRule.update(
      { sortOrder: item.sortOrder, updatedBy: req.user.id },
      { where: { id: item.id, companyId } }
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'تم تحديث ترتيب قواعد الإشعارات بنجاح'
  });
});

// إحصائيات قواعد الإشعارات
exports.getNotificationRulesStats = catchAsync(async (req, res, next) => {
  const companyId = req.user.companyId;

  const totalRules = await POSNotificationRule.count({ where: { companyId } });
  const activeRules = await POSNotificationRule.count({ where: { companyId, isActive: true } });
  const inactiveRules = totalRules - activeRules;

  // إحصائيات حسب النوع
  const rulesByType = await POSNotificationRule.findAll({
    where: { companyId },
    attributes: [
      'type',
      'isActive',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['type', 'isActive']
  });

  // إحصائيات حسب الأولوية
  const rulesByPriority = await POSNotificationRule.findAll({
    where: { companyId },
    attributes: [
      'priority',
      'isActive',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['priority', 'isActive']
  });

  res.status(200).json({
    status: 'success',
    data: {
      totalRules,
      activeRules,
      inactiveRules,
      rulesByType,
      rulesByPriority
    }
  });
});

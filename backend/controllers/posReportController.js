const { POSReportTemplate, Company, User } = require('../Model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Op } = require('sequelize');

// إنشاء قالب تقرير جديد
exports.createReportTemplate = catchAsync(async (req, res, next) => {
  const {
    name,
    type,
    frequency,
    autoGenerate,
    recipients,
    format,
    schedule,
    parameters,
    filters,
    columns,
    sorting,
    grouping,
    charts,
    watermark,
    password,
    retentionDays,
    maxFileSize
  } = req.body;

  const companyId = req.user.companyId;

  const template = await POSReportTemplate.create({
    name,
    type,
    frequency,
    autoGenerate,
    recipients,
    format,
    schedule,
    parameters,
    filters,
    columns,
    sorting,
    grouping,
    charts,
    watermark,
    password,
    retentionDays,
    maxFileSize,
    companyId,
    createdBy: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: { template }
  });
});

// الحصول على جميع قوالب التقارير
exports.getAllReportTemplates = catchAsync(async (req, res, next) => {
  const { type, frequency, isActive, autoGenerate, search } = req.query;
  const companyId = req.user.companyId;

  const whereClause = { companyId };

  if (type) whereClause.type = type;
  if (frequency) whereClause.frequency = frequency;
  if (isActive !== undefined) whereClause.isActive = isActive === 'true';
  if (autoGenerate !== undefined) whereClause.autoGenerate = autoGenerate === 'true';
  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { type: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const templates = await POSReportTemplate.findAll({
    where: whereClause,
    include: [
      {
        model: Company,
        as: 'reportCompany',
        attributes: ['id', 'arabicName', 'englishName', 'code']
      },
      {
        model: User,
        as: 'reportCreator',
        attributes: ['id', 'arabicName', 'englinshName']
      }
    ],
    order: [['frequency', 'ASC'], ['createdAt', 'ASC']]
  });

  res.status(200).json({
    status: 'success',
    results: templates.length,
    data: { templates }
  });
});

// الحصول على قالب تقرير واحد
exports.getReportTemplate = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const template = await POSReportTemplate.findOne({
    where: { id, companyId }
  });

  if (!template) {
    return next(new AppError('لم يتم العثور على قالب التقرير', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { template }
  });
});

// تحديث قالب تقرير
exports.updateReportTemplate = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const template = await POSReportTemplate.findOne({
    where: { id, companyId }
  });

  if (!template) {
    return next(new AppError('لم يتم العثور على قالب التقرير', 404));
  }

  await template.update({
    ...req.body,
    updatedBy: req.user.id
  });

  res.status(200).json({
    status: 'success',
    data: { template }
  });
});

// حذف قالب تقرير
exports.deleteReportTemplate = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const template = await POSReportTemplate.findOne({
    where: { id, companyId }
  });

  if (!template) {
    return next(new AppError('لم يتم العثور على قالب التقرير', 404));
  }

  await template.destroy();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// تبديل حالة قالب التقرير
exports.toggleReportTemplate = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const template = await POSReportTemplate.findOne({
    where: { id, companyId }
  });

  if (!template) {
    return next(new AppError('لم يتم العثور على قالب التقرير', 404));
  }

  template.isActive = !template.isActive;
  template.updatedBy = req.user.id;
  await template.save();

  res.status(200).json({
    status: 'success',
    data: { template }
  });
});

// إنشاء تقرير تجريبي
exports.generateSampleReport = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sampleParameters } = req.body;
  const companyId = req.user.companyId;

  const template = await POSReportTemplate.findOne({
    where: { id, companyId }
  });

  if (!template) {
    return next(new AppError('لم يتم العثور على قالب التقرير', 404));
  }

  if (!template.isActive) {
    return next(new AppError('قالب التقرير غير مفعل', 400));
  }

  try {
    // محاكاة إنشاء التقرير
    const reportData = await simulateReportGeneration(template, sampleParameters);
    
    // تحديث آخر إنشاء
    await template.update({
      lastGenerated: new Date(),
      updatedBy: req.user.id
    });

    res.status(200).json({
      status: 'success',
      message: 'تم إنشاء التقرير التجريبي بنجاح',
      data: {
        template,
        report: reportData,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'فشل في إنشاء التقرير التجريبي',
      error: error.message
    });
  }
});

// دالة مساعدة لمحاكاة إنشاء التقرير
async function simulateReportGeneration(template, parameters) {
  // محاكاة تأخير معالجة البيانات
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const sampleData = {
    reportId: `RPT-${Date.now()}`,
    templateName: template.name,
    generatedAt: new Date(),
    format: template.format,
    parameters: parameters || {},
    data: {
      summary: {
        totalRecords: 1250,
        totalAmount: 456789.50,
        averageAmount: 365.43
      },
      details: [
        { id: 1, name: 'منتج 1', quantity: 100, amount: 15000 },
        { id: 2, name: 'منتج 2', quantity: 75, amount: 11250 },
        { id: 3, name: 'منتج 3', quantity: 200, amount: 30000 }
      ],
      charts: [
        { type: 'pie', title: 'توزيع المبيعات', data: [] },
        { type: 'bar', title: 'المبيعات الشهرية', data: [] }
      ]
    },
    fileSize: Math.floor(Math.random() * 5) + 1, // 1-5 MB
    processingTime: '2.1s'
  };

  return sampleData;
}

// جدولة تقرير
exports.scheduleReport = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { schedule } = req.body;
  const companyId = req.user.companyId;

  const template = await POSReportTemplate.findOne({
    where: { id, companyId }
  });

  if (!template) {
    return next(new AppError('لم يتم العثور على قالب التقرير', 404));
  }

  if (!template.isActive) {
    return next(new AppError('قالب التقرير غير مفعل', 400));
  }

  // تحديث الجدولة
  await template.update({
    schedule,
    autoGenerate: true,
    updatedBy: req.user.id
  });

  // حساب الإنشاء القادم
  const nextGeneration = calculateNextGeneration(schedule);
  if (nextGeneration) {
    await template.update({
      nextGeneration,
      updatedBy: req.user.id
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'تم جدولة التقرير بنجاح',
    data: {
      template,
      nextGeneration
    }
  });
});

// دالة مساعدة لحساب الإنشاء القادم
function calculateNextGeneration(schedule) {
  if (!schedule) return null;
  
  const now = new Date();
  const { frequency, time, dayOfWeek, dayOfMonth } = schedule;
  
  let nextDate = new Date(now);
  
  switch (frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      const daysUntilNext = (dayOfWeek - now.getDay() + 7) % 7;
      nextDate.setDate(nextDate.getDate() + daysUntilNext);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      nextDate.setDate(dayOfMonth || 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      nextDate.setDate(1);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      nextDate.setDate(1);
      break;
  }
  
  if (time) {
    const [hours, minutes] = time.split(':');
    nextDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  }
  
  return nextDate;
}

// إلغاء جدولة تقرير
exports.unscheduleReport = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const template = await POSReportTemplate.findOne({
    where: { id, companyId }
  });

  if (!template) {
    return next(new AppError('لم يتم العثور على قالب التقرير', 404));
  }

  await template.update({
    autoGenerate: false,
    schedule: null,
    nextGeneration: null,
    updatedBy: req.user.id
  });

  res.status(200).json({
    status: 'success',
    message: 'تم إلغاء جدولة التقرير بنجاح',
    data: { template }
  });
});

// تحديث ترتيب قوالب التقارير
exports.updateTemplatesOrder = catchAsync(async (req, res, next) => {
  const { orderData } = req.body;
  const companyId = req.user.companyId;

  if (!Array.isArray(orderData)) {
    return next(new AppError('بيانات الترتيب غير صحيحة', 400));
  }

  // تحديث الترتيب لكل قالب
  for (const item of orderData) {
    await POSReportTemplate.update(
      { sortOrder: item.sortOrder, updatedBy: req.user.id },
      { where: { id: item.id, companyId } }
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'تم تحديث ترتيب قوالب التقارير بنجاح'
  });
});

// إحصائيات قوالب التقارير
exports.getReportTemplatesStats = catchAsync(async (req, res, next) => {
  const companyId = req.user.companyId;

  const totalTemplates = await POSReportTemplate.count({ where: { companyId } });
  const activeTemplates = await POSReportTemplate.count({ where: { companyId, isActive: true } });
  const autoGenerateTemplates = await POSReportTemplate.count({ where: { companyId, autoGenerate: true } });

  // إحصائيات حسب النوع
  const templatesByType = await POSReportTemplate.findAll({
    where: { companyId },
    attributes: [
      'type',
      'isActive',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['type', 'isActive']
  });

  // إحصائيات حسب التكرار
  const templatesByFrequency = await POSReportTemplate.findAll({
    where: { companyId },
    attributes: [
      'frequency',
      'isActive',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['frequency', 'isActive']
  });

  res.status(200).json({
    status: 'success',
    data: {
      totalTemplates,
      activeTemplates,
      inactiveTemplates: totalTemplates - activeTemplates,
      autoGenerateTemplates,
      templatesByType,
      templatesByFrequency
    }
  });
});

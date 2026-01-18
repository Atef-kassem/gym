const { POSInvoiceTemplate, Company, User } = require('../Model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { Op } = require('sequelize');

// إنشاء قالب ايصال جديد
exports.createInvoiceTemplate = catchAsync(async (req, res, next) => {
  const {
    name,
    type,
    paperSize,
    includeHeader,
    includeLogo,
    includeFooter,
    includeQR,
    includeSignature,
    headerText,
    footerText,
    cssStyles,
    layoutConfig
  } = req.body;

  const companyId = req.user.companyId;

  // إذا كان القالب الجديد افتراضي، إلغاء الافتراضي من القوالب الأخرى
  if (req.body.isDefault) {
    await POSInvoiceTemplate.update(
      { isDefault: false },
      { where: { companyId, isDefault: true } }
    );
  }

  const template = await POSInvoiceTemplate.create({
    name,
    type,
    paperSize,
    includeHeader,
    includeLogo,
    includeFooter,
    includeQR,
    includeSignature,
    headerText,
    footerText,
    cssStyles,
    layoutConfig,
    companyId,
    createdBy: req.user.id
  });

  res.status(201).json({
    status: 'success',
    data: { template }
  });
});

// الحصول على جميع قوالب الإيصالات
exports.getAllInvoiceTemplates = catchAsync(async (req, res, next) => {
  const { type, isActive, search } = req.query;
  const companyId = req.user.companyId;

  const whereClause = { companyId };

  if (type) whereClause.type = type;
  if (isActive !== undefined) whereClause.isActive = isActive === 'true';
  if (search) {
    whereClause[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { type: { [Op.iLike]: `%${search}%` } }
    ];
  }

  const templates = await POSInvoiceTemplate.findAll({
    where: whereClause,
    include: [
      {
        model: Company,
        as: 'invoiceCompany',
        attributes: ['id', 'arabicName', 'englishName', 'code']
      },
      {
        model: User,
        as: 'invoiceCreator',
        attributes: ['id', 'arabicName', 'englinshName']
      }
    ],
    order: [['isDefault', 'DESC'], ['sortOrder', 'ASC'], ['createdAt', 'ASC']]
  });

  res.status(200).json({
    status: 'success',
    results: templates.length,
    data: { templates }
  });
});

// الحصول على قالب ايصال واحد
exports.getInvoiceTemplate = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const template = await POSInvoiceTemplate.findOne({
    where: { id, companyId }
  });

  if (!template) {
    return next(new AppError('لم يتم العثور على قالب الايصال', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { template }
  });
});

// تحديث قالب ايصال
exports.updateInvoiceTemplate = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const template = await POSInvoiceTemplate.findOne({
    where: { id, companyId }
  });

  if (!template) {
    return next(new AppError('لم يتم العثور على قالب الايصال', 404));
  }

  // إذا كان القالب سيصبح افتراضي، إلغاء الافتراضي من القوالب الأخرى
  if (req.body.isDefault && !template.isDefault) {
    await POSInvoiceTemplate.update(
      { isDefault: false },
      { where: { companyId, isDefault: true } }
    );
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

// حذف قالب ايصال
exports.deleteInvoiceTemplate = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const template = await POSInvoiceTemplate.findOne({
    where: { id, companyId }
  });

  if (!template) {
    return next(new AppError('لم يتم العثور على قالب الايصال', 404));
  }

  if (template.isDefault) {
    return next(new AppError('لا يمكن حذف القالب الافتراضي', 400));
  }

  await template.destroy();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// تعيين قالب كافتراضي
exports.setDefaultTemplate = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const companyId = req.user.companyId;

  const template = await POSInvoiceTemplate.findOne({
    where: { id, companyId }
  });

  if (!template) {
    return next(new AppError('لم يتم العثور على قالب الايصال', 404));
  }

  // إلغاء الافتراضي من جميع القوالب
  await POSInvoiceTemplate.update(
    { isDefault: false },
    { where: { companyId } }
  );

  // تعيين القالب الجديد كافتراضي
  template.isDefault = true;
  template.updatedBy = req.user.id;
  await template.save();

  res.status(200).json({
    status: 'success',
    message: 'تم تعيين القالب كافتراضي بنجاح',
    data: { template }
  });
});

// نسخ قالب ايصال
exports.duplicateTemplate = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { newName } = req.body;
  const companyId = req.user.companyId;

  const originalTemplate = await POSInvoiceTemplate.findOne({
    where: { id, companyId }
  });

  if (!originalTemplate) {
    return next(new AppError('لم يتم العثور على قالب الايصال', 404));
  }

  const duplicatedTemplate = await POSInvoiceTemplate.create({
    ...originalTemplate.toJSON(),
    id: undefined,
    name: newName || `${originalTemplate.name} (نسخة)`,
    isDefault: false,
    createdBy: req.user.id,
    updatedBy: req.user.id,
    createdAt: undefined,
    updatedAt: undefined
  });

  res.status(201).json({
    status: 'success',
    message: 'تم نسخ القالب بنجاح',
    data: { template: duplicatedTemplate }
  });
});

// معاينة قالب الايصال
exports.previewTemplate = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sampleData } = req.body;
  const companyId = req.user.companyId;

  const template = await POSInvoiceTemplate.findOne({
    where: { id, companyId }
  });

  if (!template) {
    return next(new AppError('لم يتم العثور على قالب الايصال', 404));
  }

  // هنا يمكن إضافة منطق إنشاء معاينة الايصال
  // مثال: استخدام مكتبة مثل puppeteer لإنشاء PDF
  
  const previewData = {
    template,
    sampleData: sampleData || {
      invoiceNumber: 'INV-2024-001',
      date: new Date().toLocaleDateString('ar-SA'),
      customerName: 'عميل تجريبي',
      items: [
        { name: 'منتج تجريبي 1', quantity: 2, price: 100, total: 200 },
        { name: 'منتج تجريبي 2', quantity: 1, price: 150, total: 150 }
      ],
      subtotal: 350,
      tax: 35,
      total: 385
    }
  };

  res.status(200).json({
    status: 'success',
    data: { preview: previewData }
  });
});

// تحديث ترتيب القوالب
exports.updateTemplatesOrder = catchAsync(async (req, res, next) => {
  const { orderData } = req.body;
  const companyId = req.user.companyId;

  if (!Array.isArray(orderData)) {
    return next(new AppError('بيانات الترتيب غير صحيحة', 400));
  }

  // تحديث الترتيب لكل قالب
  for (const item of orderData) {
    await POSInvoiceTemplate.update(
      { sortOrder: item.sortOrder, updatedBy: req.user.id },
      { where: { id: item.id, companyId } }
    );
  }

  res.status(200).json({
    status: 'success',
    message: 'تم تحديث ترتيب القوالب بنجاح'
  });
});

// إحصائيات قوالب الإيصالات
exports.getTemplatesStats = catchAsync(async (req, res, next) => {
  const companyId = req.user.companyId;

  const totalTemplates = await POSInvoiceTemplate.count({ where: { companyId } });
  const activeTemplates = await POSInvoiceTemplate.count({ where: { companyId, isActive: true } });
  const defaultTemplate = await POSInvoiceTemplate.findOne({ where: { companyId, isDefault: true } });

  // إحصائيات حسب النوع
  const templatesByType = await POSInvoiceTemplate.findAll({
    where: { companyId },
    attributes: [
      'type',
      'isActive',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count']
    ],
    group: ['type', 'isActive']
  });

  res.status(200).json({
    status: 'success',
    data: {
      totalTemplates,
      activeTemplates,
      inactiveTemplates: totalTemplates - activeTemplates,
      defaultTemplate,
      templatesByType
    }
  });
});

const { POSSettings, Company, Branch, User } = require('../Model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// الحصول على إعدادات فئة معينة
exports.getSettingsByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.params;
  const { branchId } = req.query;
  const companyId = req.user.companyId;

  const whereClause = { companyId, category };
  if (branchId) {
    whereClause.branchId = branchId;
  } else {
    whereClause.branchId = null; // إعدادات الشركة العامة
  }

  const settings = await POSSettings.findAll({
    where: whereClause,
    include: [
      {
        model: Company,
        as: 'settingsCompany',
        attributes: ['id', 'arabicName', 'englishName', 'code']
      },
      {
        model: Branch,
        as: 'settingsBranch',
        attributes: ['id', 'arabicName', 'englishName', 'code']
      },
      {
        model: User,
        as: 'settingsCreator',
        attributes: ['id', 'arabicName', 'englinshName']
      }
    ],
    order: [['sortOrder', 'ASC'], ['createdAt', 'ASC']]
  });

  // تحويل الإعدادات إلى كائن
  const settingsObject = {};
  settings.forEach(setting => {
    let value = setting.settingValue;
    
    // تحويل القيم حسب النوع
    switch (setting.settingType) {
      case 'boolean':
        value = value === 'true' || value === true;
        break;
      case 'number':
        value = parseFloat(value) || 0;
        break;
      case 'json':
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = {};
        }
        break;
      case 'array':
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = [];
        }
        break;
    }
    
    settingsObject[setting.settingKey] = value;
  });

  res.status(200).json({
    status: 'success',
    data: { settings: settingsObject, rawSettings: settings }
  });
});

// حفظ إعدادات فئة معينة
exports.saveSettingsByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.params;
  const { branchId, settings } = req.body;
  const companyId = req.user.companyId;

  // حذف الإعدادات القديمة
  const whereClause = { companyId, category };
  if (branchId) {
    whereClause.branchId = branchId;
  } else {
    whereClause.branchId = null;
  }

  await POSSettings.destroy({ where: whereClause });

  // إنشاء الإعدادات الجديدة
  const settingsArray = [];
  for (const [key, value] of Object.entries(settings)) {
    let settingType = 'string';
    let settingValue = value;

    // تحديد نوع القيمة
    if (typeof value === 'boolean') {
      settingType = 'boolean';
      settingValue = value.toString();
    } else if (typeof value === 'number') {
      settingType = 'number';
      settingValue = value.toString();
    } else if (Array.isArray(value)) {
      settingType = 'array';
      settingValue = JSON.stringify(value);
    } else if (typeof value === 'object' && value !== null) {
      settingType = 'json';
      settingValue = JSON.stringify(value);
    }

    settingsArray.push({
      companyId,
      branchId: branchId || null,
      category,
      settingKey: key,
      settingValue,
      settingType,
      isActive: true,
      createdBy: req.user.id,
      updatedBy: req.user.id
    });
  }

  if (settingsArray.length > 0) {
    await POSSettings.bulkCreate(settingsArray);
  }

  res.status(200).json({
    status: 'success',
    message: 'تم حفظ الإعدادات بنجاح'
  });
});

// الحصول على إعداد واحد
exports.getSetting = catchAsync(async (req, res, next) => {
  const { category, key } = req.params;
  const { branchId } = req.query;
  const companyId = req.user.companyId;

  const whereClause = { companyId, category, settingKey: key };
  if (branchId) {
    whereClause.branchId = branchId;
  } else {
    whereClause.branchId = null;
  }

  const setting = await POSSettings.findOne({ where: whereClause });

  if (!setting) {
    return next(new AppError('لم يتم العثور على الإعداد', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { setting }
  });
});

// تحديث إعداد واحد
exports.updateSetting = catchAsync(async (req, res, next) => {
  const { category, key } = req.params;
  const { branchId, value, type } = req.body;
  const companyId = req.user.companyId;

  const whereClause = { companyId, category, settingKey: key };
  if (branchId) {
    whereClause.branchId = branchId;
  } else {
    whereClause.branchId = null;
  }

  let setting = await POSSettings.findOne({ where: whereClause });

  if (!setting) {
    // إنشاء إعداد جديد إذا لم يكن موجوداً
    setting = await POSSettings.create({
      companyId,
      branchId: branchId || null,
      category,
      settingKey: key,
      settingValue: value,
      settingType: type || 'string',
      isActive: true,
      createdBy: req.user.id,
      updatedBy: req.user.id
    });
  } else {
    // تحديث الإعداد الموجود
    await setting.update({
      settingValue: value,
      settingType: type || setting.settingType,
      updatedBy: req.user.id
    });
  }

  res.status(200).json({
    status: 'success',
    data: { setting }
  });
});

// حذف إعداد
exports.deleteSetting = catchAsync(async (req, res, next) => {
  const { category, key } = req.params;
  const { branchId } = req.query;
  const companyId = req.user.companyId;

  const whereClause = { companyId, category, settingKey: key };
  if (branchId) {
    whereClause.branchId = branchId;
  } else {
    whereClause.branchId = null;
  }

  const setting = await POSSettings.findOne({ where: whereClause });

  if (!setting) {
    return next(new AppError('لم يتم العثور على الإعداد', 404));
  }

  if (setting.isSystem) {
    return next(new AppError('لا يمكن حذف إعداد النظام', 400));
  }

  await setting.destroy();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

// نسخ إعدادات من فرع إلى فرع آخر
exports.copySettingsToBranch = catchAsync(async (req, res, next) => {
  const { sourceBranchId, targetBranchId } = req.body;
  const companyId = req.user.companyId;

  // الحصول على إعدادات الفرع المصدر
  const sourceSettings = await POSSettings.findAll({
    where: { companyId, branchId: sourceBranchId }
  });

  if (sourceSettings.length === 0) {
    return next(new AppError('لا توجد إعدادات للنسخ', 400));
  }

  // حذف الإعدادات الموجودة في الفرع الهدف
  await POSSettings.destroy({
    where: { companyId, branchId: targetBranchId }
  });

  // نسخ الإعدادات
  const copiedSettings = sourceSettings.map(setting => ({
    ...setting.toJSON(),
    id: undefined,
    branchId: targetBranchId,
    createdBy: req.user.id,
    updatedBy: req.user.id,
    createdAt: undefined,
    updatedAt: undefined
  }));

  await POSSettings.bulkCreate(copiedSettings);

  res.status(200).json({
    status: 'success',
    message: `تم نسخ ${copiedSettings.length} إعداد إلى الفرع بنجاح`
  });
});

// إعادة تعيين الإعدادات إلى القيم الافتراضية
exports.resetSettingsToDefault = catchAsync(async (req, res, next) => {
  const { category, branchId } = req.params;
  const companyId = req.user.companyId;

  const whereClause = { companyId, category };
  if (branchId && branchId !== 'company') {
    whereClause.branchId = branchId;
  } else {
    whereClause.branchId = null;
  }

  // حذف الإعدادات الحالية
  await POSSettings.destroy({ where: whereClause });

  // إنشاء الإعدادات الافتراضية (يمكن إضافتها من ملف منفصل)
  const defaultSettings = getDefaultSettings(category);
  
  if (defaultSettings.length > 0) {
    const settingsArray = defaultSettings.map(setting => ({
      ...setting,
      companyId,
      branchId: branchId && branchId !== 'company' ? branchId : null,
      createdBy: req.user.id,
      updatedBy: req.user.id
    }));

    await POSSettings.bulkCreate(settingsArray);
  }

  res.status(200).json({
    status: 'success',
    message: 'تم إعادة تعيين الإعدادات إلى القيم الافتراضية'
  });
});

// دالة مساعدة للحصول على الإعدادات الافتراضية
function getDefaultSettings(category) {
  const defaults = {
    devices: [
      { settingKey: 'autoSync', settingValue: 'true', settingType: 'boolean', description: 'مزامنة تلقائية للأجهزة' },
      { settingKey: 'syncInterval', settingValue: '5', settingType: 'number', description: 'فترة المزامنة (دقائق)' }
    ],
    payment: [
      { settingKey: 'allowMixedPayments', settingValue: 'true', settingType: 'boolean', description: 'السماح بالدفع المختلط' },
      { settingKey: 'maxTransactionAmount', settingValue: '500000', settingType: 'number', description: 'الحد الأقصى للمعاملة' }
    ],
    invoice: [
      { settingKey: 'autoNumbering', settingValue: 'true', settingType: 'boolean', description: 'ترقيم تلقائي' },
      { settingKey: 'numberingFormat', settingValue: 'INV-{YYYY}-{MM}-{NNNN}', settingType: 'string', description: 'تنسيق الترقيم' }
    ],
    security: [
      { settingKey: 'requireLogin', settingValue: 'true', settingType: 'boolean', description: 'طلب تسجيل الدخول' },
      { settingKey: 'sessionTimeout', settingValue: '30', settingType: 'number', description: 'مهلة انتهاء الجلسة' }
    ],
    inventory: [
      { settingKey: 'warnLowStock', settingValue: 'true', settingType: 'boolean', description: 'تحذير المخزون المنخفض' },
      { settingKey: 'lowStockThreshold', settingValue: '10', settingType: 'number', description: 'حد المخزون المنخفض' }
    ],
    notifications: [
      { settingKey: 'enableEmail', settingValue: 'true', settingType: 'boolean', description: 'تفعيل البريد الإلكتروني' },
      { settingKey: 'enableSMS', settingValue: 'false', settingType: 'boolean', description: 'تفعيل الرسائل النصية' }
    ],
    reports: [
      { settingKey: 'defaultFormat', settingValue: 'pdf', settingType: 'string', description: 'تنسيق التقرير الافتراضي' },
      { settingKey: 'autoGenerate', settingValue: 'false', settingType: 'boolean', description: 'إنشاء تلقائي' }
    ]
  };

  return defaults[category] || [];
}

const { Service, Consumables, ServiceConsumables } = require("../Model/index");
const errorLogger = require("../utils/errorLogger");

/**
 * Controller لإدارة ربط الخدمات بالمواد المستهلكة
 */

// GET /api/service-consumables - جلب جميع الروابط
exports.getAll = async (req, res) => {
  try {
    const { serviceId, consumableId } = req.query;
    
    const whereClause = {};
    if (serviceId) whereClause.serviceId = serviceId;
    if (consumableId) whereClause.consumableId = consumableId;
    
    const serviceConsumables = await ServiceConsumables.findAll({
      where: whereClause,
      include: [
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'serviceCode', 'arabicName', 'englishName']
        },
        {
          model: Consumables,
          as: 'consumable',
          attributes: ['id', 'code', 'nameAr', 'nameEn', 'currentStock', 'unitCost']
        }
      ]
    });
    
    res.json({
      success: true,
      data: serviceConsumables
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: 'GET /api/service-consumables'
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب البيانات'
    });
  }
};

// GET /api/service-consumables/service/:serviceId - جلب المواد المستهلكة لخدمة معينة
exports.getByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    
    const service = await Service.findByPk(serviceId, {
      include: [
        {
          model: Consumables,
          as: 'consumables',
          through: {
            attributes: ['id', 'quantity', 'unit', 'isOptional', 'notes', 'isActive']
          }
        }
      ]
    });
    
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'الخدمة غير موجودة'
      });
    }
    
    res.json({
      success: true,
      data: {
        service: {
          id: service.id,
          serviceCode: service.serviceCode,
          arabicName: service.arabicName,
          englishName: service.englishName
        },
        consumables: service.consumables
      }
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: `GET /api/service-consumables/service/${req.params.serviceId}`
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب البيانات'
    });
  }
};

// POST /api/service-consumables - إضافة مادة مستهلكة لخدمة
exports.create = async (req, res) => {
  try {
    const { serviceId, consumableId, quantity, unit, isOptional, notes } = req.body;
    
    if (!serviceId || !consumableId || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'يرجى تحديد الخدمة والمادة والكمية'
      });
    }
    
    // التحقق من وجود الخدمة
    const service = await Service.findByPk(serviceId);
    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'الخدمة غير موجودة'
      });
    }
    
    // التحقق من وجود المادة المستهلكة
    const consumable = await Consumables.findByPk(consumableId);
    if (!consumable) {
      return res.status(404).json({
        success: false,
        message: 'المادة المستهلكة غير موجودة'
      });
    }
    
    // التحقق من عدم وجود الرابط مسبقاً
    const existing = await ServiceConsumables.findOne({
      where: { serviceId, consumableId }
    });
    
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'الرابط موجود مسبقاً'
      });
    }
    
    // إنشاء الرابط
    const serviceConsumable = await ServiceConsumables.create({
      serviceId,
      consumableId,
      quantity: parseFloat(quantity),
      unit: unit || null,
      isOptional: isOptional || false,
      notes: notes || null,
      isActive: true
    });
    
    // جلب الرابط مع العلاقات
    const created = await ServiceConsumables.findByPk(serviceConsumable.id, {
      include: [
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'serviceCode', 'arabicName', 'englishName']
        },
        {
          model: Consumables,
          as: 'consumable',
          attributes: ['id', 'code', 'nameAr', 'nameEn', 'currentStock', 'unitCost']
        }
      ]
    });
    
    errorLogger.logSuccess('تم ربط المادة المستهلكة بالخدمة بنجاح', {
      serviceId,
      consumableId,
      quantity
    });
    
    res.status(201).json({
      success: true,
      message: 'تم الربط بنجاح',
      data: created
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: 'POST /api/service-consumables',
      requestBody: req.body
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء الرابط'
    });
  }
};

// PUT /api/service-consumables/:id - تحديث رابط
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, unit, isOptional, notes, isActive } = req.body;
    
    const serviceConsumable = await ServiceConsumables.findByPk(id);
    
    if (!serviceConsumable) {
      return res.status(404).json({
        success: false,
        message: 'الرابط غير موجود'
      });
    }
    
    await serviceConsumable.update({
      quantity: quantity !== undefined ? parseFloat(quantity) : serviceConsumable.quantity,
      unit: unit !== undefined ? unit : serviceConsumable.unit,
      isOptional: isOptional !== undefined ? isOptional : serviceConsumable.isOptional,
      notes: notes !== undefined ? notes : serviceConsumable.notes,
      isActive: isActive !== undefined ? isActive : serviceConsumable.isActive
    });
    
    const updated = await ServiceConsumables.findByPk(id, {
      include: [
        {
          model: Service,
          as: 'service',
          attributes: ['id', 'serviceCode', 'arabicName', 'englishName']
        },
        {
          model: Consumables,
          as: 'consumable',
          attributes: ['id', 'code', 'nameAr', 'nameEn', 'currentStock', 'unitCost']
        }
      ]
    });
    
    res.json({
      success: true,
      message: 'تم التحديث بنجاح',
      data: updated
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: `PUT /api/service-consumables/${req.params.id}`,
      requestBody: req.body
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في التحديث'
    });
  }
};

// DELETE /api/service-consumables/:id - حذف رابط
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const serviceConsumable = await ServiceConsumables.findByPk(id);
    
    if (!serviceConsumable) {
      return res.status(404).json({
        success: false,
        message: 'الرابط غير موجود'
      });
    }
    
    await serviceConsumable.destroy();
    
    res.json({
      success: true,
      message: 'تم الحذف بنجاح'
    });
  } catch (error) {
    errorLogger.logError(error, {
      endpoint: `DELETE /api/service-consumables/${req.params.id}`
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في الحذف'
    });
  }
};

// POST /api/service-consumables/batch - ربط عدة مواد بخدمة دفعة واحدة
exports.createBatch = async (req, res) => {
  const sequelize = require("../Config/sequelize");
  const transaction = await sequelize.transaction();
  
  try {
    const { serviceId, consumables } = req.body;
    
    if (!serviceId || !consumables || !Array.isArray(consumables) || consumables.length === 0) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'يرجى تحديد الخدمة والمواد'
      });
    }
    
    // التحقق من وجود الخدمة
    const service = await Service.findByPk(serviceId);
    if (!service) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'الخدمة غير موجودة'
      });
    }
    
    const created = [];
    const errors = [];
    
    for (const item of consumables) {
      try {
        // التحقق من وجود المادة
        const consumable = await Consumables.findByPk(item.consumableId);
        if (!consumable) {
          errors.push({
            consumableId: item.consumableId,
            error: 'المادة غير موجودة'
          });
          continue;
        }
        
        // إنشاء أو تحديث الرابط
        const [serviceConsumable, isCreated] = await ServiceConsumables.findOrCreate({
          where: { serviceId, consumableId: item.consumableId },
          defaults: {
            quantity: parseFloat(item.quantity || 1),
            unit: item.unit || null,
            isOptional: item.isOptional || false,
            notes: item.notes || null,
            isActive: true
          },
          transaction
        });
        
        if (!isCreated) {
          // تحديث إذا كان موجوداً
          await serviceConsumable.update({
            quantity: parseFloat(item.quantity || serviceConsumable.quantity),
            unit: item.unit !== undefined ? item.unit : serviceConsumable.unit,
            isOptional: item.isOptional !== undefined ? item.isOptional : serviceConsumable.isOptional,
            notes: item.notes !== undefined ? item.notes : serviceConsumable.notes,
            isActive: true
          }, { transaction });
        }
        
        created.push(serviceConsumable);
      } catch (err) {
        errors.push({
          consumableId: item.consumableId,
          error: err.message
        });
      }
    }
    
    await transaction.commit();
    
    res.status(201).json({
      success: true,
      message: 'تمت العملية بنجاح',
      data: {
        created: created.length,
        errors: errors.length > 0 ? errors : undefined
      }
    });
  } catch (error) {
    await transaction.rollback();
    errorLogger.logError(error, {
      endpoint: 'POST /api/service-consumables/batch',
      requestBody: req.body
    });
    res.status(500).json({
      success: false,
      message: 'خطأ في إنشاء الروابط'
    });
  }
};


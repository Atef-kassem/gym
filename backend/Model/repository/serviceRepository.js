const { Service, Branch, categoriesSchema, ServiceConsumables, Consumables } = require("../index");
const { Op } = require("sequelize");

class ServiceRepository {
  async create(serviceData) {
    const sequelize = require("../../Config/sequelize");
    const transaction = await sequelize.transaction();
    
    try {
      // استخراج المواد المستهلكة من البيانات
      const { consumables, ...serviceDataWithoutConsumables } = serviceData;
      
      // إنشاء الخدمة
      const service = await Service.create(serviceDataWithoutConsumables, { transaction });
      
      // إذا كانت هناك مواد مستهلكة، حفظها في جدول service_consumables
      if (consumables && Array.isArray(consumables) && consumables.length > 0) {
        console.log(`📦 حفظ ${consumables.length} مادة مستهلكة للخدمة ${service.id}`);
        
        for (const consumable of consumables) {
          try {
            await ServiceConsumables.create({
              serviceId: service.id,
              consumableId: parseInt(consumable.itemId),
              quantity: parseFloat(consumable.quantity) || 1,
              unit: consumable.unit || '',
              isOptional: false, // يمكن تعديله لاحقاً ليأتي من Frontend
              notes: consumable.itemName || '',
              isActive: true
            }, { transaction });
            
            console.log(`✅ تم ربط المادة ${consumable.itemName} بالخدمة ${service.arabicName}`);
          } catch (err) {
            console.error(`❌ خطأ في ربط المادة ${consumable.itemId}:`, err.message);
          }
        }
      }
      
      await transaction.commit();
      console.log(`🎉 تم إنشاء الخدمة ${service.arabicName} مع ${consumables?.length || 0} مادة مستهلكة`);
      
      return service;
    } catch (error) {
      await transaction.rollback();
      console.error('❌ خطأ في إنشاء الخدمة:', error);
      throw new Error(`Error creating service: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await Service.findByPk(id, {
        include: [
          { model: Branch, as: "branch" },
          { model: categoriesSchema, as: "category" },
          {
            model: Consumables,
            as: "consumables",
            through: {
              attributes: ['id', 'quantity', 'unit', 'isOptional', 'notes', 'isActive']
            }
          }
        ],
      });
    } catch (error) {
      throw new Error(`Error finding service: ${error.message}`);
    }
  }

  async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        branchId,
        categoryId,
        isActive,
        search,
        sortBy = "id",
        sortOrder = "DESC",
      } = options;

      const offset = (page - 1) * limit;
      const whereClause = {};

      if (branchId) whereClause.branchId = branchId;
      if (categoryId) whereClause.categoryId = categoryId;
      if (isActive !== undefined) whereClause.isActive = isActive;
      if (search) {
        whereClause[Op.or] = [
          { arabicName: { [Op.like]: `%${search}%` } },
          { englishName: { [Op.like]: `%${search}%` } },
          { serviceCode: { [Op.like]: `%${search}%` } },
        ];
      }

      // First, try to get the basic structure without includes
      let queryOptions = {
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      };

      // Only add includes if the basic query works
      try {
        const { count, rows } = await Service.findAndCountAll({
          ...queryOptions,
          include: [
            { model: Branch, as: "branch" },
            { model: categoriesSchema, as: "category" },
            {
              model: Consumables,
              as: "consumables",
              through: {
                attributes: ['id', 'quantity', 'unit', 'isOptional', 'notes', 'isActive'],
                where: { isActive: true }
              },
              required: false
            }
          ],
        });

        return {
          services: rows,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit),
          },
        };
      } catch (includeError) {
        console.log("Include failed, trying without includes:", includeError.message);
        
        // Fallback to basic query without includes
        const { count, rows } = await Service.findAndCountAll(queryOptions);
        
        return {
          services: rows,
          pagination: {
            total: count,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(count / limit),
          },
        };
      }
    } catch (error) {
      console.error("ServiceRepository.findAll error:", error);
      throw new Error(`Error finding services: ${error.message}`);
    }
  }

  async update(id, updateData) {
    const sequelize = require("../../Config/sequelize");
    const transaction = await sequelize.transaction();
    
    try {
      // استخراج المواد المستهلكة من البيانات
      const { consumables, ...serviceDataWithoutConsumables } = updateData;
      
      // تحديث الخدمة
      const [updatedRows] = await Service.update(serviceDataWithoutConsumables, {
        where: { id },
        transaction
      });

      if (updatedRows === 0) {
        await transaction.rollback();
        return null;
      }

      // تحديث المواد المستهلكة
      if (consumables !== undefined) {
        // حذف المواد القديمة
        await ServiceConsumables.destroy({
          where: { serviceId: id },
          transaction
        });
        
        // إضافة المواد الجديدة
        if (Array.isArray(consumables) && consumables.length > 0) {
          console.log(`📦 تحديث ${consumables.length} مادة مستهلكة للخدمة ${id}`);
          
          for (const consumable of consumables) {
            try {
              await ServiceConsumables.create({
                serviceId: id,
                consumableId: parseInt(consumable.itemId),
                quantity: parseFloat(consumable.quantity) || 1,
                unit: consumable.unit || '',
                isOptional: false,
                notes: consumable.itemName || '',
                isActive: true
              }, { transaction });
              
              console.log(`✅ تم ربط المادة ${consumable.itemName} بالخدمة ${id}`);
            } catch (err) {
              console.error(`❌ خطأ في ربط المادة ${consumable.itemId}:`, err.message);
            }
          }
        }
      }
      
      await transaction.commit();
      console.log(`🎉 تم تحديث الخدمة ${id} مع ${consumables?.length || 0} مادة مستهلكة`);
      
      return await this.findById(id);
    } catch (error) {
      await transaction.rollback();
      console.error('❌ خطأ في تحديث الخدمة:', error);
      throw new Error(`Error updating service: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const deletedRows = await Service.destroy({
        where: { id },
      });
      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting service: ${error.message}`);
    }
  }

  async findByBranch(branchId) {
    try {
      return await Service.findAll({
        where: { branchId, isActive: true },
        include: [
          { model: Branch, as: "branch" },
          { model: categoriesSchema, as: "category" },
          {
            model: Consumables,
            as: "consumables",
            through: {
              attributes: ['id', 'quantity', 'unit', 'isOptional', 'notes', 'isActive'],
              where: { isActive: true }
            },
            required: false
          }
        ],
        order: [["arabicName", "ASC"]],
      });
    } catch (error) {
      throw new Error(`Error finding services by branch: ${error.message}`);
    }
  }

  async findActiveServices(options = {}) {
    try {
      const { branchId, categoryId } = options;
      const whereClause = { isActive: true, serviceStatus: "active" };

      if (branchId) whereClause.branchId = branchId;
      if (categoryId) whereClause.categoryId = categoryId;

      // Try with includes first, fallback to basic query if it fails
      try {
        return await Service.findAll({
          where: whereClause,
          include: [
            { model: Branch, as: "branch" },
            { model: categoriesSchema, as: "category" },
            {
              model: Consumables,
              as: "consumables",
              through: {
                attributes: ['id', 'quantity', 'unit', 'isOptional', 'notes', 'isActive'],
                where: { isActive: true }
              },
              required: false // LEFT JOIN - جلب الخدمة حتى لو لم يكن لها مواد مستهلكة
            }
          ],
          order: [["arabicName", "ASC"]],
        });
      } catch (includeError) {
        console.log("Include failed in findActiveServices, trying without includes:", includeError.message);
        
        // Fallback to basic query without includes
        return await Service.findAll({
          where: whereClause,
          order: [["arabicName", "ASC"]],
        });
      }
    } catch (error) {
      console.error("ServiceRepository.findActiveServices error:", error);
      throw new Error(`Error finding active services: ${error.message}`);
    }
  }

  async calculatePriceWithTax(serviceId) {
    try {
      const service = await this.findById(serviceId);
      if (!service) {
        throw new Error("Service not found");
      }

      let finalPrice = parseFloat(service.price);

      if (service.discountType && service.discountValue > 0) {
        if (service.discountType === "percentage") {
          finalPrice = finalPrice - finalPrice * (service.discountValue / 100);
        } else if (service.discountType === "fixed") {
          finalPrice = finalPrice - service.discountValue;
        }
      }

      if (service.taxType === "with_vat" && service.taxRate > 0) {
        const taxAmount = finalPrice * (service.taxRate / 100);
        finalPrice = finalPrice + taxAmount;
      }

      return {
        basePrice: parseFloat(service.price),
        discountAmount: service.discountValue || 0,
        taxAmount: service.taxType === "with_vat" ? finalPrice - finalPrice / (1 + service.taxRate / 100) : 0,
        finalPrice: Math.max(finalPrice, service.minimumPrice || 0),
      };
    } catch (error) {
      throw new Error(`Error calculating service price: ${error.message}`);
    }
  }
}

module.exports = new ServiceRepository();

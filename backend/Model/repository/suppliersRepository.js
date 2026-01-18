const { Op } = require("sequelize");
const { suppliersSchema } = require("../index");

class SuppliersRepository {
  async create(supplierData) {
    try {
      const supplier = await suppliersSchema.create(supplierData);
      return supplier;
    } catch (error) {
      throw new Error(`Error creating supplier: ${error.message}`);
    }
  }

  async findById(supplierId) {
    try {
      const supplier = await suppliersSchema.findByPk(supplierId, {
        // include: [{ model: require("../index").productsSchema, as: "products" }],
      });
      return supplier;
    } catch (error) {
      throw new Error(`Error finding supplier: ${error.message}`);
    }
  }

  async findAll(options = {}) {
    try {
      const { page = 1, limit = 10, search = "", isActive, sortBy = "name_en", sortOrder = "ASC" } = options;

      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [{ name_ar: { [Op.like]: `%${search}%` } }, { name_en: { [Op.like]: `%${search}%` } }];
      }

      if (isActive !== undefined) {
        whereClause.is_active = isActive;
      }

      // إذا كان limit بدون page، استخدم findAll بدلاً من findAndCountAll
      if (!page || page === 1) {
        console.log("Repository: Using findAll with limit:", limit, "where:", whereClause);
        
        const rows = await suppliersSchema.findAll({
          where: whereClause,
          order: [[sortBy, sortOrder]],
          limit: parseInt(limit),
        });

        console.log("Repository: Found rows:", rows.length);
        console.log("Repository: Rows type:", typeof rows);
        console.log("Repository: Is array:", Array.isArray(rows));

        // تأكد من أن rows مصفوفة
        if (!Array.isArray(rows)) {
          console.error("Repository: Rows is not an array:", rows);
          throw new Error("Invalid data structure returned from database");
        }

        return {
          suppliers: rows,
          pagination: {
            total: rows.length,
            page: 1,
            limit: parseInt(limit),
            totalPages: 1,
          },
        };
      }

      // إذا كان page موجود، استخدم findAndCountAll مع offset
      const offset = (page - 1) * limit;
      const { count, rows } = await suppliersSchema.findAndCountAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        suppliers: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding suppliers: ${error.message}`);
    }
  }

  async update(supplierId, updateData) {
    try {
      const [updatedRows] = await suppliersSchema.update(updateData, {
        where: { supplier_id: supplierId },
      });

      if (updatedRows === 0) {
        return null;
      }

      return await this.findById(supplierId);
    } catch (error) {
      throw new Error(`Error updating supplier: ${error.message}`);
    }
  }

  async delete(supplierId) {
    try {
      const deletedRows = await suppliersSchema.destroy({
        where: { supplier_id: supplierId },
      });
      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting supplier: ${error.message}`);
    }
  }

  async exists(supplierId) {
    try {
      const count = await suppliersSchema.count({
        where: { supplier_id: supplierId },
      });
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking supplier existence: ${error.message}`);
    }
  }

  async findByName(name, language = "en") {
    try {
      const field = language === "ar" ? "name_ar" : "name_en";
      return await suppliersSchema.findOne({
        where: { [field]: name },
        // include: [{ model: require("../index").productsSchema, as: "products" }],
      });
    } catch (error) {
      throw new Error(`Error finding supplier by name: ${error.message}`);
    }
  }

  async getActiveSuppliers() {
    try {
      return await suppliersSchema.findAll({
        where: { is_active: true },
        order: [["name_en", "ASC"]],
      });
    } catch (error) {
      throw new Error(`Error finding active suppliers: ${error.message}`);
    }
  }

  // إضافة دالة count عامة
  async count(options = {}) {
    try {
      const { where = {} } = options;
      
      // تحويل isActive إلى is_active إذا كان موجوداً
      if (where.isActive !== undefined) {
        where.is_active = where.isActive;
        delete where.isActive;
      }
      
      return await suppliersSchema.count({ where });
    } catch (error) {
      throw new Error(`Error counting suppliers: ${error.message}`);
    }
  }

  // إضافة دالة findTopSuppliers خاصة
  async findTopSuppliers(limit = 10) {
    try {
      console.log("Repository: Finding top suppliers with limit:", limit);
      
      // جلب جميع الموردين النشطين أولاً
      const allSuppliers = await suppliersSchema.findAll({
        where: { is_active: true }
      });
      
      console.log("Repository: All active suppliers found:", allSuppliers.length);
      
      // ترتيب حسب تاريخ الإنشاء وتطبيق الحد
      const sortedSuppliers = allSuppliers
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, parseInt(limit));
      
      console.log("Repository: Sorted and limited suppliers:", sortedSuppliers.length);
      console.log("Repository: First supplier:", sortedSuppliers[0]);
      
      return sortedSuppliers;
    } catch (error) {
      console.error("Repository error:", error);
      console.error("Repository error stack:", error.stack);
      
      // إذا كان الخطأ يتعلق بعدم وجود جدول، أعد مصفوفة فارغة
      if (error.message.includes('doesn\'t exist') || error.message.includes('table')) {
        console.log("Repository: Table doesn't exist, returning empty array");
        return [];
      }
      
      throw new Error(`Error finding top suppliers: ${error.message}`);
    }
  }
}

module.exports = new SuppliersRepository();

const { Op } = require("sequelize");
const { brandsSchema } = require("../index");

class BrandsRepository {
  async create(brandData) {
    try {
      const brand = await brandsSchema.create(brandData);
      return brand;
    } catch (error) {
      throw new Error(`Error creating brand: ${error.message}`);
    }
  }

  async findById(brandId) {
    try {
      const brand = await brandsSchema.findByPk(brandId, {
        include: [{ model: require("../index").productsSchema, as: "products" }],
      });
      return brand;
    } catch (error) {
      throw new Error(`Error finding brand: ${error.message}`);
    }
  }

  async findAll(options = {}) {
    try {
      const { page = 1, limit = 10, search = "", isActive, sortBy = "name_en", sortOrder = "ASC" } = options;

      const offset = (page - 1) * limit;
      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [{ name_ar: { [Op.like]: `%${search}%` } }, { name_en: { [Op.like]: `%${search}%` } }];
      }

      if (isActive !== undefined) {
        whereClause.is_active = isActive;
      }

      const { count, rows } = await brandsSchema.findAndCountAll({
        where: whereClause,
        include: [{ model: require("../index").productsSchema, as: "products" }],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        brands: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding brands: ${error.message}`);
    }
  }

  async update(brandId, updateData) {
    try {
      const [updatedRows] = await brandsSchema.update(updateData, {
        where: { brand_id: brandId },
      });

      if (updatedRows === 0) {
        return null;
      }

      return await this.findById(brandId);
    } catch (error) {
      throw new Error(`Error updating brand: ${error.message}`);
    }
  }

  async delete(brandId) {
    try {
      const deletedRows = await brandsSchema.destroy({
        where: { brand_id: brandId },
      });

      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting brand: ${error.message}`);
    }
  }

  async exists(brandId) {
    try {
      const count = await brandsSchema.count({
        where: { brand_id: brandId },
      });
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking brand existence: ${error.message}`);
    }
  }

  async findByName(name, language = "en") {
    try {
      const field = language === "ar" ? "name_ar" : "name_en";
      return await brandsSchema.findOne({
        where: { [field]: name },
        include: [{ model: require("../index").productsSchema, as: "products" }],
      });
    } catch (error) {
      throw new Error(`Error finding brand by name: ${error.message}`);
    }
  }

  async getActiveBrands() {
    try {
      return await brandsSchema.findAll({
        where: { is_active: true },
        order: [["name_en", "ASC"]],
      });
    } catch (error) {
      throw new Error(`Error finding active brands: ${error.message}`);
    }
  }
}

module.exports = new BrandsRepository();

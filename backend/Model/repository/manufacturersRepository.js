const { Op } = require("sequelize");
const { manufacturersSchema } = require("../index");

class ManufacturersRepository {
  async create(manufacturerData) {
    try {
      const manufacturer = await manufacturersSchema.create(manufacturerData);
      return manufacturer;
    } catch (error) {
      throw new Error(`Error creating manufacturer: ${error.message}`);
    }
  }

  async findById(manufacturerId) {
    try {
      const manufacturer = await manufacturersSchema.findByPk(manufacturerId, {
        // include: [{ model: require("../index").productsSchema, as: "products" }],
      });
      return manufacturer;
    } catch (error) {
      throw new Error(`Error finding manufacturer: ${error.message}`);
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

      const { count, rows } = await manufacturersSchema.findAndCountAll({
        where: whereClause,
        // include: [{ model: require("../index").productsSchema, as: "products" }],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        manufacturers: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding manufacturers: ${error.message}`);
    }
  }

  async update(manufacturerId, updateData) {
    try {
      const [updatedRows] = await manufacturersSchema.update(updateData, {
        where: { manufacturer_id: manufacturerId },
      });

      if (updatedRows === 0) {
        return null;
      }

      return await this.findById(manufacturerId);
    } catch (error) {
      throw new Error(`Error updating manufacturer: ${error.message}`);
    }
  }

  async delete(manufacturerId) {
    try {
      const deletedRows = await manufacturersSchema.destroy({
        where: { manufacturer_id: manufacturerId },
      });
      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting manufacturer: ${error.message}`);
    }
  }

  async exists(manufacturerId) {
    try {
      const count = await manufacturersSchema.count({
        where: { manufacturer_id: manufacturerId },
      });
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking manufacturer existence: ${error.message}`);
    }
  }

  async findByName(name, language = "en") {
    try {
      const field = language === "ar" ? "name_ar" : "name_en";
      return await manufacturersSchema.findOne({
        where: { [field]: name },
        // include: [{ model: require("../index").productsSchema, as: "products" }],
      });
    } catch (error) {
      throw new Error(`Error finding manufacturer by name: ${error.message}`);
    }
  }

  async getActiveManufacturers() {
    try {
      return await manufacturersSchema.findAll({
        where: { is_active: true },
        order: [["name_en", "ASC"]],
      });
    } catch (error) {
      throw new Error(`Error finding active manufacturers: ${error.message}`);
    }
  }
}

module.exports = new ManufacturersRepository();

const { Op } = require("sequelize");
const sequelize = require("../../Config/sequelize");
const SupplierCategory = require("../schema/supplierCategorySchema");

class SupplierCategoryRepository {
  async create(categoryData) {
    try {
      const category = await SupplierCategory.create(categoryData);
      return category;
    } catch (error) {
      throw new Error(`Error creating supplier category: ${error.message}`);
    }
  }

  async findAll(filters = {}) {
    try {
      const whereClause = {};

      if (filters.active !== undefined) {
        whereClause.active = filters.active;
      }

      if (filters.searchTerm) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${filters.searchTerm}%` } },
          { description: { [Op.like]: `%${filters.searchTerm}%` } },
        ];
      }

      const categories = await SupplierCategory.findAll({
        where: whereClause,
        order: [["created_at", "DESC"]],
      });

      return categories;
    } catch (error) {
      throw new Error(`Error fetching supplier categories: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const category = await SupplierCategory.findByPk(id);

      if (!category) {
        throw new Error("Supplier category not found");
      }

      return category;
    } catch (error) {
      throw new Error(`Error fetching supplier category: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const [updatedRows] = await SupplierCategory.update(updateData, {
        where: { id },
      });

      if (updatedRows === 0) {
        throw new Error("Supplier category not found");
      }

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating supplier category: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const deletedRows = await SupplierCategory.destroy({
        where: { id },
      });

      if (deletedRows === 0) {
        throw new Error("Supplier category not found");
      }

      return true;
    } catch (error) {
      throw new Error(`Error deleting supplier category: ${error.message}`);
    }
  }

  async toggleStatus(id) {
    try {
      const category = await this.findById(id);
      const newStatus = !category.active;
      
      return await this.update(id, { active: newStatus });
    } catch (error) {
      throw new Error(`Error toggling supplier category status: ${error.message}`);
    }
  }

  async getActiveCategories() {
    try {
      const categories = await SupplierCategory.findAll({
        where: { active: true },
        order: [["name", "ASC"]],
      });

      return categories;
    } catch (error) {
      throw new Error(`Error fetching active supplier categories: ${error.message}`);
    }
  }

  async getStatistics() {
    try {
      const stats = await SupplierCategory.findAll({
        attributes: [
          [sequelize.fn("COUNT", sequelize.col("id")), "totalCategories"],
          [
            sequelize.fn("SUM", sequelize.literal("CASE WHEN active = true THEN 1 ELSE 0 END")),
            "activeCategories",
          ],
          [
            sequelize.fn("SUM", sequelize.literal("CASE WHEN active = false THEN 1 ELSE 0 END")),
            "inactiveCategories",
          ],
        ],
        raw: true,
      });

      return stats[0];
    } catch (error) {
      throw new Error(`Error fetching supplier category statistics: ${error.message}`);
    }
  }
}

module.exports = new SupplierCategoryRepository();

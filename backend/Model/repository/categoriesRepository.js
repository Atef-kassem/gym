const { Op } = require("sequelize");
const { categoriesSchema } = require("../index");

class CategoriesRepository {
  async create(categoryData) {
    try {
      const category = await categoriesSchema.create(categoryData);
      return category;
    } catch (error) {
      throw new Error(`Error creating category: ${error.message}`);
    }
  }

  async findById(categoryId) {
    try {
      const category = await categoriesSchema.findByPk(categoryId, {
        include: [
          { model: categoriesSchema, as: "parentCategory" },
          { model: categoriesSchema, as: "subcategories" },
          { model: require("../index").productsSchema, as: "products" },
        ],
      });
      return category;
    } catch (error) {
      throw new Error(`Error finding category: ${error.message}`);
    }
  }

  async findAll(options = {}) {
    try {
      const { page = 1, limit = 10, search = "", parentId, isActive, sortBy = "name_en", sortOrder = "ASC" } = options;

      const offset = (page - 1) * limit;
      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [{ name_ar: { [Op.like]: `%${search}%` } }, { name_en: { [Op.like]: `%${search}%` } }];
      }

      if (parentId !== undefined) {
        whereClause.parent_category_id = parentId;
      }

      if (isActive !== undefined) {
        whereClause.is_active = isActive;
      }

      const { count, rows } = await categoriesSchema.findAndCountAll({
        where: whereClause,
        include: [
          { model: categoriesSchema, as: "parentCategory" },
          { model: categoriesSchema, as: "subcategories" },
          { model: require("../index").productsSchema, as: "products" },
        ],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        categories: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding categories: ${error.message}`);
    }
  }

  async findRootCategories() {
    try {
      return await categoriesSchema.findAll({
        where: { parent_category_id: null },
        include: [
          { model: categoriesSchema, as: "subcategories" },
          { model: require("../index").productsSchema, as: "products" },
        ],
        order: [["name_en", "ASC"]],
      });
    } catch (error) {
      throw new Error(`Error finding root categories: ${error.message}`);
    }
  }

  async findChildren(parentId) {
    try {
      return await categoriesSchema.findAll({
        where: { parent_category_id: parentId },
        include: [
          { model: categoriesSchema, as: "subcategories" },
          { model: require("../index").productsSchema, as: "products" },
        ],
        order: [["name_en", "ASC"]],
      });
    } catch (error) {
      throw new Error(`Error finding child categories: ${error.message}`);
    }
  }

  async update(categoryId, updateData) {
    try {
      const [updatedRows] = await categoriesSchema.update(updateData, {
        where: { category_id: categoryId },
      });

      if (updatedRows === 0) {
        return null;
      }

      return await this.findById(categoryId);
    } catch (error) {
      throw new Error(`Error updating category: ${error.message}`);
    }
  }

  async delete(categoryId) {
    try {
      const deletedRows = await categoriesSchema.destroy({
        where: { category_id: categoryId },
      });

      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting category: ${error.message}`);
    }
  }

  async exists(categoryId) {
    try {
      const count = await categoriesSchema.count({
        where: { category_id: categoryId },
      });
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking category existence: ${error.message}`);
    }
  }

  async findByName(name, language = "en") {
    try {
      const field = language === "ar" ? "name_ar" : "name_en";
      return await categoriesSchema.findOne({
        where: { [field]: name },
        include: [
          { model: categoriesSchema, as: "parentCategory" },
          { model: categoriesSchema, as: "subcategories" },
          { model: require("../index").productsSchema, as: "products" },
        ],
      });
    } catch (error) {
      throw new Error(`Error finding category by name: ${error.message}`);
    }
  }

  async getActiveCategories() {
    try {
      return await categoriesSchema.findAll({
        where: { is_active: true },
        order: [["name_en", "ASC"]],
      });
    } catch (error) {
      throw new Error(`Error finding active categories: ${error.message}`);
    }
  }
}

module.exports = new CategoriesRepository();

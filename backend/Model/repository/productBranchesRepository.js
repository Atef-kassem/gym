const { Op } = require("sequelize");
const { productBranchesSchema } = require("../index");

class ProductBranchesRepository {
  async create(productBranchData) {
    try {
      const productBranch = await productBranchesSchema.create(productBranchData);
      return productBranch;
    } catch (error) {
      throw new Error(`Error creating product branch: ${error.message}`);
    }
  }

  async findById(productId, branchId) {
    try {
      return await productBranchesSchema.findOne({
        where: { product_id: productId, branch_id: branchId },
        include: [
          { model: require("../index").productsSchema, as: "product" },
          { model: require("../index").Branch, as: "branch" },
        ],
      });
    } catch (error) {
      throw new Error(`Error finding product branch: ${error.message}`);
    }
  }

  async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        productId,
        branchId,
        lowStock = false,
        sortBy = "last_updated",
        sortOrder = "DESC",
      } = options;

      const offset = (page - 1) * limit;
      const whereClause = {};

      if (productId) whereClause.product_id = productId;
      if (branchId) whereClause.branch_id = branchId;
      if (lowStock) whereClause.stock_quantity = { [Op.lte]: 10 };

      const { count, rows } = await productBranchesSchema.findAndCountAll({
        where: whereClause,
        include: [
          { model: require("../index").productsSchema, as: "product" },
          { model: require("../index").Branch, as: "branch" },
        ],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        productBranches: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding product branches: ${error.message}`);
    }
  }

  async update(productId, branchId, updateData) {
    try {
      const [updatedRows] = await productBranchesSchema.update(updateData, {
        where: { product_id: productId, branch_id: branchId },
      });

      if (updatedRows === 0) {
        return null;
      }

      return await this.findById(productId, branchId);
    } catch (error) {
      throw new Error(`Error updating product branch: ${error.message}`);
    }
  }

  async delete(productId, branchId) {
    try {
      const deletedRows = await productBranchesSchema.destroy({
        where: { product_id: productId, branch_id: branchId },
      });
      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting product branch: ${error.message}`);
    }
  }

  async exists(productId, branchId) {
    try {
      const count = await productBranchesSchema.count({
        where: { product_id: productId, branch_id: branchId },
      });
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking product branch existence: ${error.message}`);
    }
  }

  async updateStock(productId, branchId, quantity, operation = "add") {
    try {
      const productBranch = await this.findById(productId, branchId);

      if (!productBranch) {
        throw new Error("Product branch record not found");
      }

      const newStock =
        operation === "add" ? productBranch.stock_quantity + quantity : productBranch.stock_quantity - quantity;

      if (newStock < 0) {
        throw new Error("Insufficient stock");
      }

      return await this.update(productId, branchId, {
        stock_quantity: newStock,
        last_updated: new Date(),
      });
    } catch (error) {
      throw new Error(`Error updating stock: ${error.message}`);
    }
  }

  async getProductsByBranch(branchId) {
    try {
      return await productBranchesSchema.findAll({
        where: { branch_id: branchId },
        include: [
          { model: require("../index").productsSchema, as: "product" },
          { model: require("../index").Branch, as: "branch" },
        ],
        order: [["stock_quantity", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding products by branch: ${error.message}`);
    }
  }

  async getBranchesByProduct(productId) {
    try {
      return await productBranchesSchema.findAll({
        where: { product_id: productId },
        include: [
          { model: require("../index").productsSchema, as: "product" },
          { model: require("../index").Branch, as: "branch" },
        ],
        order: [["stock_quantity", "DESC"]],
      });
    } catch (error) {
      throw new Error(`Error finding branches by product: ${error.message}`);
    }
  }

  async getLowStockItems(branchId = null, threshold = 10) {
    try {
      const whereClause = { stock_quantity: { [Op.lte]: threshold } };
      if (branchId) whereClause.branch_id = branchId;

      return await productBranchesSchema.findAll({
        where: whereClause,
        include: [
          { model: require("../index").productsSchema, as: "product" },
          { model: require("../index").Branch, as: "branch" },
        ],
        order: [["stock_quantity", "ASC"]],
      });
    } catch (error) {
      throw new Error(`Error finding low stock items: ${error.message}`);
    }
  }
}

module.exports = new ProductBranchesRepository();

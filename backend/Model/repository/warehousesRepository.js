const { Op } = require("sequelize");
const { warehousesSchema } = require("../index");

class WarehousesRepository {
  async create(warehouseData) {
    try {
      const warehouse = await warehousesSchema.create(warehouseData);
      return warehouse;
    } catch (error) {
      throw new Error(`Error creating warehouse: ${error.message}`);
    }
  }

  async findById(warehouseId) {
    try {
      const warehouse = await warehousesSchema.findByPk(warehouseId, {
        include: [
          { model: require("../index").inventorySchema, as: "inventories" },
          { model: require("../index").Branch, as: "branch" },
        ],
      });
      return warehouse;
    } catch (error) {
      throw new Error(`Error finding warehouse: ${error.message}`);
    }
  }

  async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        branchId,
        type,
        isActive,
        sortBy = "name_en",
        sortOrder = "ASC",
      } = options;

      const offset = (page - 1) * limit;
      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [
          { name_ar: { [Op.like]: `%${search}%` } },
          { name_en: { [Op.like]: `%${search}%` } },
          { warehouse_code: { [Op.like]: `%${search}%` } },
        ];
      }

      if (branchId) whereClause.branch_id = branchId;
      if (type) whereClause.type = type;
      if (isActive !== undefined) whereClause.status = isActive ? "active" : "inactive";

      const { count, rows } = await warehousesSchema.findAndCountAll({
        where: whereClause,
        include: [
          { model: require("../index").inventorySchema, as: "inventories" },
          { model: require("../index").Branch, as: "branch" },
        ],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        warehouses: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding warehouses: ${error.message}`);
    }
  }

  async update(warehouseId, updateData) {
    try {
      const [updatedRows] = await warehousesSchema.update(updateData, {
        where: { warehouse_id: warehouseId },
      });
      return updatedRows > 0 ? await this.findById(warehouseId) : null;
    } catch (error) {
      throw new Error(`Error updating warehouse: ${error.message}`);
    }
  }

  async delete(warehouseId) {
    try {
      const deletedRows = await warehousesSchema.destroy({
        where: { warehouse_id: warehouseId },
      });
      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting warehouse: ${error.message}`);
    }
  }

  async exists(warehouseId) {
    try {
      const count = await warehousesSchema.count({
        where: { warehouse_id: warehouseId },
      });
      return count > 0;
    } catch (error) {
      throw new Error(`Error checking warehouse existence: ${error.message}`);
    }
  }

  async findByCode(warehouseCode) {
    try {
      return await warehousesSchema.findOne({
        where: { warehouse_code: warehouseCode },
        include: [
          { model: require("../index").inventorySchema, as: "inventories" },
          { model: require("../index").Branch, as: "branch" },
        ],
      });
    } catch (error) {
      throw new Error(`Error finding warehouse by code: ${error.message}`);
    }
  }

  async getWarehousesByBranch(branchId) {
    try {
      return await warehousesSchema.findAll({
        where: { branch_id: branchId },
        include: [
          { model: require("../index").inventorySchema, as: "inventories" },
          { model: require("../index").Branch, as: "branch" },
        ],
        order: [["name_en", "ASC"]],
      });
    } catch (error) {
      throw new Error(`Error finding warehouses by branch: ${error.message}`);
    }
  }

  async getActiveWarehouses() {
    try {
      return await warehousesSchema.findAll({
        where: { status: "active" },
        order: [["name_en", "ASC"]],
      });
    } catch (error) {
      throw new Error(`Error finding active warehouses: ${error.message}`);
    }
  }
}

module.exports = new WarehousesRepository();

const { Op } = require("sequelize");
const { inventorySchema, productsSchema, warehousesSchema } = require("../index");

class InventoryRepository {
  async create(inventoryData) {
    try {
      const inventory = await inventorySchema.create(inventoryData);
      return await this.findById(inventory.inventory_id);
    } catch (error) {
      throw new Error(`Error creating inventory: ${error.message}`);
    }
  }

  async findById(inventoryId) {
    try {
      const inventory = await inventorySchema.findByPk(inventoryId, {
        include: [
          { model: productsSchema, as: "product" },
          { model: warehousesSchema, as: "warehouse" },
        ],
      });
      return inventory;
    } catch (error) {
      throw new Error(`Error finding inventory: ${error.message}`);
    }
  }

  async findByProductAndWarehouse(productId, warehouseId) {
    try {
      const inventory = await inventorySchema.findOne({
        where: { product_id: productId, warehouse_id: warehouseId },
        include: [
          { model: productsSchema, as: "product" },
          { model: warehousesSchema, as: "warehouse" },
        ],
      });
      return inventory;
    } catch (error) {
      throw new Error(`Error finding inventory: ${error.message}`);
    }
  }

  async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        productId,
        warehouseId,
        lowStock = false,
        sortBy = "last_updated",
        sortOrder = "DESC",
      } = options;

      const offset = (page - 1) * limit;
      const whereClause = {};

      if (productId) {
        whereClause.product_id = productId;
      }

      if (warehouseId) {
        whereClause.warehouse_id = warehouseId;
      }

      if (lowStock) {
        whereClause.current_stock = {
          [Op.lte]: Sequelize.col("reorder_point"),
        };
      }

      const { count, rows } = await inventorySchema.findAndCountAll({
        where: whereClause,
        include: [
          { model: productsSchema, as: "product" },
          { model: warehousesSchema, as: "warehouse" },
        ],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        inventory: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`Error finding inventory: ${error.message}`);
    }
  }

  async updateStock(productId, warehouseId, quantity) {
    try {
      let inventory = await this.findByProductAndWarehouse(productId, warehouseId);

      // إذا لم يكن السجل موجوداً، ننشئه تلقائياً
      if (!inventory) {
        console.log(`⚠️ السجل غير موجود - سيتم إنشاؤه: منتج ${productId} في مستودع ${warehouseId}`);
        
        // تأكد من أن الكمية موجبة عند الإنشاء
        if (quantity < 0) {
          throw new Error("Cannot create inventory with negative stock");
        }
        
        inventory = await this.create({
          inventory_id: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          product_id: productId,
          warehouse_id: warehouseId,
          current_stock: quantity,
          reorder_point: 0,
          max_stock: 9999999,
          last_updated: new Date()
        });
        
        return inventory;
      }

      const newStock = inventory.current_stock + quantity;

      if (newStock < 0) {
        throw new Error("Insufficient stock");
      }

      await inventorySchema.update({
        current_stock: newStock,
        last_updated: new Date(),
      }, {
        where: {
          inventory_id: inventory.inventory_id
        }
      });

      return await this.findByProductAndWarehouse(productId, warehouseId);
    } catch (error) {
      throw new Error(`Error updating stock: ${error.message}`);
    }
  }

  async setStock(productId, warehouseId, newStock) {
    try {
      let inventory = await this.findByProductAndWarehouse(productId, warehouseId);

      if (!inventory) {
        inventory = await this.create({
          product_id: productId,
          warehouse_id: warehouseId,
          current_stock: newStock,
        });
      } else {
        await inventorySchema.update({
          current_stock: newStock,
          last_updated: new Date(),
        });
      }

      return inventory;
    } catch (error) {
      throw new Error(`Error setting stock: ${error.message}`);
    }
  }

  async updateSettings(productId, warehouseId, settings) {
    try {
      const inventory = await this.findByProductAndWarehouse(productId, warehouseId);

      if (!inventory) {
        throw new Error("Inventory record not found");
      }

      await inventorySchema.update(settings);
      return inventory;
    } catch (error) {
      throw new Error(`Error updating inventory settings: ${error.message}`);
    }
  }

  async getLowStockAlerts(warehouseId = null) {
    try {
      const whereClause = {
        current_stock: {
          [Op.lte]: Sequelize.col("reorder_point"),
        },
      };

      if (warehouseId) {
        whereClause.warehouse_id = warehouseId;
      }

      const alerts = await inventorySchema.findAll({
        where: whereClause,
        include: [
          { model: productsSchema, as: "product" },
          { model: warehousesSchema, as: "warehouse" },
        ],
        order: [["current_stock", "ASC"]],
      });

      return alerts;
    } catch (error) {
      throw new Error(`Error getting low stock alerts: ${error.message}`);
    }
  }

  async getStockLevelsByWarehouse(warehouseId) {
    try {
      const stockLevels = await inventorySchema.findAll({
        where: { warehouse_id: warehouseId },
        include: [{ model: productsSchema, as: "product" }],
        order: [["current_stock", "DESC"]],
      });
      return stockLevels;
    } catch (error) {
      throw new Error(`Error getting stock levels: ${error.message}`);
    }
  }

  async delete(inventoryId) {
    try {
      const deletedRows = await inventorySchema.destroy({
        where: { inventory_id: inventoryId },
      });
      return deletedRows > 0;
    } catch (error) {
      throw new Error(`Error deleting inventory: ${error.message}`);
    }
  }
}

module.exports = new InventoryRepository();

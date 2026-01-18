const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const InventoryRepository = require("../Model/repository/inventoryRepository");

class InventoryController {
  async create(req, res) {
    try {
      const inventoryData = req.body;
      const inventory = await InventoryRepository.create(inventoryData);
      return res.status(201).json({
        success: true,
        data: inventory,
        message: "Inventory created successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getById(req, res) {
    try {
      const { inventoryId } = req.params;
      const inventory = await InventoryRepository.findById(inventoryId);

      if (!inventory) {
        return res.status(404).json({
          success: false,
          error: "Inventory not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getByProductAndWarehouse(req, res) {
    try {
      const { productId, warehouseId } = req.params;
      const inventory = await InventoryRepository.findByProductAndWarehouse(productId, warehouseId);

      if (!inventory) {
        return res.status(404).json({
          success: false,
          error: "Inventory not found",
        });
      }

      return res.status(200).json({
        success: true,
        data: inventory,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getAll(req, res) {
    try {
      const options = req.query;
      const result = await InventoryRepository.findAll(options);
      return res.status(200).json({
        success: true,
        data: result.inventory,
        pagination: result.pagination,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateStock(req, res) {
    try {
      const { productId, warehouseId } = req.params;
      const { quantity, operation_type = "add", notes } = req.body;
      
      let inventory;
      
      if (operation_type === "set") {
        // تعيين كمية جديدة
        inventory = await InventoryRepository.setStock(productId, warehouseId, quantity);
      } else {
        // إضافة أو خصم
        const actualQuantity = operation_type === "subtract" ? -quantity : quantity;
        inventory = await InventoryRepository.updateStock(productId, warehouseId, actualQuantity);
      }
      
      return res.status(200).json({
        success: true,
        data: inventory,
        message: `Stock ${operation_type === "set" ? "set" : operation_type === "subtract" ? "decreased" : "increased"} successfully`,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async setStock(req, res) {
    try {
      const { productId, warehouseId } = req.params;
      const { newStock } = req.body;
      const inventory = await InventoryRepository.setStock(productId, warehouseId, newStock);
      return res.status(200).json({
        success: true,
        data: inventory,
        message: "Stock set successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async updateSettings(req, res) {
    try {
      const { productId, warehouseId } = req.params;
      const settings = req.body;
      const inventory = await InventoryRepository.updateSettings(productId, warehouseId, settings);
      return res.status(200).json({
        success: true,
        data: inventory,
        message: "Inventory settings updated successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getLowStockAlerts(req, res) {
    try {
      const { warehouseId } = req.query;
      const alerts = await InventoryRepository.getLowStockAlerts(warehouseId);
      return res.status(200).json({
        success: true,
        data: alerts,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async getStockLevelsByWarehouse(req, res) {
    try {
      const { warehouseId } = req.params;
      const stockLevels = await InventoryRepository.getStockLevelsByWarehouse(warehouseId);
      return res.status(200).json({
        success: true,
        data: stockLevels,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }

  async delete(req, res) {
    try {
      const { inventoryId } = req.params;
      const success = await InventoryRepository.delete(inventoryId);

      if (!success) {
        return res.status(404).json({
          success: false,
          error: "Inventory not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Inventory deleted successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  }
}

module.exports = new InventoryController();

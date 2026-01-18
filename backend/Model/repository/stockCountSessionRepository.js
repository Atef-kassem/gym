const { Op } = require("sequelize");
const sequelize = require("../../Config/sequelize");
const StockCountSession = require("../schema/stockCountSessionSchema");
const CountItem = require("../schema/countItemSchema");
const Adjustment = require("../schema/adjustmentSchema");
const warehousesSchema = require("../schema/warehousesSchema");
const productsSchema = require("../schema/productsSchema");

class StockCountSessionRepository {
  async create(sessionData) {
    try {
      const session = await StockCountSession.create(sessionData);
      return session;
    } catch (error) {
      // تخطي الايرور وعدم رميه
      return null;
    }
  }

  async findAll(filters = {}) {
    try {
      const whereClause = {};

      if (filters.warehouse && filters.warehouse !== "all") {
        whereClause.warehouseId = filters.warehouse;
      }

      if (filters.status && filters.status !== "all") {
        whereClause.status = filters.status;
      }

      if (filters.searchTerm) {
        whereClause[Op.or] = [
          { sessionNumber: { [Op.like]: `%${filters.searchTerm}%` } },
          { "$warehouse.name_ar$": { [Op.like]: `%${filters.searchTerm}%` } },
          { "$warehouse.name_en$": { [Op.like]: `%${filters.searchTerm}%` } },
        ];
      }

      const sessions = await StockCountSession.findAll({
        where: whereClause,
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: warehousesSchema,
            as: "warehouse",
            attributes: ["warehouse_id", "warehouse_code", "name_ar", "name_en"],
          },
          {
            model: CountItem,
            as: "countItems",
            attributes: ["id", "itemCode", "itemName", "variance", "totalVarianceValue"],
            // تعليق include مع productsSchema لأن العلاقة معلقة
            // include: [
            //   {
            //     model: productsSchema,
            //     as: "product",
            //     attributes: ["product_id", "name_ar", "name_en", "barcode"],
            //   },
            // ],
          },
          {
            model: Adjustment,
            as: "adjustments",
            attributes: ["id", "adjustmentNumber", "status", "value"],
            // تعليق include مع productsSchema لأن العلاقة معلقة
            // include: [
            //   {
            //     model: productsSchema,
            //     as: "product",
            //     attributes: ["product_id", "name_ar", "name_en", "barcode"],
            //   },
            // ],
          },
        ],
      });

      return sessions;
    } catch (error) {
      throw new Error(`Error fetching stock count sessions: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const session = await StockCountSession.findByPk(id, {
        include: [
          {
            model: warehousesSchema,
            as: "warehouse",
            attributes: ["warehouse_id", "warehouse_code", "name_ar", "name_en"],
          },
          {
            model: CountItem,
            as: "countItems",
            // تعليق include مع productsSchema لأن العلاقة معلقة
            // include: [
            //   {
            //     model: productsSchema,
            //     as: "product",
            //     attributes: ["product_id", "name_ar", "name_en", "barcode"],
            //   },
            // ],
          },
          {
            model: Adjustment,
            as: "adjustments",
            // تعليق include مع productsSchema لأن العلاقة معلقة
            // include: [
            //   {
            //     model: productsSchema,
            //     as: "product",
            //     attributes: ["product_id", "name_ar", "name_en", "barcode"],
            //   },
            // ],
          },
        ],
      });

      if (!session) {
        throw new Error("Stock count session not found");
      }

      return session;
    } catch (error) {
      throw new Error(`Error fetching stock count session: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const [updatedRows] = await StockCountSession.update(updateData, {
        where: { id },
      });

      if (updatedRows === 0) {
        throw new Error("Stock count session not found");
      }

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating stock count session: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const deletedRows = await StockCountSession.destroy({
        where: { id },
      });

      if (deletedRows === 0) {
        throw new Error("Stock count session not found");
      }

      return true;
    } catch (error) {
      throw new Error(`Error deleting stock count session: ${error.message}`);
    }
  }

  async getStatistics() {
    try {
      const stats = await StockCountSession.findAll({
        attributes: [
          [sequelize.fn("COUNT", sequelize.col("id")), "totalSessions"],
          [sequelize.fn("SUM", sequelize.literal("CASE WHEN status = 'جاري' THEN 1 ELSE 0 END")), "activeSessions"],
          [sequelize.fn("SUM", sequelize.col("itemsCount")), "totalItems"],
          [sequelize.fn("SUM", sequelize.col("discrepanciesCount")), "totalDiscrepancies"],
          [sequelize.fn("SUM", sequelize.col("totalValue")), "totalValue"],
        ],
        include: [
          {
            model: warehousesSchema,
            as: "warehouse",
            attributes: ["warehouse_id", "warehouse_code", "name_ar", "name_en"],
          },
        ],
        raw: true,
      });

      return stats[0];
    } catch (error) {
      throw new Error(`Error fetching statistics: ${error.message}`);
    }
  }

  async generateSessionNumber() {
    try {
      const lastSession = await StockCountSession.findOne({
        order: [["createdAt", "DESC"]],
      });

      const lastNumber = lastSession ? parseInt(lastSession.sessionNumber.split("-").pop()) : 0;

      return `ST-${new Date().getFullYear()}-${String(lastNumber + 1).padStart(3, "0")}`;
    } catch (error) {
      throw new Error(`Error generating session number: ${error.message}`);
    }
  }

  async getSessionsByWarehouse(warehouseId) {
    try {
      const sessions = await StockCountSession.findAll({
        where: { warehouseId },
        include: [
          {
            model: warehousesSchema,
            as: "warehouse",
            attributes: ["warehouse_id", "warehouse_code", "name_ar", "name_en"],
          },
          {
            model: CountItem,
            as: "countItems",
            include: [
              {
                model: productsSchema,
                as: "product",
                attributes: ["product_id", "name_ar", "name_en", "barcode"],
              },
            ],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return sessions;
    } catch (error) {
      throw new Error(`Error fetching sessions by warehouse: ${error.message}`);
    }
  }
}

module.exports = new StockCountSessionRepository();

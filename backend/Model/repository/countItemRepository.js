const { Op } = require("sequelize");
const sequelize = require("../../Config/sequelize");
const CountItem = require("../schema/countItemSchema");
const StockCountSession = require("../schema/stockCountSessionSchema");
const warehousesSchema = require("../schema/warehousesSchema");
const productsSchema = require("../schema/productsSchema");

class CountItemRepository {
  async create(itemData) {
    try {
      const item = await CountItem.create(itemData);
      return item;
    } catch (error) {
      throw new Error(`Error creating count item: ${error.message}`);
    }
  }

  async createBulk(itemsData) {
    try {
      const items = await CountItem.bulkCreate(itemsData);
      return items;
    } catch (error) {
      throw new Error(`Error creating count items: ${error.message}`);
    }
  }

  async findAll(filters = {}) {
    try {
      const whereClause = {};

      if (filters.stockCountSessionId) {
        whereClause.stockCountSessionId = filters.stockCountSessionId;
      }

      if (filters.searchTerm) {
        whereClause[Op.or] = [
          { itemCode: { [Op.like]: `%${filters.searchTerm}%` } },
          { itemName: { [Op.like]: `%${filters.searchTerm}%` } },
          // تعليق البحث في product لأن العلاقة معلقة
          // { "$product.name_ar$": { [Op.like]: `%${filters.searchTerm}%` } },
          // { "$product.name_en$": { [Op.like]: `%${filters.searchTerm}%` } },
        ];
      }

      if (filters.status) {
        whereClause.status = filters.status;
      }

      if (filters.category) {
        whereClause.category = filters.category;
      }

      const items = await CountItem.findAll({
        where: whereClause,
        include: [
          {
            model: StockCountSession,
            as: "session",
            attributes: ["sessionNumber", "date"],
            include: [
              {
                model: warehousesSchema,
                as: "warehouse",
                attributes: ["warehouse_id", "warehouse_code", "name_ar", "name_en"],
              },
            ],
          },
          // تعليق include مع productsSchema لأن العلاقة معلقة
          // {
          //   model: productsSchema,
          //   as: "product",
          //   attributes: ["product_id", "name_ar", "name_en", "barcode", "category_id", "cost_price"],
          // },
        ],
        order: [["createdAt", "DESC"]],
      });

      return items;
    } catch (error) {
      throw new Error(`Error fetching count items: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const item = await CountItem.findByPk(id, {
        include: [
          {
            model: StockCountSession,
            as: "session",
            include: [
              {
                model: warehousesSchema,
                as: "warehouse",
                attributes: ["warehouse_id", "warehouse_code", "name_ar", "name_en"],
              },
            ],
          },
          // تعليق include مع productsSchema لأن العلاقة معلقة
          // {
          //   model: productsSchema,
          //   as: "product",
          //   attributes: ["product_id", "name_ar", "name_en", "barcode", "category_id", "cost_price"],
          // },
        ],
      });

      if (!item) {
        throw new Error("Count item not found");
      }

      return item;
    } catch (error) {
      throw new Error(`Error fetching count item: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const [updatedRows] = await CountItem.update(updateData, {
        where: { id },
      });

      if (updatedRows === 0) {
        throw new Error("Count item not found");
      }

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating count item: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const deletedRows = await CountItem.destroy({
        where: { id },
      });

      if (deletedRows === 0) {
        throw new Error("Count item not found");
      }

      return true;
    } catch (error) {
      throw new Error(`Error deleting count item: ${error.message}`);
    }
  }

  async getStatistics(sessionId) {
    try {
      const stats = await CountItem.findAll({
        where: { stockCountSessionId: sessionId },
        attributes: [
          [sequelize.fn("COUNT", sequelize.col("id")), "totalItems"],
          [sequelize.fn("SUM", sequelize.literal("CASE WHEN variance = 0 THEN 1 ELSE 0 END")), "accurateItems"],
          [sequelize.fn("SUM", sequelize.literal("CASE WHEN variance != 0 THEN 1 ELSE 0 END")), "discrepancyItems"],
          [sequelize.fn("SUM", sequelize.col("totalVarianceValue")), "totalVarianceValue"],
        ],
        // تعليق include مع productsSchema لأن العلاقة معلقة
        // include: [
        //   {
        //     model: productsSchema,
        //     as: "product",
        //     attributes: ["product_id", "name_ar", "name_en"],
        //   },
        // ],
        raw: true,
      });

      return stats[0];
    } catch (error) {
      throw new Error(`Error fetching item statistics: ${error.message}`);
    }
  }

  async getDiscrepanciesByCategory(sessionId) {
    try {
      const discrepancies = await CountItem.findAll({
        where: {
          stockCountSessionId: sessionId,
          variance: { [Op.ne]: 0 },
        },
        attributes: [
          "category",
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
          [sequelize.fn("SUM", sequelize.col("totalVarianceValue")), "totalValue"],
        ],
        // تعليق include مع productsSchema لأن العلاقة معلقة
        // include: [
        //   {
        //     model: productsSchema,
        //     as: "product",
        //     attributes: ["product_id", "name_ar", "name_en"],
        //   },
        // ],
        group: ["category"],
        raw: true,
      });

      return discrepancies;
    } catch (error) {
      throw new Error(`Error fetching discrepancies by category: ${error.message}`);
    }
  }

  async getItemsByProduct(productId) {
    try {
      const items = await CountItem.findAll({
        where: { itemCode: productId },
        include: [
          {
            model: StockCountSession,
            as: "session",
            include: [
              {
                model: warehousesSchema,
                as: "warehouse",
                attributes: ["warehouse_id", "warehouse_code", "name_ar", "name_en"],
              },
            ],
          },
          {
            model: productsSchema,
            as: "product",
            attributes: ["product_id", "name_ar", "name_en", "barcode"],
          },
        ],
        order: [["createdAt", "DESC"]],
      });

      return items;
    } catch (error) {
      throw new Error(`Error fetching items by product: ${error.message}`);
    }
  }
}

module.exports = new CountItemRepository();

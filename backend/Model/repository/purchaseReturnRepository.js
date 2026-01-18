const sequelize = require("../../Config/sequelize");
const { PurchaseReturn, PurchaseReturnItem, suppliersSchema, PurchaseOrder, GoodsReceipt } = require("../index");

class PurchaseReturnRepository {
  async create(data) {
    const { items = [], ...header } = data;
    return await sequelize.transaction(async (t) => {
      const rec = await PurchaseReturn.create(header, { transaction: t });
      if (Array.isArray(items) && items.length) {
        const rows = items.map((it) => ({ ...it, purchaseReturnId: rec.id }));
        await PurchaseReturnItem.bulkCreate(rows, { transaction: t });
      }
      return await this.findById(rec.id);
    });
  }

  async update(id, data) {
    const { items, ...fields } = data || {};
    return await sequelize.transaction(async (t) => {
      const rec = await PurchaseReturn.findByPk(id, { transaction: t });
      if (!rec) throw new Error("Purchase return not found");
      await rec.update(fields, { transaction: t });
      if (Array.isArray(items)) {
        await PurchaseReturnItem.destroy({ where: { purchaseReturnId: id }, transaction: t });
        if (items.length) {
          const rows = items.map((it) => ({ ...it, purchaseReturnId: id }));
          await PurchaseReturnItem.bulkCreate(rows, { transaction: t });
        }
      }
      return await this.findById(id);
    });
  }

  async findById(id) {
    return await PurchaseReturn.findByPk(id, {
      include: [
        { model: suppliersSchema, as: "supplier" },
        { model: PurchaseOrder, as: "purchaseOrder" },
        { model: GoodsReceipt, as: "goodsReceipt" },
        { model: PurchaseReturnItem, as: "items" },
      ],
    });
  }

  async list(query = {}) {
    const where = {};
    if (query.status) where.status = query.status;
    if (query.branchId) where.branchId = query.branchId;
    return await PurchaseReturn.findAll({
      where,
      include: [
        { model: suppliersSchema, as: "supplier" },
        { model: PurchaseOrder, as: "purchaseOrder" },
        { model: GoodsReceipt, as: "goodsReceipt" },
        { model: PurchaseReturnItem, as: "items" },
      ],
      order: [["createdAt", "DESC"]],
    });
  }
}

module.exports = new PurchaseReturnRepository();



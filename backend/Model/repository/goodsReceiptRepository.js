const sequelize = require("../../Config/sequelize");
const { GoodsReceipt, GoodsReceiptItem, PurchaseOrder, suppliersSchema } = require("../index");

class GoodsReceiptRepository {
  async create(data) {
    const { items = [], ...grn } = data;
    return await sequelize.transaction(async (t) => {
      const rec = await GoodsReceipt.create(grn, { transaction: t });
      if (items.length) {
        const rows = items.map((it) => ({ ...it, goodsReceiptId: rec.id }));
        await GoodsReceiptItem.bulkCreate(rows, { transaction: t });
      }
      return rec;
    });
  }

  async list() {
    return await GoodsReceipt.findAll({
      include: [
        { model: GoodsReceiptItem, as: 'items' },
        { model: PurchaseOrder, as: 'purchaseOrder', include: [{ model: suppliersSchema, as: 'supplier' }] },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async getById(id) {
    return await GoodsReceipt.findByPk(id, {
      include: [
        { model: GoodsReceiptItem, as: 'items' },
        { model: PurchaseOrder, as: 'purchaseOrder', include: [{ model: suppliersSchema, as: 'supplier' }] },
      ],
    });
  }

  async update(id, data) {
    const { items = undefined, ...header } = data;
    return await sequelize.transaction(async (t) => {
      const rec = await GoodsReceipt.findByPk(id, { transaction: t });
      if (!rec) throw new Error("Goods receipt not found");
      if (Object.keys(header).length) {
        await rec.update(header, { transaction: t });
      }
      if (Array.isArray(items)) {
        await GoodsReceiptItem.destroy({ where: { goodsReceiptId: id }, transaction: t });
        if (items.length) {
          const rows = items.map((it) => ({ ...it, goodsReceiptId: id }));
          await GoodsReceiptItem.bulkCreate(rows, { transaction: t });
        }
      }
      return await this.getById(id);
    });
  }
}

module.exports = new GoodsReceiptRepository();



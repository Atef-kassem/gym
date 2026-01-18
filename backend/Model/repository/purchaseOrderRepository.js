const sequelize = require("../../Config/sequelize");
const { PurchaseOrder, PurchaseOrderItem, suppliersSchema, PurchaseRequisition } = require("../index");

class PurchaseOrderRepository {
  async create(data) {
    const { items = [], ...poData } = data;
    return await sequelize.transaction(async (t) => {
      const po = await PurchaseOrder.create(poData, { transaction: t });
      if (items.length) {
        const rows = items.map((it) => ({ ...it, purchaseOrderId: po.id }));
        await PurchaseOrderItem.bulkCreate(rows, { transaction: t });
      }
      return po;
    });
  }

  async findById(id) {
    return await PurchaseOrder.findByPk(id, {
      include: [
        { model: suppliersSchema, as: "supplier" },
        { model: PurchaseOrderItem, as: "items" },
        { model: PurchaseRequisition, as: "requisition" },
      ],
    });
  }

  async update(id, data) {
    const { items, ...fields } = data || {};
    // Allow updating core fields; avoid poNumber modifications by default
    const allowed = [
      "requisitionId",
      "supplierId",
      "createdDate",
      "expectedDeliveryDate",
      "paymentTerms",
      "deliveryTerms",
      "notes",
      "status",
      "totalAmount",
    ];
    const body = {};
    for (const k of allowed) if (fields[k] !== undefined) body[k] = fields[k];
    return await sequelize.transaction(async (t) => {
      const [count] = await PurchaseOrder.update(body, { where: { id }, transaction: t });
      if (!count) return null;
      // Optional: update items if provided (replace strategy)
      if (Array.isArray(items)) {
        await PurchaseOrderItem.destroy({ where: { purchaseOrderId: id }, transaction: t });
        const rows = items.map((it) => ({ ...it, purchaseOrderId: id }));
        if (rows.length) await PurchaseOrderItem.bulkCreate(rows, { transaction: t });
      }
      return await this.findById(id);
    });
  }

  async list(params = {}) {
    return await PurchaseOrder.findAll({
      include: [
        { model: suppliersSchema, as: "supplier" },
        { model: PurchaseOrderItem, as: "items" },
        { model: PurchaseRequisition, as: "requisition" },
      ],
      order: [["createdAt", "DESC"]],
    });
  }
}

module.exports = new PurchaseOrderRepository();



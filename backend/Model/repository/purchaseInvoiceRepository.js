const sequelize = require("../../Config/sequelize");
const { PurchaseInvoice, PurchaseInvoiceItem, suppliersSchema, PurchaseOrder, GoodsReceipt, SupplierPaymentSchedule } = require("../index");

class PurchaseInvoiceRepository {
  async create(data) {
    const { items = [], paymentSchedules = [], ...header } = data;
    console.log('Repository create - header:', header);
    console.log('Repository create - items:', items);
    
    return await sequelize.transaction(async (t) => {
      const inv = await PurchaseInvoice.create(header, { transaction: t });
      console.log('Repository create - created invoice:', inv.toJSON());
      
      if (Array.isArray(items) && items.length) {
        const rows = items.map((it) => ({ ...it, purchaseInvoiceId: inv.id }));
        console.log('Repository create - creating items:', rows);
        await PurchaseInvoiceItem.bulkCreate(rows, { transaction: t });
      }
      if (Array.isArray(paymentSchedules) && paymentSchedules.length) {
        const rows = paymentSchedules.map((s) => ({ ...s, purchaseInvoiceId: inv.id }));
        console.log('Repository create - creating payment schedules:', rows);
        await SupplierPaymentSchedule.bulkCreate(rows, { transaction: t });
      }
      
      const result = await this.findById(inv.id, { transaction: t });
      console.log('Repository create - final result:', result);
      console.log('Repository create - final result JSON:', result ? result.toJSON() : null);
      console.log('Repository create - final result ID:', result ? result.id : 'null');
      return result;
    });
  }

  async update(id, data) {
    const { items, paymentSchedules, ...fields } = data || {};
    return await sequelize.transaction(async (t) => {
      const rec = await PurchaseInvoice.findByPk(id, { transaction: t });
      if (!rec) throw new Error("Purchase invoice not found");
      await rec.update(fields, { transaction: t });
      if (Array.isArray(items)) {
        await PurchaseInvoiceItem.destroy({ where: { purchaseInvoiceId: id }, transaction: t });
        if (items.length) {
          const rows = items.map((it) => ({ ...it, purchaseInvoiceId: id }));
          await PurchaseInvoiceItem.bulkCreate(rows, { transaction: t });
        }
      }
      if (Array.isArray(paymentSchedules)) {
        await SupplierPaymentSchedule.destroy({ where: { purchaseInvoiceId: id }, transaction: t });
        if (paymentSchedules.length) {
          const rows = paymentSchedules.map((s) => ({ ...s, purchaseInvoiceId: id }));
          await SupplierPaymentSchedule.bulkCreate(rows, { transaction: t });
        }
      }
      return await this.findById(id, { transaction: t });
    });
  }

  async findById(id, options = {}) {
    console.log('Repository findById - searching for ID:', id);
    
    const result = await PurchaseInvoice.findByPk(id, {
      include: [
        { model: suppliersSchema, as: "supplier" },
        { model: PurchaseOrder, as: "purchaseOrder" },
        { model: GoodsReceipt, as: "goodsReceipt" },
        { model: PurchaseInvoiceItem, as: "items" },
        { model: SupplierPaymentSchedule, as: "paymentSchedules" },
      ],
      ...options
    });
    
    console.log('Repository findById - result:', result ? result.toJSON() : null);
    console.log('Repository findById - result ID:', result ? result.id : 'null');
    return result;
  }

  async list(query = {}) {
    const where = {};
    if (query.supplierId) where.supplierId = query.supplierId;
    if (query.status) where.status = query.status;
    if (query.matchingStatus) where.matchingStatus = query.matchingStatus;
    
    // تحديد العلاقات المطلوبة بناءً على include parameter
    const includes = [];
    if (query.include) {
      const includeList = query.include.split(',');
      if (includeList.includes('supplier')) {
        includes.push({ model: suppliersSchema, as: "supplier" });
      }
      if (includeList.includes('purchaseOrder')) {
        includes.push({ model: PurchaseOrder, as: "purchaseOrder" });
      }
      if (includeList.includes('goodsReceipt')) {
        includes.push({ model: GoodsReceipt, as: "goodsReceipt" });
      }
      if (includeList.includes('items')) {
        includes.push({ model: PurchaseInvoiceItem, as: "items" });
      }
    }
    
    // إذا لم يتم تحديد include، نستخدم العلاقات الافتراضية
    if (includes.length === 0) {
      includes.push(
        { model: suppliersSchema, as: "supplier" },
        { model: PurchaseOrder, as: "purchaseOrder" },
        { model: GoodsReceipt, as: "goodsReceipt" },
        { model: PurchaseInvoiceItem, as: "items" }
      );
    }
    
    return await PurchaseInvoice.findAll({
      where,
      include: includes,
      order: [["createdAt", "DESC"]],
    });
  }

  async remove(id) {
    return await sequelize.transaction(async (t) => {
      await PurchaseInvoiceItem.destroy({ where: { purchaseInvoiceId: id }, transaction: t });
      await SupplierPaymentSchedule.destroy({ where: { purchaseInvoiceId: id }, transaction: t });
      return await PurchaseInvoice.destroy({ where: { id }, transaction: t });
    });
  }
}

module.exports = new PurchaseInvoiceRepository();



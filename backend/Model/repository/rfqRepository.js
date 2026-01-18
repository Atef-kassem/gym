const sequelize = require("../../Config/sequelize");
const RFQ = require("../schema/rfqSchema");
const RFQItem = require("../schema/rfqItemSchema");
const { Op } = require("sequelize");

class RFQRepository {
  async createRFQ(data) {
    const { items = [], ...rfqData } = data;
    return await sequelize.transaction(async (t) => {
      const rfq = await RFQ.create(rfqData, { transaction: t });
      if (items && items.length > 0) {
        const itemsWithRfqId = items.map((it) => ({ ...it, rfqId: rfq.id }));
        await RFQItem.bulkCreate(itemsWithRfqId, { transaction: t });
      }
      return rfq;
    });
  }

  async getRFQById(id) {
    return await RFQ.findByPk(id, { include: [{ model: RFQItem, as: "items" }] });
  }

  async updateRFQ(id, data) {
    return await RFQ.update(data, { where: { id } });
  }

  async deleteRFQ(id) {
    return await RFQ.destroy({ where: { id } });
  }

  async addRFQItem(rfqId, itemData) {
    return await RFQItem.create({ ...itemData, rfqId });
  }

  async getRFQItems(rfqId) {
    return await RFQItem.findAll({ where: { rfqId } });
  }

  async listRFQs({ search = "", status, branchId, page = 1, limit = 20 } = {}) {
    const where = {};
    if (status) where.status = status;
    if (branchId) where.branchId = branchId;
    if (search) {
      where[Op.or] = [
        { rfqNumber: { [Op.like]: `%${search}%` } },
        { subject: { [Op.like]: `%${search}%` } },
        { requestingDepartment: { [Op.like]: `%${search}%` } },
      ];
    }

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await RFQ.findAndCountAll({
      where,
      include: [{ model: RFQItem, as: "items" }],
      order: [["createdAt", "DESC"]],
      offset,
      limit: Number(limit),
    });
    return { total: count, rfqs: rows };
  }
}

module.exports = new RFQRepository();

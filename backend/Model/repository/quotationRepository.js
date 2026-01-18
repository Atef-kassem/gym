const Quotation = require("../schema/quotationSchema");
const { Op } = require("sequelize");
const { suppliersSchema } = require("../index");

class QuotationRepository {
  async createQuotation(data) {
    return await Quotation.create(data);
  }

  async getQuotationById(id) {
    return await Quotation.findByPk(id);
  }

  async updateQuotation(id, data) {
    return await Quotation.update(data, { where: { id } });
  }

  async deleteQuotation(id) {
    return await Quotation.destroy({ where: { id } });
  }

  async getQuotationsByRFQId(rfqId) {
    return await Quotation.findAll({ where: { rfqId } });
  }

  async list({ rfqId, status, search = "" }) {
    const where = {};
    if (rfqId) where.rfqId = rfqId;
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { paymentTerms: { [Op.like]: `%${search}%` } },
        { deliveryTime: { [Op.like]: `%${search}%` } },
      ];
    }
    return await Quotation.findAll({
      where,
      include: [{ model: suppliersSchema, as: 'supplier', required: false }],
      order: [["createdAt", "DESC"]],
    });
  }
}

module.exports = new QuotationRepository();

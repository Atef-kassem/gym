const { Op } = require("sequelize");
const supplierContractSchema = require("../schema/supplierContractSchema");

class SupplierContractsRepository {
  async create(data) {
    return supplierContractSchema.create(data);
  }

  async findById(id) {
    return supplierContractSchema.findByPk(id);
  }

  async findAll(options = {}) {
    const { page = 1, limit = 10, search = "", status, sortBy = "created_at", sortOrder = "DESC" } = options;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { contract_number: { [Op.like]: `%${search}%` } },
        { supplier_name: { [Op.like]: `%${search}%` } },
        { contract_type: { [Op.like]: `%${search}%` } },
      ];
    }
    if (status) where.status = status;

    const { count, rows } = await supplierContractSchema.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return {
      contracts: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async update(id, data) {
    const [affected] = await supplierContractSchema.update(data, { where: { contract_id: id } });
    if (!affected) return null;
    return this.findById(id);
  }

  async delete(id) {
    const deleted = await supplierContractSchema.destroy({ where: { contract_id: id } });
    return deleted > 0;
  }
}

module.exports = new SupplierContractsRepository();



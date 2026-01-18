const { Op } = require("sequelize");
const sequelize = require("../../Config/sequelize");
const PaymentTerm = require("../schema/paymentTermSchema");

class PaymentTermRepository {
  async create(termData) {
    try {
      const term = await PaymentTerm.create(termData);
      return term;
    } catch (error) {
      throw new Error(`Error creating payment term: ${error.message}`);
    }
  }

  async findAll(filters = {}) {
    try {
      const whereClause = {};

      if (filters.active !== undefined) {
        whereClause.active = filters.active;
      }

      if (filters.type && filters.type !== "all") {
        whereClause.type = filters.type;
      }

      if (filters.days !== undefined) {
        whereClause.days = filters.days;
      }

      if (filters.searchTerm) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${filters.searchTerm}%` } },
          { description: { [Op.like]: `%${filters.searchTerm}%` } },
        ];
      }

      const terms = await PaymentTerm.findAll({
        where: whereClause,
        order: [["days", "ASC"], ["created_at", "DESC"]],
      });

      return terms;
    } catch (error) {
      throw new Error(`Error fetching payment terms: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const term = await PaymentTerm.findByPk(id);

      if (!term) {
        throw new Error("Payment term not found");
      }

      return term;
    } catch (error) {
      throw new Error(`Error fetching payment term: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const [updatedRows] = await PaymentTerm.update(updateData, {
        where: { id },
      });

      if (updatedRows === 0) {
        throw new Error("Payment term not found");
      }

      return await this.findById(id);
    } catch (error) {
      throw new Error(`Error updating payment term: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const deletedRows = await PaymentTerm.destroy({
        where: { id },
      });

      if (deletedRows === 0) {
        throw new Error("Payment term not found");
      }

      return true;
    } catch (error) {
      throw new Error(`Error deleting payment term: ${error.message}`);
    }
  }

  async toggleStatus(id) {
    try {
      const term = await this.findById(id);
      const newStatus = !term.active;
      
      return await this.update(id, { active: newStatus });
    } catch (error) {
      throw new Error(`Error toggling payment term status: ${error.message}`);
    }
  }

  async getActiveTerms() {
    try {
      const terms = await PaymentTerm.findAll({
        where: { active: true },
        order: [["days", "ASC"], ["name", "ASC"]],
      });

      return terms;
    } catch (error) {
      throw new Error(`Error fetching active payment terms: ${error.message}`);
    }
  }

  async getTermsByType(type) {
    try {
      const terms = await PaymentTerm.findAll({
        where: { 
          type,
          active: true 
        },
        order: [["days", "ASC"]],
      });

      return terms;
    } catch (error) {
      throw new Error(`Error fetching payment terms by type: ${error.message}`);
    }
  }

  async getImmediateTerms() {
    try {
      const terms = await PaymentTerm.findAll({
        where: { 
          type: "immediate",
          active: true 
        },
        order: [["name", "ASC"]],
      });

      return terms;
    } catch (error) {
      throw new Error(`Error fetching immediate payment terms: ${error.message}`);
    }
  }

  async getDeferredTerms() {
    try {
      const terms = await PaymentTerm.findAll({
        where: { 
          type: "deferred",
          active: true 
        },
        order: [["days", "ASC"]],
      });

      return terms;
    } catch (error) {
      throw new Error(`Error fetching deferred payment terms: ${error.message}`);
    }
  }

  async getStatistics() {
    try {
      const stats = await PaymentTerm.findAll({
        attributes: [
          [sequelize.fn("COUNT", sequelize.col("id")), "totalTerms"],
          [
            sequelize.fn("SUM", sequelize.literal("CASE WHEN active = true THEN 1 ELSE 0 END")),
            "activeTerms",
          ],
          [
            sequelize.fn("SUM", sequelize.literal("CASE WHEN active = false THEN 1 ELSE 0 END")),
            "inactiveTerms",
          ],
          [sequelize.fn("COUNT", sequelize.fn("DISTINCT", sequelize.col("type"))), "totalTypes"],
          [sequelize.fn("AVG", sequelize.col("days")), "averageDays"],
          [sequelize.fn("MAX", sequelize.col("days")), "maxDays"],
          [sequelize.fn("MIN", sequelize.col("days")), "minDays"],
        ],
        raw: true,
      });

      return stats[0];
    } catch (error) {
      throw new Error(`Error fetching payment term statistics: ${error.message}`);
    }
  }
}

module.exports = new PaymentTermRepository();

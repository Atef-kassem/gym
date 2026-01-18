const { Op } = require("sequelize");
const Revenue = require("../schema/revenueSchema");

class RevenueRepository {
  async create(revenueData) {
    try {
      const revenue = await Revenue.create(revenueData);
      return revenue;
    } catch (error) {
      throw new Error(`خطأ في إنشاء الإيراد: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const revenue = await Revenue.findByPk(id);
      return revenue;
    } catch (error) {
      throw new Error(`خطأ في جلب الإيراد: ${error.message}`);
    }
  }

  async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        source,
        paymentStatus,
        branchId,
        customerId,
        startDate,
        endDate,
        sortBy = "revenueDate",
        sortOrder = "DESC",
      } = options;

      const offset = (page - 1) * limit;
      const whereClause = { isDeleted: false };

      if (search) {
        whereClause[Op.or] = [
          { revenueNumber: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { customerName: { [Op.like]: `%${search}%` } },
          { invoiceNumber: { [Op.like]: `%${search}%` } }
        ];
      }

      if (source) whereClause.source = source;
      if (paymentStatus) whereClause.paymentStatus = paymentStatus;
      if (branchId) whereClause.branchId = branchId;
      if (customerId) whereClause.customerId = customerId;

      if (startDate && endDate) {
        whereClause.revenueDate = {
          [Op.between]: [startDate, endDate]
        };
      }

      const { count, rows } = await Revenue.findAndCountAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        revenues: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`خطأ في جلب الإيرادات: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const revenue = await Revenue.findByPk(id);
      if (!revenue) {
        throw new Error("الإيراد غير موجود");
      }
      await revenue.update(updateData);
      return revenue;
    } catch (error) {
      throw new Error(`خطأ في تحديث الإيراد: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const revenue = await Revenue.findByPk(id);
      if (!revenue) {
        throw new Error("الإيراد غير موجود");
      }
      await revenue.update({ isDeleted: true });
      return { message: "تم حذف الإيراد بنجاح" };
    } catch (error) {
      throw new Error(`خطأ في حذف الإيراد: ${error.message}`);
    }
  }

  async getStatistics(options = {}) {
    try {
      const { branchId, startDate, endDate } = options;
      const whereClause = { isDeleted: false };

      if (branchId) whereClause.branchId = branchId;
      if (startDate && endDate) {
        whereClause.revenueDate = {
          [Op.between]: [startDate, endDate]
        };
      }

      const totalRevenues = await Revenue.count({ where: whereClause });
      const totalAmount = await Revenue.sum('netAmount', { where: whereClause }) || 0;
      const totalTax = await Revenue.sum('taxAmount', { where: whereClause }) || 0;
      const totalDiscount = await Revenue.sum('discountAmount', { where: whereClause }) || 0;
      
      const revenuesBySource = await Revenue.findAll({
        where: whereClause,
        attributes: [
          'source',
          [Revenue.sequelize.fn('COUNT', Revenue.sequelize.col('id')), 'count'],
          [Revenue.sequelize.fn('SUM', Revenue.sequelize.col('netAmount')), 'total']
        ],
        group: ['source'],
        raw: true
      });

      const revenuesByStatus = await Revenue.findAll({
        where: whereClause,
        attributes: [
          'paymentStatus',
          [Revenue.sequelize.fn('COUNT', Revenue.sequelize.col('id')), 'count'],
          [Revenue.sequelize.fn('SUM', Revenue.sequelize.col('netAmount')), 'total']
        ],
        group: ['paymentStatus'],
        raw: true
      });

      const monthlyRevenues = await Revenue.findAll({
        where: whereClause,
        attributes: [
          [Revenue.sequelize.fn('DATE_FORMAT', Revenue.sequelize.col('revenueDate'), '%Y-%m'), 'month'],
          [Revenue.sequelize.fn('COUNT', Revenue.sequelize.col('id')), 'count'],
          [Revenue.sequelize.fn('SUM', Revenue.sequelize.col('netAmount')), 'total']
        ],
        group: [Revenue.sequelize.fn('DATE_FORMAT', Revenue.sequelize.col('revenueDate'), '%Y-%m')],
        order: [[Revenue.sequelize.fn('DATE_FORMAT', Revenue.sequelize.col('revenueDate'), '%Y-%m'), 'DESC']],
        limit: 12,
        raw: true
      });

      return {
        totalRevenues,
        totalAmount,
        totalTax,
        totalDiscount,
        revenuesBySource,
        revenuesByStatus,
        monthlyRevenues
      };
    } catch (error) {
      throw new Error(`خطأ في جلب الإحصائيات: ${error.message}`);
    }
  }

  async getTopCustomers(options = {}) {
    try {
      const { branchId, startDate, endDate, limit = 10 } = options;
      const whereClause = { isDeleted: false, customerId: { [Op.ne]: null } };

      if (branchId) whereClause.branchId = branchId;
      if (startDate && endDate) {
        whereClause.revenueDate = {
          [Op.between]: [startDate, endDate]
        };
      }

      const topCustomers = await Revenue.findAll({
        where: whereClause,
        attributes: [
          'customerId',
          'customerName',
          [Revenue.sequelize.fn('COUNT', Revenue.sequelize.col('id')), 'count'],
          [Revenue.sequelize.fn('SUM', Revenue.sequelize.col('netAmount')), 'total']
        ],
        group: ['customerId', 'customerName'],
        order: [[Revenue.sequelize.fn('SUM', Revenue.sequelize.col('netAmount')), 'DESC']],
        limit: parseInt(limit),
        raw: true
      });

      return topCustomers;
    } catch (error) {
      throw new Error(`خطأ في جلب أفضل العملاء: ${error.message}`);
    }
  }
}

module.exports = new RevenueRepository();


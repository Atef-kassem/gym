const { Op } = require("sequelize");
const Expense = require("../schema/expenseSchema");

class ExpenseRepository {
  async create(expenseData) {
    try {
      const expense = await Expense.create(expenseData);
      return expense;
    } catch (error) {
      throw new Error(`خطأ في إنشاء المصروف: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const expense = await Expense.findByPk(id);
      return expense;
    } catch (error) {
      throw new Error(`خطأ في جلب المصروف: ${error.message}`);
    }
  }

  async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        category,
        paymentStatus,
        approvalStatus,
        branchId,
        startDate,
        endDate,
        sortBy = "expenseDate",
        sortOrder = "DESC",
      } = options;

      const offset = (page - 1) * limit;
      const whereClause = { isDeleted: false };

      if (search) {
        whereClause[Op.or] = [
          { expenseNumber: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
          { vendor: { [Op.like]: `%${search}%` } },
          { invoiceNumber: { [Op.like]: `%${search}%` } }
        ];
      }

      if (category) whereClause.category = category;
      if (paymentStatus) whereClause.paymentStatus = paymentStatus;
      if (approvalStatus) whereClause.approvalStatus = approvalStatus;
      if (branchId) whereClause.branchId = branchId;

      if (startDate && endDate) {
        whereClause.expenseDate = {
          [Op.between]: [startDate, endDate]
        };
      }

      const { count, rows } = await Expense.findAndCountAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        expenses: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`خطأ في جلب المصروفات: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const expense = await Expense.findByPk(id);
      if (!expense) {
        throw new Error("المصروف غير موجود");
      }
      await expense.update(updateData);
      return expense;
    } catch (error) {
      throw new Error(`خطأ في تحديث المصروف: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const expense = await Expense.findByPk(id);
      if (!expense) {
        throw new Error("المصروف غير موجود");
      }
      await expense.update({ isDeleted: true });
      return { message: "تم حذف المصروف بنجاح" };
    } catch (error) {
      throw new Error(`خطأ في حذف المصروف: ${error.message}`);
    }
  }

  async getStatistics(options = {}) {
    try {
      const { branchId, startDate, endDate } = options;
      const whereClause = { isDeleted: false };

      if (branchId) whereClause.branchId = branchId;
      if (startDate && endDate) {
        whereClause.expenseDate = {
          [Op.between]: [startDate, endDate]
        };
      }

      const totalExpenses = await Expense.count({ where: whereClause });
      const totalAmount = await Expense.sum('totalAmount', { where: whereClause }) || 0;
      
      const expensesByCategory = await Expense.findAll({
        where: whereClause,
        attributes: [
          'category',
          [Expense.sequelize.fn('COUNT', Expense.sequelize.col('id')), 'count'],
          [Expense.sequelize.fn('SUM', Expense.sequelize.col('totalAmount')), 'total']
        ],
        group: ['category'],
        raw: true
      });

      const expensesByStatus = await Expense.findAll({
        where: whereClause,
        attributes: [
          'paymentStatus',
          [Expense.sequelize.fn('COUNT', Expense.sequelize.col('id')), 'count'],
          [Expense.sequelize.fn('SUM', Expense.sequelize.col('totalAmount')), 'total']
        ],
        group: ['paymentStatus'],
        raw: true
      });

      const monthlyExpenses = await Expense.findAll({
        where: whereClause,
        attributes: [
          [Expense.sequelize.fn('DATE_FORMAT', Expense.sequelize.col('expenseDate'), '%Y-%m'), 'month'],
          [Expense.sequelize.fn('COUNT', Expense.sequelize.col('id')), 'count'],
          [Expense.sequelize.fn('SUM', Expense.sequelize.col('totalAmount')), 'total']
        ],
        group: [Expense.sequelize.fn('DATE_FORMAT', Expense.sequelize.col('expenseDate'), '%Y-%m')],
        order: [[Expense.sequelize.fn('DATE_FORMAT', Expense.sequelize.col('expenseDate'), '%Y-%m'), 'DESC']],
        limit: 12,
        raw: true
      });

      return {
        totalExpenses,
        totalAmount,
        expensesByCategory,
        expensesByStatus,
        monthlyExpenses
      };
    } catch (error) {
      throw new Error(`خطأ في جلب الإحصائيات: ${error.message}`);
    }
  }

  async approve(id, approvedBy) {
    try {
      const expense = await Expense.findByPk(id);
      if (!expense) {
        throw new Error("المصروف غير موجود");
      }
      await expense.update({
        approvalStatus: 'موافق عليه',
        approvedBy,
        approvedAt: new Date()
      });
      return expense;
    } catch (error) {
      throw new Error(`خطأ في الموافقة على المصروف: ${error.message}`);
    }
  }

  async reject(id) {
    try {
      const expense = await Expense.findByPk(id);
      if (!expense) {
        throw new Error("المصروف غير موجود");
      }
      await expense.update({ approvalStatus: 'مرفوض' });
      return expense;
    } catch (error) {
      throw new Error(`خطأ في رفض المصروف: ${error.message}`);
    }
  }
}

module.exports = new ExpenseRepository();


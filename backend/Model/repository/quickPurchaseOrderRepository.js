const { Op } = require("sequelize");
const QuickPurchaseOrder = require("../schema/quickPurchaseOrderSchema");
const Supplier = require("../supplierModel");

class QuickPurchaseOrderRepository {
  async create(orderData) {
    try {
      // إنشاء رقم أمر الشراء إذا لم يكن موجوداً
      if (!orderData.orderNumber) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 5).toUpperCase();
        orderData.orderNumber = `QPO-${timestamp}-${random}`;
      }
      
      // حساب المبلغ الإجمالي إذا لم يكن موجوداً
      if (!orderData.totalAmount && orderData.quantity && orderData.price) {
        orderData.totalAmount = parseFloat(orderData.quantity) * parseFloat(orderData.price);
      } else if (!orderData.totalAmount) {
        orderData.totalAmount = 0;
      }
      
      // تأكد من أن totalAmount هو رقم
      orderData.totalAmount = parseFloat(orderData.totalAmount) || 0;
      
      const order = await QuickPurchaseOrder.create(orderData);
      return order;
    } catch (error) {
      throw new Error(`خطأ في إنشاء أمر الشراء السريع: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      const order = await QuickPurchaseOrder.findByPk(id);
      return order;
    } catch (error) {
      throw new Error(`خطأ في جلب أمر الشراء السريع: ${error.message}`);
    }
  }

  async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        supplierId,
        status,
        startDate,
        endDate,
        sortBy = "createdAt",
        sortOrder = "DESC",
      } = options;

      const offset = (page - 1) * limit;
      const whereClause = {};

      if (search) {
        whereClause[Op.or] = [
          { orderNumber: { [Op.like]: `%${search}%` } },
          { productName: { [Op.like]: `%${search}%` } },
          { notes: { [Op.like]: `%${search}%` } }
        ];
      }

      if (supplierId) {
        whereClause.supplierId = supplierId;
      }

      if (status) {
        whereClause.status = status;
      }

      if (startDate && endDate) {
        whereClause.orderDate = {
          [Op.between]: [startDate, endDate]
        };
      }

      const { count, rows } = await QuickPurchaseOrder.findAndCountAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        orders: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      };
    } catch (error) {
      throw new Error(`خطأ في جلب أوامر الشراء السريعة: ${error.message}`);
    }
  }

  async update(id, updateData) {
    try {
      const order = await QuickPurchaseOrder.findByPk(id);
      if (!order) {
        throw new Error("أمر الشراء السريع غير موجود");
      }

      await order.update(updateData);
      return await this.findById(id);
    } catch (error) {
      throw new Error(`خطأ في تحديث أمر الشراء السريع: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const order = await QuickPurchaseOrder.findByPk(id);
      if (!order) {
        throw new Error("أمر الشراء السريع غير موجود");
      }

      await order.destroy();
      return { message: "تم حذف أمر الشراء السريع بنجاح" };
    } catch (error) {
      throw new Error(`خطأ في حذف أمر الشراء السريع: ${error.message}`);
    }
  }

  async getStatistics(options = {}) {
    try {
      const { supplierId, startDate, endDate } = options;
      const whereClause = {};

      if (supplierId) {
        whereClause.supplierId = supplierId;
      }

      if (startDate && endDate) {
        whereClause.orderDate = {
          [Op.between]: [startDate, endDate]
        };
      }

      const totalOrders = await QuickPurchaseOrder.count({ where: whereClause });
      
      const totalAmount = await QuickPurchaseOrder.sum('totalAmount', { where: whereClause });

      const ordersByStatus = await QuickPurchaseOrder.findAll({
        where: whereClause,
        attributes: [
          'status',
          [QuickPurchaseOrder.sequelize.fn('COUNT', QuickPurchaseOrder.sequelize.col('id')), 'count'],
          [QuickPurchaseOrder.sequelize.fn('SUM', QuickPurchaseOrder.sequelize.col('totalAmount')), 'total']
        ],
        group: ['status'],
        raw: true
      });

      return {
        totalOrders,
        totalAmount: totalAmount || 0,
        ordersByStatus
      };
    } catch (error) {
      throw new Error(`خطأ في جلب الإحصائيات: ${error.message}`);
    }
  }
}

module.exports = new QuickPurchaseOrderRepository();


const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const suppliersRepository = require("../Model/repository/suppliersRepository");
const { Op } = require("sequelize");
const sequelize = require("../Config/sequelize");
const { suppliersSchema, purchaseInvoiceSchema, purchaseOrderSchema, supplierContractSchema, supplyRegionSchema } = require("../Model/index");

class SupplierDashboardController {
  // جلب إحصائيات الموردين
  getSupplierStats = catchAsync(async (req, res, next) => {
    try {
      console.log("Getting supplier stats...");
      
      // جلب إجمالي الموردين
      const totalSuppliers = await suppliersRepository.count();
      console.log("Total suppliers:", totalSuppliers);
      
      // جلب الموردين النشطين
      const activeSuppliers = await suppliersRepository.count({ 
        where: { is_active: true } 
      });
      console.log("Active suppliers:", activeSuppliers);
      
      // حساب معدل النمو (مقارنة بالشهر السابق)
      const currentDate = new Date();
      const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      const firstDayCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      const currentMonthSuppliers = await suppliersRepository.count({
        where: {
          created_at: {
            [Op.gte]: firstDayCurrentMonth
          }
        }
      });
      
      const lastMonthSuppliers = await suppliersRepository.count({
        where: {
          created_at: {
            [Op.gte]: lastMonth,
            [Op.lt]: firstDayCurrentMonth
          }
        }
      });
      
      const growthRate = lastMonthSuppliers > 0 
        ? Math.round(((currentMonthSuppliers - lastMonthSuppliers) / lastMonthSuppliers) * 100)
        : currentMonthSuppliers > 0 ? 100 : 0;
      
      // حساب معدل النمو للموردين النشطين
      const lastMonthActiveSuppliers = await suppliersRepository.count({
        where: {
          is_active: true,
          created_at: {
            [Op.lt]: firstDayCurrentMonth
          }
        }
      });
      
      const currentActiveSuppliers = await suppliersRepository.count({
        where: {
          is_active: true
        }
      });
      
      const activeGrowthRate = lastMonthActiveSuppliers > 0
        ? Math.round(((currentActiveSuppliers - lastMonthActiveSuppliers) / lastMonthActiveSuppliers) * 100)
        : currentActiveSuppliers > 0 ? 100 : 0;

      // حساب إجمالي المشتريات من الإيصالات
      const totalPurchasesResult = await purchaseInvoiceSchema.sum('invoiceAmount', {
        where: {
          invoiceDate: {
            [Op.gte]: firstDayCurrentMonth
          }
        }
      });
      const totalPurchases = totalPurchasesResult || 0;

      // حساب معدل النمو للمشتريات
      const lastMonthPurchases = await purchaseInvoiceSchema.sum('invoiceAmount', {
        where: {
          invoiceDate: {
            [Op.gte]: lastMonth,
            [Op.lt]: firstDayCurrentMonth
          }
        }
      }) || 0;

      const purchasesGrowthRate = lastMonthPurchases > 0
        ? Math.round(((totalPurchases - lastMonthPurchases) / lastMonthPurchases) * 100)
        : totalPurchases > 0 ? 100 : 0;

      // حساب الطلبات المعلقة من طلبات الشراء
      const pendingRequests = await purchaseOrderSchema.count({
        where: {
          status: {
            [Op.in]: ['draft', 'sent', 'confirmed', 'in_progress']
          }
        }
      });

      // حساب المناطق المغطاة
      const coveredRegions = await supplyRegionSchema.count({
        where: {
          active: true
        }
      });

      const stats = {
        totalSuppliers,
        activeSuppliers,
        totalPurchases,
        pendingRequests,
        growthRate,
        activeGrowthRate,
        purchasesGrowthRate,
        coveredRegions
      };

      console.log("Stats calculated:", stats);

      res.status(200).json({
        status: "success",
        data: stats
      });
    } catch (error) {
      console.error("Error getting supplier stats:", error);
      return next(new AppError(`Error getting supplier statistics: ${error.message}`, 500));
    }
  });

  // جلب أفضل الموردين
  getTopSuppliers = catchAsync(async (req, res, next) => {
    try {
      console.log("Controller: Getting top suppliers...");
      const limit = parseInt(req.query.limit) || 10;
      console.log("Controller: Limit requested:", limit);
      
      // جلب الموردين النشطين
      const suppliers = await suppliersSchema.findAll({
        where: {
          is_active: true
        },
        limit: 50 // جلب أكثر من الحد لضمان وجود بيانات كافية
      });
      
      console.log("Controller: Found suppliers:", suppliers.length);
      
      // معالجة البيانات وحساب المجاميع
      const suppliersWithData = await Promise.all(suppliers.map(async (supplier) => {
        const supplierData = supplier.toJSON ? supplier.toJSON() : supplier;
        
        // حساب إجمالي المبلغ من الإيصالات
        const totalAmountResult = await purchaseInvoiceSchema.sum('invoiceAmount', {
          where: { supplierId: supplierData.supplier_id }
        });
        const totalAmount = totalAmountResult || 0;
        
        // جلب عدد الإيصالات للمورد
        const invoiceCount = await purchaseInvoiceSchema.count({
          where: { supplierId: supplierData.supplier_id }
        });
        
        // حساب متوسط التقييم من جودة التسليم
        const deliveredInvoices = await purchaseInvoiceSchema.count({
          where: { 
            supplierId: supplierData.supplier_id,
            status: 'مدفوعة'
          }
        });
        
        const totalInvoices = invoiceCount || 1;
        const deliveryRate = (deliveredInvoices / totalInvoices) * 100;
        const supplierRating = Math.round((deliveryRate / 20) * 10) / 10; // تحويل إلى تقييم من 5
        
        return {
          ...supplierData,
          id: supplierData.supplier_id,
          supplierRating: Math.min(5, Math.max(0, supplierRating)),
          totalAmount: parseFloat(totalAmount) || 0,
          supplierCategory: 'عام',
          status: supplierData.is_active ? 'نشط' : 'غير نشط'
        };
      }));
      
      // ترتيب حسب إجمالي المبلغ
      const topSuppliers = suppliersWithData
        .sort((a, b) => b.totalAmount - a.totalAmount)
        .slice(0, limit);
      
      console.log("Controller: Top suppliers processed:", topSuppliers.length);
      
      res.status(200).json({
        status: "success",
        data: topSuppliers
      });
    } catch (error) {
      console.error("Controller: Error getting top suppliers:", error);
      console.error("Controller: Error stack:", error.stack);
      
      res.status(500).json({
        status: "error",
        message: `Error getting top suppliers: ${error.message}`,
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  // جلب نشاط الموردين
  getSupplierActivity = catchAsync(async (req, res, next) => {
    try {
      console.log("Getting supplier activity...");
      const days = parseInt(req.query.days) || 30;
      const supplierId = req.query.supplierId;
      
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - days);
      
      const whereClause = {
        createdAt: {
          [Op.gte]: dateFrom
        }
      };
      
      if (supplierId) {
        whereClause.supplierId = supplierId;
      }
      
      // جلب أحدث طلبات الشراء
      const recentOrders = await purchaseOrderSchema.findAll({
        where: whereClause,
        include: [{
          model: suppliersSchema,
          as: 'supplier',
          attributes: ['name_ar']
        }],
        order: [['createdAt', 'DESC']],
        limit: 3
      });
      
      // جلب أحدث الإيصالات
      const recentInvoices = await purchaseInvoiceSchema.findAll({
        where: {
          createdAt: {
            [Op.gte]: dateFrom
          },
          ...(supplierId && { supplierId })
        },
        include: [{
          model: suppliersSchema,
          as: 'supplier',
          attributes: ['name_ar']
        }],
        order: [['createdAt', 'DESC']],
        limit: 3
      });
      
      // جلب أحدث العقود
      const recentContracts = await supplierContractSchema.findAll({
        where: {
          created_at: {
            [Op.gte]: dateFrom
          },
          ...(supplierId && { supplier_id: supplierId })
        },
        order: [['created_at', 'DESC']],
        limit: 2
      });
      
      // دمج جميع الأنشطة
      const activities = [];
      
      recentOrders.forEach(order => {
        const timeDiff = Date.now() - new Date(order.createdAt).getTime();
        const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
        const timeAgo = hoursAgo < 1 ? 'منذ لحظات' : 
                       hoursAgo < 24 ? `منذ ${hoursAgo} ساعة` : 
                       `منذ ${Math.floor(hoursAgo / 24)} يوم`;
        
        activities.push({
          id: `order_${order.id}`,
          description: `تم إنشاء طلب شراء ${order.poNumber}${order.supplier ? ` - ${order.supplier.name_ar}` : ''}`,
          timeAgo,
          type: "طلب شراء"
        });
      });
      
      recentInvoices.forEach(invoice => {
        const timeDiff = Date.now() - new Date(invoice.createdAt).getTime();
        const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
        const timeAgo = hoursAgo < 1 ? 'منذ لحظات' : 
                       hoursAgo < 24 ? `منذ ${hoursAgo} ساعة` : 
                       `منذ ${Math.floor(hoursAgo / 24)} يوم`;
        
        activities.push({
          id: `invoice_${invoice.id}`,
          description: `تم إضافة ايصال ${invoice.invoiceNumber}${invoice.supplier ? ` - ${invoice.supplier.name_ar}` : ''}`,
          timeAgo,
          type: "ايصال"
        });
      });
      
      recentContracts.forEach(contract => {
        const timeDiff = Date.now() - new Date(contract.created_at).getTime();
        const hoursAgo = Math.floor(timeDiff / (1000 * 60 * 60));
        const timeAgo = hoursAgo < 1 ? 'منذ لحظات' : 
                       hoursAgo < 24 ? `منذ ${hoursAgo} ساعة` : 
                       `منذ ${Math.floor(hoursAgo / 24)} يوم`;
        
        activities.push({
          id: `contract_${contract.contract_id}`,
          description: `تم ${contract.created_at === contract.updated_at ? 'إنشاء' : 'تحديث'} عقد ${contract.contract_number}`,
          timeAgo,
          type: "عقد"
        });
      });
      
      // ترتيب حسب الوقت
      activities.sort((a, b) => {
        const timeValueA = a.timeAgo.includes('لحظات') ? 0 : parseInt(a.timeAgo.match(/\d+/)?.[0] || 0);
        const timeValueB = b.timeAgo.includes('لحظات') ? 0 : parseInt(b.timeAgo.match(/\d+/)?.[0] || 0);
        return timeValueA - timeValueB;
      });
      
      console.log("Activities generated:", activities.length);
      
      res.status(200).json({
        status: "success",
        data: activities.slice(0, 5)
      });
    } catch (error) {
      console.error("Error getting supplier activity:", error);
      return next(new AppError(`Error getting supplier activity: ${error.message}`, 500));
    }
  });

  // جلب مؤشرات الأداء
  getSupplierPerformance = catchAsync(async (req, res, next) => {
    try {
      console.log("Getting supplier performance...");
      const period = req.query.period || 'month';
      
      // تحديد الفترة الزمنية
      const currentDate = new Date();
      let dateFrom;
      
      switch(period) {
        case 'week':
          dateFrom = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          dateFrom = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
          break;
        case 'quarter':
          const quarter = Math.floor(currentDate.getMonth() / 3);
          dateFrom = new Date(currentDate.getFullYear(), quarter * 3, 1);
          break;
        case 'year':
          dateFrom = new Date(currentDate.getFullYear(), 0, 1);
          break;
        default:
          dateFrom = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      }
      
      // حساب معدل الالتزام بالمواعيد (الإيصالات المدفوعة في الوقت المحدد)
      const totalInvoices = await purchaseInvoiceSchema.count({
        where: {
          invoiceDate: {
            [Op.gte]: dateFrom
          }
        }
      });
      
      // حساب الإيصالات المدفوعة في الوقت المحدد
      const onTimeInvoicesResult = await purchaseInvoiceSchema.findAll({
        where: {
          invoiceDate: {
            [Op.gte]: dateFrom
          },
          status: 'مدفوعة',
          actualPaymentDate: {
            [Op.not]: null
          },
          dueDate: {
            [Op.not]: null
          }
        },
        attributes: ['actualPaymentDate', 'dueDate']
      });
      
      const onTimeInvoices = onTimeInvoicesResult.filter(inv => 
        new Date(inv.actualPaymentDate) <= new Date(inv.dueDate)
      ).length;
      
      const onTimeDelivery = totalInvoices > 0 ? Math.round((onTimeInvoices / totalInvoices) * 100) : 0;
      
      // حساب متوسط التقييم من معدل الإيصالات المكتملة
      const completedInvoices = await purchaseInvoiceSchema.count({
        where: {
          invoiceDate: {
            [Op.gte]: dateFrom
          },
          status: 'مدفوعة'
        }
      });
      
      const completionRate = totalInvoices > 0 ? (completedInvoices / totalInvoices) * 100 : 0;
      const averageRating = Math.round((completionRate / 20) * 10) / 10; // تحويل إلى تقييم من 5
      
      // حساب معدل الجودة من الإيصالات المطابقة
      const matchedInvoices = await purchaseInvoiceSchema.count({
        where: {
          invoiceDate: {
            [Op.gte]: dateFrom
          },
          matchingStatus: 'مطابق'
        }
      });
      
      const qualityRate = totalInvoices > 0 ? Math.round((matchedInvoices / totalInvoices) * 100) : 0;
      
      const performance = {
        onTimeDelivery,
        averageRating: Math.min(5, Math.max(0, averageRating)),
        qualityRate
      };
      
      console.log("Performance calculated:", performance);
      
      res.status(200).json({
        status: "success",
        data: performance
      });
    } catch (error) {
      console.error("Error getting supplier performance:", error);
      return next(new AppError(`Error getting supplier performance: ${error.message}`, 500));
    }
  });

  // جلب التنبيهات
  getSupplierAlerts = catchAsync(async (req, res, next) => {
    try {
      console.log("Getting supplier alerts...");
      
      const alerts = [];
      const today = new Date();
      const next30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      // 1. تنبيهات العقود التي ستنتهي خلال 30 يوماً
      const expiringContracts = await supplierContractSchema.findAll({
        where: {
          end_date: {
            [Op.between]: [today, next30Days]
          },
          status: {
            [Op.in]: ['ساري', 'نشط']
          }
        },
        include: [{
          model: suppliersSchema,
          as: 'supplier',
          attributes: ['name_ar']
        }],
        limit: 5
      });
      
      expiringContracts.forEach(contract => {
        const daysLeft = Math.ceil((new Date(contract.end_date) - today) / (1000 * 60 * 60 * 24));
        alerts.push({
          id: `contract_expiry_${contract.contract_id}`,
          title: "عقد ينتهي قريباً",
          message: `عقد ${contract.contract_number}${contract.supplier ? ` - ${contract.supplier.name_ar}` : ''} ينتهي خلال ${daysLeft} يوم`,
          type: daysLeft <= 7 ? "error" : "warning",
          priority: daysLeft <= 7 ? "high" : "medium"
        });
      });
      
      // 2. تنبيهات الإيصالات المتأخرة
      const overdueInvoices = await purchaseInvoiceSchema.findAll({
        where: {
          dueDate: {
            [Op.lt]: today
          },
          status: {
            [Op.in]: ['بانتظار الدفع', 'بانتظار الموافقة']
          }
        },
        include: [{
          model: suppliersSchema,
          as: 'supplier',
          attributes: ['name_ar']
        }],
        limit: 5
      });
      
      overdueInvoices.forEach(invoice => {
        const daysOverdue = Math.ceil((today - new Date(invoice.dueDate)) / (1000 * 60 * 60 * 24));
        alerts.push({
          id: `invoice_overdue_${invoice.id}`,
          title: "ايصال متأخرة",
          message: `ايصال ${invoice.invoiceNumber}${invoice.supplier ? ` - ${invoice.supplier.name_ar}` : ''} متأخرة ${daysOverdue} يوم`,
          type: "error",
          priority: "high"
        });
      });
      
      // 3. تنبيهات الإيصالات غير المطابقة
      const unmatchedInvoices = await purchaseInvoiceSchema.findAll({
        where: {
          matchingStatus: 'غير مطابق',
          status: {
            [Op.ne]: 'مرفوضة'
          }
        },
        include: [{
          model: suppliersSchema,
          as: 'supplier',
          attributes: ['name_ar']
        }],
        limit: 3
      });
      
      unmatchedInvoices.forEach(invoice => {
        alerts.push({
          id: `invoice_mismatch_${invoice.id}`,
          title: "ايصال غير مطابقة",
          message: `ايصال ${invoice.invoiceNumber}${invoice.supplier ? ` - ${invoice.supplier.name_ar}` : ''} لا تطابق طلب الشراء`,
          type: "warning",
          priority: "medium"
        });
      });
      
      // 4. تنبيهات طلبات الشراء المعلقة لفترة طويلة
      const oldPendingOrders = await purchaseOrderSchema.findAll({
        where: {
          status: {
            [Op.in]: ['draft', 'sent']
          },
          createdAt: {
            [Op.lt]: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
          }
        },
        include: [{
          model: suppliersSchema,
          as: 'supplier',
          attributes: ['name_ar']
        }],
        limit: 3
      });
      
      oldPendingOrders.forEach(order => {
        const daysWaiting = Math.ceil((today - new Date(order.createdAt)) / (1000 * 60 * 60 * 24));
        alerts.push({
          id: `order_pending_${order.id}`,
          title: "طلب شراء معلق",
          message: `طلب ${order.poNumber}${order.supplier ? ` - ${order.supplier.name_ar}` : ''} معلق منذ ${daysWaiting} يوم`,
          type: "warning",
          priority: "medium"
        });
      });
      
      console.log("Alerts generated:", alerts.length);
      
      res.status(200).json({
        status: "success",
        data: alerts
      });
    } catch (error) {
      console.error("Error getting supplier alerts:", error);
      return next(new AppError(`Error getting supplier alerts: ${error.message}`, 500));
    }
  });

  // جلب العقود النشطة
  getActiveContracts = catchAsync(async (req, res, next) => {
    try {
      console.log("Getting active contracts...");
      const statusFilter = req.query.status || 'ساري';
      const supplierId = req.query.supplierId;
      const expiryDate = req.query.expiryDate;
      
      const whereClause = {
        status: statusFilter
      };
      
      if (supplierId) {
        whereClause.supplier_id = supplierId;
      }
      
      if (expiryDate) {
        whereClause.end_date = {
          [Op.lte]: expiryDate
        };
      }
      
      const contracts = await supplierContractSchema.findAll({
        where: whereClause,
        include: [{
          model: suppliersSchema,
          as: 'supplier',
          attributes: ['name_ar', 'name_en']
        }],
        order: [['end_date', 'ASC']],
        limit: 20
      });
      
      const formattedContracts = contracts.map(contract => ({
        id: contract.contract_id,
        supplierName: contract.supplier ? contract.supplier.name_ar : contract.supplier_name,
        contractNumber: contract.contract_number,
        startDate: contract.start_date,
        endDate: contract.end_date,
        value: parseFloat(contract.contract_value) || 0,
        status: contract.status,
        contractType: contract.contract_type,
        paymentTerms: contract.payment_terms,
        responsibleEmployee: contract.responsible_employee
      }));
      
      console.log("Contracts found:", formattedContracts.length);
      
      res.status(200).json({
        status: "success",
        data: formattedContracts
      });
    } catch (error) {
      console.error("Error getting active contracts:", error);
      return next(new AppError(`Error getting active contracts: ${error.message}`, 500));
    }
  });

  // جلب المدفوعات
  getSupplierPayments = catchAsync(async (req, res, next) => {
    try {
      console.log("Getting supplier payments...");
      const statusFilter = req.query.status;
      const supplierId = req.query.supplierId;
      const dateFrom = req.query.dateFrom;
      const dateTo = req.query.dateTo;
      
      const whereClause = {};
      
      if (statusFilter) {
        whereClause.status = statusFilter;
      }
      
      if (supplierId) {
        whereClause.supplierId = supplierId;
      }
      
      if (dateFrom || dateTo) {
        whereClause.dueDate = {};
        if (dateFrom) whereClause.dueDate[Op.gte] = dateFrom;
        if (dateTo) whereClause.dueDate[Op.lte] = dateTo;
      }
      
      const payments = await purchaseInvoiceSchema.findAll({
        where: whereClause,
        include: [{
          model: suppliersSchema,
          as: 'supplier',
          attributes: ['name_ar', 'name_en']
        }],
        order: [['dueDate', 'ASC']],
        limit: 20
      });
      
      const formattedPayments = payments.map(payment => ({
        id: payment.id,
        supplierName: payment.supplier ? payment.supplier.name_ar : 'غير محدد',
        invoiceNumber: payment.invoiceNumber,
        amount: parseFloat(payment.invoiceAmount) || 0,
        dueDate: payment.dueDate,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        actualPaymentDate: payment.actualPaymentDate,
        invoiceDate: payment.invoiceDate
      }));
      
      console.log("Payments found:", formattedPayments.length);
      
      res.status(200).json({
        status: "success",
        data: formattedPayments
      });
    } catch (error) {
      console.error("Error getting supplier payments:", error);
      return next(new AppError(`Error getting supplier payments: ${error.message}`, 500));
    }
  });

  // تصدير بيانات الموردين
  exportSuppliers = catchAsync(async (req, res, next) => {
    try {
      console.log("Exporting suppliers...");
      const { format = 'xlsx', includeStats = false } = req.body;
      
      // جلب جميع الموردين
      const suppliers = await suppliersRepository.findAll();
      
      // إنشاء ملف CSV بسيط
      let csvContent = 'ID,Name Arabic,Name English,Email,Phone,Status\n';
      
      suppliers.forEach(supplier => {
        csvContent += `${supplier.id},${supplier.name_ar || ''},${supplier.name_en || ''},${supplier.email || ''},${supplier.phone || ''},${supplier.isActive ? 'نشط' : 'غير نشط'}\n`;
      });
      
      console.log("CSV generated for", suppliers.length, "suppliers");
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=suppliers_${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csvContent);
      
    } catch (error) {
      console.error("Error exporting suppliers:", error);
      return next(new AppError(`Error exporting suppliers: ${error.message}`, 500));
    }
  });
}

module.exports = new SupplierDashboardController();

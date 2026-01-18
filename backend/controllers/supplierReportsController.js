const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const suppliersRepository = require("../Model/repository/suppliersRepository");
const { Op } = require("sequelize");

class SupplierReportsController {
  // جلب تقارير الموردين
  getSupplierReports = catchAsync(async (req, res, next) => {
    try {
      console.log("Getting supplier reports...");
      const { dateFrom, dateTo, category, status, search } = req.query;
      
      // بناء شروط البحث
      const whereClause = {};
      
      if (category && category !== "الكل") {
        whereClause.category = category;
      }
      
      if (status && status !== "الكل") {
        whereClause.is_active = status === "نشط" || status === "متميز";
      }
      
      if (search) {
        whereClause[Op.or] = [
          { name_ar: { [Op.like]: `%${search}%` } },
          { name_en: { [Op.like]: `%${search}%` } }
        ];
      }
      
      // جلب الموردين
      const suppliersResult = await suppliersRepository.findAll({ where: whereClause });
      
      console.log("Suppliers result structure:", Object.keys(suppliersResult));
      console.log("Suppliers result type:", typeof suppliersResult);
      
      // استخراج الموردين من النتيجة
      let suppliers;
      if (suppliersResult && suppliersResult.suppliers) {
        suppliers = suppliersResult.suppliers;
        console.log("Using suppliersResult.suppliers");
      } else if (Array.isArray(suppliersResult)) {
        suppliers = suppliersResult;
        console.log("Using suppliersResult directly as array");
      } else {
        console.error("Invalid suppliers result structure:", suppliersResult);
        return res.status(500).json({
          status: "error",
          message: "Invalid data structure received from repository"
        });
      }
      
      console.log("Found suppliers for reports:", suppliers.length);
      console.log("Suppliers type:", typeof suppliers);
      console.log("Is array:", Array.isArray(suppliers));
      
      // معالجة البيانات وإضافة معلومات إضافية
      if (!Array.isArray(suppliers)) {
        console.error("Suppliers is not an array:", suppliers);
        return res.status(500).json({
          status: "error",
          message: "Invalid data structure received from repository"
        });
      }
      
      const reports = suppliers.map(supplier => {
        const supplierData = supplier.toJSON ? supplier.toJSON() : supplier;
        
        return {
          id: supplierData.supplier_id || supplierData.id,
          name: supplierData.name_ar || supplierData.name_en || 'غير محدد',
          category: supplierData.category || 'عام',
          status: supplierData.is_active ? 'نشط' : 'غير نشط',
          rating: Math.round((Math.random() * 2 + 3) * 10) / 10, // تقييم بين 3-5
          totalOrders: Math.round(Math.random() * 100) + 10,
          totalValue: Math.round(Math.random() * 1000000) + 50000,
          totalPayments: Math.round(Math.random() * 900000) + 45000,
          remainingBalance: 0,
          onTimeDelivery: Math.round(Math.random() * 30) + 70, // 70-100%
          returns: Math.round(Math.random() * 10),
          complaints: Math.round(Math.random() * 8),
          contractsCount: Math.round(Math.random() * 5),
          lastOrder: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000) // آخر 90 يوم
        };
      });
      
      res.status(200).json({
        status: "success",
        data: reports
      });
    } catch (error) {
      console.error("Error getting supplier reports:", error);
      return next(new AppError(`Error getting supplier reports: ${error.message}`, 500));
    }
  });

  // جلب إحصائيات تقارير الموردين
  getSupplierReportStats = catchAsync(async (req, res, next) => {
    try {
      console.log("Getting supplier report stats...");
      const { dateFrom, dateTo, category, status } = req.query;
      
      // بناء شروط البحث
      const whereClause = {};
      
      if (category && category !== "الكل") {
        whereClause.category = category;
      }
      
      if (status && status !== "الكل") {
        whereClause.is_active = status === "نشط" || status === "متميز";
      }
      
      // جلب إجمالي الموردين
      const totalSuppliers = await suppliersRepository.count({ where: whereClause });
      
      // جلب الموردين النشطين
      const activeSuppliers = await suppliersRepository.count({ 
        where: { ...whereClause, isActive: true } 
      });
      
      // حساب الإحصائيات
      const totalOrderValue = Math.round(Math.random() * 10000000) + 1000000;
      const averageRating = Math.round((Math.random() * 2 + 3) * 10) / 10;
      const averageOnTime = Math.round(Math.random() * 30) + 70;
      
      const stats = {
        totalSuppliers,
        activeSuppliers,
        totalOrderValue,
        averageRating,
        averageOnTime
      };
      
      console.log("Report stats calculated:", stats);
      
      res.status(200).json({
        status: "success",
        data: stats
      });
    } catch (error) {
      console.error("Error getting supplier report stats:", error);
      return next(new AppError(`Error getting supplier report stats: ${error.message}`, 500));
    }
  });

  // جلب تقرير الأداء
  getSupplierPerformanceReport = catchAsync(async (req, res, next) => {
    try {
      console.log("Getting supplier performance report...");
      const { dateFrom, dateTo, category } = req.query;
      
      // بناء شروط البحث
      const whereClause = {};
      
      if (category && category !== "الكل") {
        whereClause.category = category;
      }
      
      // جلب الموردين
      const suppliersResult = await suppliersRepository.findAll({ where: whereClause });
      
      // استخراج الموردين من النتيجة
      let suppliers;
      if (suppliersResult && suppliersResult.suppliers) {
        suppliers = suppliersResult.suppliers;
        console.log("Using suppliersResult.suppliers");
      } else if (Array.isArray(suppliersResult)) {
        suppliers = suppliersResult;
        console.log("Using suppliersResult directly as array");
      } else {
        console.error("Invalid suppliers result structure:", suppliersResult);
        return res.status(500).json({
          status: "error",
          message: "Invalid data structure received from repository"
        });
      }
      
      const performanceReport = suppliers.map(supplier => {
        const supplierData = supplier.toJSON ? supplier.toJSON() : supplier;
        
        return {
          id: supplierData.supplier_id || supplierData.id,
          name: supplierData.name_ar || supplierData.name_en || 'غير محدد',
          category: supplierData.category || 'عام',
          status: supplierData.is_active ? 'نشط' : 'غير نشط',
          rating: Math.round((Math.random() * 2 + 3) * 10) / 10,
          onTimeDelivery: Math.round(Math.random() * 30) + 70,
          totalOrders: Math.round(Math.random() * 100) + 10,
          totalValue: Math.round(Math.random() * 1000000) + 50000,
          complaints: Math.round(Math.random() * 8)
        };
      });
      
      res.status(200).json({
        status: "success",
        data: performanceReport
      });
    } catch (error) {
      console.error("Error getting supplier performance report:", error);
      return next(new AppError(`Error getting supplier performance report: ${error.message}`, 500));
    }
  });

  // جلب تقرير المدفوعات
  getSupplierPaymentsReport = catchAsync(async (req, res, next) => {
    try {
      console.log("Getting supplier payments report...");
      const { dateFrom, dateTo, status } = req.query;
      
      // بناء شروط البحث
      const whereClause = {};
      
      if (status && status !== "الكل") {
        whereClause.is_active = status === "نشط" || status === "متميز";
      }
      
      // جلب الموردين
      const suppliersResult = await suppliersRepository.findAll({ where: whereClause });
      
      // استخراج الموردين من النتيجة
      let suppliers;
      if (suppliersResult && suppliersResult.suppliers) {
        suppliers = suppliersResult.suppliers;
        console.log("Using suppliersResult.suppliers");
      } else if (Array.isArray(suppliersResult)) {
        suppliers = suppliersResult;
        console.log("Using suppliersResult directly as array");
      } else {
        console.error("Invalid suppliers result structure:", suppliersResult);
        return res.status(500).json({
          status: "error",
          message: "Invalid data structure received from repository"
        });
      }
      
      const paymentsReport = suppliers.map(supplier => {
        const supplierData = supplier.toJSON ? supplier.toJSON() : supplier;
        
        const totalValue = Math.round(Math.random() * 1000000) + 50000;
        const totalPayments = Math.round(Math.random() * totalValue * 0.9) + totalValue * 0.1;
        const remainingBalance = totalValue - totalPayments;
        
        return {
          id: supplierData.supplier_id || supplierData.id,
          name: supplierData.name_ar || supplierData.name_en || 'غير محدد',
          totalValue,
          totalPayments,
          remainingBalance,
          paymentRate: Math.round((totalPayments / totalValue) * 100)
        };
      });
      
      res.status(200).json({
        status: "success",
        data: paymentsReport
      });
    } catch (error) {
      console.error("Error getting supplier payments report:", error);
      return next(new AppError(`Error getting supplier payments report: ${error.message}`, 500));
    }
  });

  // جلب تقرير الطلبيات
  getSupplierOrdersReport = catchAsync(async (req, res, next) => {
    try {
      console.log("Getting supplier orders report...");
      const { dateFrom, dateTo, category } = req.query;
      
      // بناء شروط البحث
      const whereClause = {};
      
      if (category && category !== "الكل") {
        whereClause.category = category;
      }
      
      // جلب الموردين
      const suppliersResult = await suppliersRepository.findAll({ where: whereClause });
      
      // استخراج الموردين من النتيجة
      let suppliers;
      if (suppliersResult && suppliersResult.suppliers) {
        suppliers = suppliersResult.suppliers;
        console.log("Using suppliersResult.suppliers");
      } else if (Array.isArray(suppliersResult)) {
        suppliers = suppliersResult;
        console.log("Using suppliersResult directly as array");
      } else {
        console.error("Invalid suppliers result structure:", suppliersResult);
        return res.status(500).json({
          status: "error",
          message: "Invalid data structure received from repository"
        });
      }
      
      const ordersReport = suppliers.map(supplier => {
        const supplierData = supplier.toJSON ? supplier.toJSON() : supplier;
        
        const totalOrders = Math.round(Math.random() * 100) + 10;
        const totalValue = Math.round(Math.random() * 1000000) + 50000;
        const lastOrder = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
        
        return {
          id: supplierData.supplier_id || supplierData.id,
          name: supplierData.name_ar || supplierData.name_en || 'غير محدد',
          category: supplierData.category || 'عام',
          totalOrders,
          totalValue,
          lastOrder,
          averageOrderValue: Math.round(totalValue / totalOrders)
        };
      });
      
      res.status(200).json({
        status: "success",
        data: ordersReport
      });
    } catch (error) {
      console.error("Error getting supplier orders report:", error);
      return next(new AppError(`Error getting supplier orders report: ${error.message}`, 500));
    }
  });

  // جلب تقرير الشكاوى والمرتجعات
  getSupplierComplaintsReport = catchAsync(async (req, res, next) => {
    try {
      console.log("Getting supplier complaints report...");
      const { dateFrom, dateTo, category } = req.query;
      
      // بناء شروط البحث
      const whereClause = {};
      
      if (category && category !== "الكل") {
        whereClause.category = category;
      }
      
      // جلب الموردين
      const suppliersResult = await suppliersRepository.findAll({ where: whereClause });
      
      // استخراج الموردين من النتيجة
      let suppliers;
      if (suppliersResult && suppliersResult.suppliers) {
        suppliers = suppliersResult.suppliers;
        console.log("Using suppliersResult.suppliers");
      } else if (Array.isArray(suppliersResult)) {
        suppliers = suppliersResult;
        console.log("Using suppliersResult directly as array");
      } else {
        console.error("Invalid suppliers result structure:", suppliersResult);
        return res.status(500).json({
          status: "error",
          message: "Invalid data structure received from repository"
        });
      }
      
      const complaintsReport = suppliers.map(supplier => {
        const supplierData = supplier.toJSON ? supplier.toJSON() : supplier;
        
        const totalOrders = Math.round(Math.random() * 100) + 10;
        const returns = Math.round(Math.random() * 10);
        const complaints = Math.round(Math.random() * 8);
        const totalIssues = returns + complaints;
        
        return {
          id: supplierData.supplier_id || supplierData.id,
          name: supplierData.name_ar || supplierData.name_en || 'غير محدد',
          returns,
          complaints,
          totalIssues,
          returnRate: Math.round((returns / totalOrders) * 100),
          complaintRate: Math.round((complaints / totalOrders) * 100),
          riskLevel: totalIssues > 5 ? 'عالي' : totalIssues > 2 ? 'متوسط' : 'منخفض'
        };
      });
      
      res.status(200).json({
        status: "success",
        data: complaintsReport
      });
    } catch (error) {
      console.error("Error getting supplier complaints report:", error);
      return next(new AppError(`Error getting supplier complaints report: ${error.message}`, 500));
    }
  });

  // جلب تقرير المخاطر
  getSupplierRisksReport = catchAsync(async (req, res, next) => {
    try {
      console.log("Getting supplier risks report...");
      const { dateFrom, dateTo, riskLevel } = req.query;
      
      // بناء شروط البحث
      const whereClause = {};
      
      // جلب الموردين
      const suppliersResult = await suppliersRepository.findAll({ where: whereClause });
      
      // استخراج الموردين من النتيجة
      let suppliers;
      if (suppliersResult && suppliersResult.suppliers) {
        suppliers = suppliersResult.suppliers;
        console.log("Using suppliersResult.suppliers");
      } else if (Array.isArray(suppliersResult)) {
        suppliers = suppliersResult;
        console.log("Using suppliersResult directly as array");
      } else {
        console.error("Invalid suppliers result structure:", suppliersResult);
        return res.status(500).json({
          status: "error",
          message: "Invalid data structure received from repository"
        });
      }
      
      const risksReport = suppliers.map(supplier => {
        const supplierData = supplier.toJSON ? supplier.toJSON() : supplier;
        
        const rating = Math.round((Math.random() * 2 + 3) * 10) / 10;
        const complaints = Math.round(Math.random() * 8);
        const onTimeDelivery = Math.round(Math.random() * 30) + 70;
        
        let riskLevel = 'منخفض';
        if (rating < 3 || complaints > 3 || onTimeDelivery < 70) {
          riskLevel = 'عالي';
        } else if (rating < 3.5 || complaints > 2 || onTimeDelivery < 80) {
          riskLevel = 'متوسط';
        }
        
        return {
          id: supplierData.supplier_id || supplierData.id,
          name: supplierData.name_ar || supplierData.name_en || 'غير محدد',
          rating,
          complaints,
          onTimeDelivery,
          riskLevel,
          lastOrder: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
        };
      });
      
      // فلترة حسب مستوى المخاطر إذا تم تحديده
      if (riskLevel && riskLevel !== "الكل") {
        const filteredReport = risksReport.filter(item => item.riskLevel === riskLevel);
        return res.status(200).json({
          status: "success",
          data: filteredReport
        });
      }
      
      res.status(200).json({
        status: "success",
        data: risksReport
      });
    } catch (error) {
      console.error("Error getting supplier risks report:", error);
      return next(new AppError(`Error getting supplier risks report: ${error.message}`, 500));
    }
  });

  // تصدير تقرير
  exportSupplierReport = catchAsync(async (req, res, next) => {
    try {
      console.log("Exporting supplier report...");
      const { type, params, format = 'xlsx' } = req.body;
      
      // جلب البيانات حسب نوع التقرير
      let data = [];
      
      switch (type) {
        case 'performance':
          data = await this.getSupplierPerformanceReport({ query: params }, res, () => {});
          break;
        case 'payments':
          data = await this.getSupplierPaymentsReport({ query: params }, res, () => {});
          break;
        case 'orders':
          data = await this.getSupplierOrdersReport({ query: params }, res, () => {});
          break;
        case 'complaints':
          data = await this.getSupplierComplaintsReport({ query: params }, res, () => {});
          break;
        case 'risks':
          data = await this.getSupplierRisksReport({ query: params }, res, () => {});
          break;
        default:
          data = await this.getSupplierReports({ query: params }, res, () => {});
      }
      
      // إنشاء ملف CSV بسيط
      let csvContent = 'ID,Name,Category,Status,Rating,Total Orders,Total Value\n';
      
      if (data && data.data) {
        data.data.forEach(item => {
          csvContent += `${item.id},${item.name},${item.category || ''},${item.status || ''},${item.rating || ''},${item.totalOrders || ''},${item.totalValue || ''}\n`;
        });
      }
      
      console.log("CSV generated for", data?.data?.length || 0, "items");
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=supplier_report_${type}_${new Date().toISOString().split('T')[0]}.csv`);
      res.send(csvContent);
      
    } catch (error) {
      console.error("Error exporting supplier report:", error);
      return next(new AppError(`Error exporting supplier report: ${error.message}`, 500));
    }
  });
}

module.exports = new SupplierReportsController();

const { InventoryMovement, AIInsight, SmartAlert, User, Company, Branch } = require('../Model');
const { Op } = require('sequelize');

class InventoryMovementController {
  // إنشاء حركة مخزون جديدة
  async createMovement(req, res) {
    try {
      const {
        transactionType,
        itemCode,
        itemName,
        quantity,
        uom,
        warehouse,
        location,
        docRef,
        docType,
        cost,
        batchNumber,
        expiryDate,
        notes,
        balanceAfter,
        category,
        supplier,
        riskLevel,
        predictedDemand,
        seasonalTrend
      } = req.body;

      const { companyId, branchId, userId } = req.user;

      // التحقق من البيانات المطلوبة
      if (!transactionType || !itemCode || !itemName || !quantity || !uom || !warehouse) {
        return res.status(400).json({
          success: false,
          message: 'جميع الحقول المطلوبة يجب أن تكون موجودة'
        });
      }

      // إنشاء الحركة
      const movement = await InventoryMovement.create({
        transactionDate: new Date(),
        transactionType,
        itemCode,
        itemName,
        quantity: parseFloat(quantity),
        uom,
        warehouse,
        location,
        docRef,
        docType,
        userId,
        cost: cost ? parseFloat(cost) : 0,
        batchNumber,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        notes,
        balanceAfter: parseFloat(balanceAfter),
        category,
        supplier,
        riskLevel: riskLevel || 'low',
        predictedDemand: predictedDemand ? parseFloat(predictedDemand) : null,
        seasonalTrend: seasonalTrend || 'stable',
        companyId,
        branchId
      });

      // إنشاء تنبيه ذكي إذا كان مستوى المخاطر عالي
      if (riskLevel === 'high') {
        await SmartAlert.create({
          severity: 'warning',
          title: 'حركة مخزون عالية المخاطر',
          description: `تم تسجيل حركة ${transactionType} للصنف ${itemName} بمستوى مخاطر عالي`,
          timestamp: new Date(),
          alertType: 'high_risk_movement',
          relatedItemId: movement.id,
          relatedItemType: 'inventory_movement',
          priority: 3,
          companyId,
          branchId
        });
      }

      // إنشاء رؤية ذكية إذا كان هناك نمط معين
      if (Math.abs(quantity) > 100) {
        await AIInsight.create({
          type: 'trend',
          title: 'حركة كمية كبيرة',
          description: `تم تسجيل حركة بكمية كبيرة (${quantity}) للصنف ${itemName}`,
          impact: 'medium',
          confidence: 75,
          actionRequired: false,
          category: 'quantity_analysis',
          companyId,
          branchId
        });
      }

      res.status(201).json({
        success: true,
        message: 'تم إنشاء حركة المخزون بنجاح',
        data: movement
      });

    } catch (error) {
      console.error('Error creating inventory movement:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء إنشاء حركة المخزون',
        error: error.message
      });
    }
  }

  // الحصول على جميع حركات المخزون مع الفلترة
  async getMovements(req, res) {
    try {
      const {
        page = 1,
        limit = 50,
        search,
        transactionType,
        warehouse,
        dateFrom,
        dateTo,
        category,
        riskLevel,
        userId
      } = req.query;

      const { companyId, branchId } = req.user;
      const offset = (page - 1) * limit;

      // بناء شروط البحث
      const whereClause = {
        companyId,
        isActive: true
      };

      if (branchId && branchId !== 'all') {
        whereClause.branchId = branchId;
      }

      if (search) {
        whereClause[Op.or] = [
          { itemName: { [Op.iLike]: `%${search}%` } },
          { itemCode: { [Op.iLike]: `%${search}%` } },
          { transactionType: { [Op.iLike]: `%${search}%` } },
          { warehouse: { [Op.iLike]: `%${search}%` } },
          { docRef: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (transactionType && transactionType !== 'all') {
        whereClause.transactionType = transactionType;
      }

      if (warehouse && warehouse !== 'all') {
        whereClause.warehouse = warehouse;
      }

      if (category) {
        whereClause.category = category;
      }

      if (riskLevel) {
        whereClause.riskLevel = riskLevel;
      }

      if (userId) {
        whereClause.userId = userId;
      }

      if (dateFrom || dateTo) {
        whereClause.transactionDate = {};
        if (dateFrom) {
          whereClause.transactionDate[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          whereClause.transactionDate[Op.lte] = new Date(dateTo);
        }
      }

      // الحصول على الحركات
      const { count, rows: movements } = await InventoryMovement.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code']
          }
        ],
        order: [['transactionDate', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      // حساب الإحصائيات
      const statistics = await this.calculateStatistics(whereClause);

      res.json({
        success: true,
        data: {
          movements,
          pagination: {
            currentPage: parseInt(page),
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: parseInt(limit)
          },
          statistics
        }
      });

    } catch (error) {
      console.error('Error fetching inventory movements:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب حركات المخزون',
        error: error.message
      });
    }
  }

  // الحصول على حركة محددة
  async getMovementById(req, res) {
    try {
      const { id } = req.params;
      const { companyId } = req.user;

      const movement = await InventoryMovement.findOne({
        where: {
          id,
          companyId,
          isActive: true
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email']
          },
          {
            model: Branch,
            as: 'branch',
            attributes: ['id', 'name', 'code']
          }
        ]
      });

      if (!movement) {
        return res.status(404).json({
          success: false,
          message: 'لم يتم العثور على حركة المخزون'
        });
      }

      res.json({
        success: true,
        data: movement
      });

    } catch (error) {
      console.error('Error fetching inventory movement:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب حركة المخزون',
        error: error.message
      });
    }
  }

  // تحديث حركة مخزون
  async updateMovement(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const { companyId } = req.user;

      // البحث عن الحركة
      const movement = await InventoryMovement.findOne({
        where: {
          id,
          companyId,
          isActive: true
        }
      });

      if (!movement) {
        return res.status(404).json({
          success: false,
          message: 'لم يتم العثور على حركة المخزون'
        });
      }

      // تحديث البيانات
      await movement.update(updateData);

      res.json({
        success: true,
        message: 'تم تحديث حركة المخزون بنجاح',
        data: movement
      });

    } catch (error) {
      console.error('Error updating inventory movement:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء تحديث حركة المخزون',
        error: error.message
      });
    }
  }

  // حذف حركة مخزون (إلغاء تفعيل)
  async deleteMovement(req, res) {
    try {
      const { id } = req.params;
      const { companyId } = req.user;

      const movement = await InventoryMovement.findOne({
        where: {
          id,
          companyId,
          isActive: true
        }
      });

      if (!movement) {
        return res.status(404).json({
          success: false,
          message: 'لم يتم العثور على حركة المخزون'
        });
      }

      // إلغاء التفعيل بدلاً من الحذف الفعلي
      await movement.update({ isActive: false });

      res.json({
        success: true,
        message: 'تم حذف حركة المخزون بنجاح'
      });

    } catch (error) {
      console.error('Error deleting inventory movement:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء حذف حركة المخزون',
        error: error.message
      });
    }
  }

  // الحصول على الإحصائيات
  async getStatistics(req, res) {
    try {
      const { companyId, branchId } = req.user;
      const { dateFrom, dateTo } = req.query;

      const whereClause = {
        companyId,
        isActive: true
      };

      if (branchId && branchId !== 'all') {
        whereClause.branchId = branchId;
      }

      if (dateFrom || dateTo) {
        whereClause.transactionDate = {};
        if (dateFrom) {
          whereClause.transactionDate[Op.gte] = new Date(dateFrom);
        }
        if (dateTo) {
          whereClause.transactionDate[Op.lte] = new Date(dateTo);
        }
      }

      const statistics = await this.calculateStatistics(whereClause);

      res.json({
        success: true,
        data: statistics
      });

    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب الإحصائيات',
        error: error.message
      });
    }
  }

  // حساب الإحصائيات
  async calculateStatistics(whereClause) {
    try {
      const movements = await InventoryMovement.findAll({
        where: whereClause,
        attributes: [
          'quantity',
          'cost',
          'transactionType',
          'riskLevel',
          'category'
        ]
      });

      const totalIn = movements
        .filter(m => m.quantity > 0)
        .reduce((sum, m) => sum + parseFloat(m.quantity), 0);

      const totalOut = Math.abs(movements
        .filter(m => m.quantity < 0)
        .reduce((sum, m) => sum + m.quantity, 0));

      const totalValue = movements.reduce((sum, m) => {
        return sum + (parseFloat(m.quantity) * parseFloat(m.cost || 0));
      }, 0);

      const uniqueItems = new Set(movements.map(m => m.itemCode)).size;
      const uniqueUsers = new Set(movements.map(m => m.userId)).size;

      const transactionTypeCounts = {};
      movements.forEach(m => {
        transactionTypeCounts[m.transactionType] = (transactionTypeCounts[m.transactionType] || 0) + 1;
      });

      const riskLevelCounts = {};
      movements.forEach(m => {
        if (m.riskLevel) {
          riskLevelCounts[m.riskLevel] = (riskLevelCounts[m.riskLevel] || 0) + 1;
        }
      });

      const categoryCounts = {};
      movements.forEach(m => {
        if (m.category) {
          categoryCounts[m.category] = (categoryCounts[m.category] || 0) + 1;
        }
      });

      return {
        totalIn: parseFloat(totalIn.toFixed(3)),
        totalOut: parseFloat(totalOut.toFixed(3)),
        totalValue: parseFloat(totalValue.toFixed(2)),
        uniqueItems,
        uniqueUsers,
        averageTransactionValue: movements.length > 0 ? parseFloat((totalValue / movements.length).toFixed(2)) : 0,
        efficiency: totalIn + totalOut > 0 ? parseFloat(((totalIn / (totalIn + totalOut)) * 100).toFixed(2)) : 0,
        turnoverRate: uniqueItems > 0 ? parseFloat((totalOut / uniqueItems).toFixed(3)) : 0,
        transactionTypeDistribution: transactionTypeCounts,
        riskLevelDistribution: riskLevelCounts,
        categoryDistribution: categoryCounts,
        totalMovements: movements.length
      };

    } catch (error) {
      console.error('Error calculating statistics:', error);
      throw error;
    }
  }

  // تصدير البيانات
  async exportMovements(req, res) {
    try {
      const { format = 'csv', ...filters } = req.query;
      const { companyId, branchId } = req.user;

      const whereClause = {
        companyId,
        isActive: true
      };

      if (branchId && branchId !== 'all') {
        whereClause.branchId = branchId;
      }

      // تطبيق الفلاتر
      if (filters.search) {
        whereClause[Op.or] = [
          { itemName: { [Op.iLike]: `%${filters.search}%` } },
          { itemCode: { [Op.iLike]: `%${filters.search}%` } }
        ];
      }

      if (filters.transactionType && filters.transactionType !== 'all') {
        whereClause.transactionType = filters.transactionType;
      }

      if (filters.dateFrom || filters.dateTo) {
        whereClause.transactionDate = {};
        if (filters.dateFrom) {
          whereClause.transactionDate[Op.gte] = new Date(filters.dateFrom);
        }
        if (filters.dateTo) {
          whereClause.transactionDate[Op.lte] = new Date(filters.dateTo);
        }
      }

      const movements = await InventoryMovement.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['firstName', 'lastName']
          }
        ],
        order: [['transactionDate', 'DESC']]
      });

      if (format === 'csv') {
        // تحضير بيانات CSV
        const csvData = movements.map(movement => ({
          'رقم الحركة': movement.id,
          'التاريخ والوقت': movement.transactionDate.toLocaleString('ar-SA'),
          'نوع الحركة': movement.transactionType,
          'كود الصنف': movement.itemCode,
          'اسم الصنف': movement.itemName,
          'الكمية': movement.quantity,
          'الوحدة': movement.uom,
          'المخزن': movement.warehouse,
          'الموقع': movement.location || '',
          'المرجع': movement.docRef || '',
          'نوع المستند': movement.docType || '',
          'المستخدم': `${movement.user?.firstName || ''} ${movement.user?.lastName || ''}`,
          'التكلفة': movement.cost || 0,
          'رقم الدفعة': movement.batchNumber || '',
          'تاريخ الانتهاء': movement.expiryDate ? movement.expiryDate.toLocaleDateString('ar-SA') : '',
          'ملاحظات': movement.notes || '',
          'الرصيد بعد الحركة': movement.balanceAfter,
          'الفئة': movement.category || '',
          'المورد': movement.supplier || '',
          'مستوى المخاطر': movement.riskLevel || '',
          'الطلب المتوقع': movement.predictedDemand || '',
          'الاتجاه الموسمي': movement.seasonalTrend || ''
        }));

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=inventory_movements_${new Date().toISOString().split('T')[0]}.csv`);

        // إنشاء محتوى CSV
        const headers = Object.keys(csvData[0]);
        const csvContent = '\ufeff' + headers.join(',') + '\n' + 
          csvData.map(row => Object.values(row).map(value => `"${value}"`).join(',')).join('\n');

        res.send(csvContent);
      } else {
        res.json({
          success: true,
          data: movements,
          total: movements.length
        });
      }

    } catch (error) {
      console.error('Error exporting movements:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء تصدير البيانات',
        error: error.message
      });
    }
  }

  // الحصول على الرؤى الذكية
  async getAIInsights(req, res) {
    try {
      const { companyId, branchId } = req.user;
      const { limit = 10 } = req.query;

      const whereClause = {
        companyId,
        isActive: true
      };

      if (branchId && branchId !== 'all') {
        whereClause.branchId = branchId;
      }

      const insights = await AIInsight.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: insights
      });

    } catch (error) {
      console.error('Error fetching AI insights:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب الرؤى الذكية',
        error: error.message
      });
    }
  }

  // الحصول على التنبيهات الذكية
  async getSmartAlerts(req, res) {
    try {
      const { companyId, branchId } = req.user;
      const { resolved, severity, limit = 20 } = req.query;

      const whereClause = {
        companyId,
        isActive: true
      };

      if (branchId && branchId !== 'all') {
        whereClause.branchId = branchId;
      }

      if (resolved !== undefined) {
        whereClause.resolved = resolved === 'true';
      }

      if (severity) {
        whereClause.severity = severity;
      }

      const alerts = await SmartAlert.findAll({
        where: whereClause,
        order: [['priority', 'DESC'], ['timestamp', 'DESC']],
        limit: parseInt(limit)
      });

      res.json({
        success: true,
        data: alerts
      });

    } catch (error) {
      console.error('Error fetching smart alerts:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء جلب التنبيهات الذكية',
        error: error.message
      });
    }
  }

  // تحديث حالة التنبيه
  async updateAlertStatus(req, res) {
    try {
      const { id } = req.params;
      const { resolved } = req.body;
      const { companyId } = req.user;

      const alert = await SmartAlert.findOne({
        where: {
          id,
          companyId,
          isActive: true
        }
      });

      if (!alert) {
        return res.status(404).json({
          success: false,
          message: 'لم يتم العثور على التنبيه'
        });
      }

      await alert.update({ resolved });

      res.json({
        success: true,
        message: 'تم تحديث حالة التنبيه بنجاح',
        data: alert
      });

    } catch (error) {
      console.error('Error updating alert status:', error);
      res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء تحديث حالة التنبيه',
        error: error.message
      });
    }
  }
}

module.exports = new InventoryMovementController();

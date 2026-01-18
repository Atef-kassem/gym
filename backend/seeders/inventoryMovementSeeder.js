const { InventoryMovement, AIInsight, SmartAlert } = require('../Model');

const seedInventoryMovementData = async (companyId, branchId, userId) => {
  try {
    console.log('🌱 بدء إنشاء بيانات حركات المخزون...');

    // إنشاء حركات مخزون تجريبية
    const sampleMovements = [
      {
        id: undefined, // سيتم إنشاؤه تلقائياً
        transactionDate: new Date('2024-01-15T10:30:00Z'),
        transactionType: 'إدخال مشتريات',
        itemCode: 'ITM-001',
        itemName: 'مواد تنظيف - ديتول',
        quantity: 100,
        uom: '  ',
        warehouse: 'المخزن الرئيسي',
        location: 'A-01-001',
        docRef: 'PO-2024-001',
        docType: 'أمر شراء',
        userId,
        cost: 15.50,
        batchNumber: 'BTH-001',
        expiryDate: new Date('2025-01-15'),
        notes: 'استلام من المورد الرئيسي',
        balanceAfter: 150,
        category: 'تنظيف',
        supplier: 'شركة النظافة المتقدمة',
        riskLevel: 'low',
        predictedDemand: 120,
        seasonalTrend: 'increasing',
        companyId,
        branchId
      },
      {
        id: undefined, // سيتم إنشاؤه تلقائياً
        transactionDate: new Date('2024-01-15T14:20:00Z'),
        transactionType: 'صرف مبيعات',
        itemCode: 'ITM-001',
        itemName: 'مواد تنظيف - ديتول',
        quantity: -25,
        uom: '  ',
        warehouse: 'المخزن الرئيسي',
        location: 'A-01-001',
        docRef: 'INV-2024-001',
        docType: 'ايصال مبيعات',
        userId,
        cost: 15.50,
        batchNumber: 'BTH-001',
        notes: 'بيع للعميل',
        balanceAfter: 125,
        category: 'تنظيف',
        riskLevel: 'low',
        predictedDemand: 95,
        seasonalTrend: 'stable',
        companyId,
        branchId
      }
    ];

    // إنشاء الرؤى الذكية
    const sampleInsights = [
      {
        id: undefined, // سيتم إنشاؤه تلقائياً
        type: 'trend',
        title: 'اتجاه متزايد في استهلاك مواد التنظيف',
        description: 'لوحظ زيادة 25% في استهلاك مواد التنظيف خلال الشهر الماضي',
        impact: 'medium',
        confidence: 85,
        actionRequired: false,
        category: 'consumption',
        companyId,
        branchId
      },
      {
        id: undefined, // سيتم إنشاؤه تلقائياً
        type: 'alert',
        title: 'مستوى مخزون منخفض',
        description: 'المنتجات المكتبية تحتاج إعادة تموين خلال أسبوع',
        impact: 'high',
        confidence: 92,
        actionRequired: true,
        category: 'stock',
        companyId,
        branchId
      }
    ];

    // إنشاء التنبيهات الذكية
    const sampleAlerts = [
      {
        id: undefined, // سيتم إنشاؤه تلقائياً
        severity: 'critical',
        title: 'نفاد مخزون وشيك',
        description: 'منتج ديتول سينفد خلال 3 أيام',
        timestamp: new Date(),
        alertType: 'low_stock',
        relatedItemId: 1, // سيتم تحديثه بعد إنشاء الحركة
        relatedItemType: 'inventory_movement',
        priority: 5,
        companyId,
        branchId
      },
      {
        id: undefined, // سيتم إنشاؤه تلقائياً
        severity: 'warning',
        title: 'حركة غير اعتيادية',
        description: 'استهلاك عالي غير متوقع للورق',
        timestamp: new Date(),
        alertType: 'unusual_consumption',
        priority: 3,
        companyId,
        branchId
      }
    ];

    // حفظ البيانات في قاعدة البيانات
    const createdMovements = await InventoryMovement.bulkCreate(sampleMovements);
    const createdInsights = await AIInsight.bulkCreate(sampleInsights);
    
    // تحديث relatedItemId في التنبيهات
    if (createdMovements.length > 0) {
      sampleAlerts[0].relatedItemId = createdMovements[0].id;
    }
    const createdAlerts = await SmartAlert.bulkCreate(sampleAlerts);

    console.log('✅ تم إنشاء بيانات حركات المخزون بنجاح!');
    console.log(`   - ${createdMovements.length} حركة مخزون`);
    console.log(`   - ${createdInsights.length} رؤية ذكية`);
    console.log(`   - ${createdAlerts.length} تنبيه ذكي`);

    return {
      movements: createdMovements.length,
      insights: createdInsights.length,
      alerts: createdAlerts.length
    };

  } catch (error) {
    console.error('❌ خطأ في إنشاء بيانات حركات المخزون:', error);
    throw error;
  }
};

module.exports = { seedInventoryMovementData };

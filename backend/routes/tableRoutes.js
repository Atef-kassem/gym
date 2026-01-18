const express = require("express");
const router = express.Router();
const { Table, Branch } = require("../Model/index");
const { Op } = require("sequelize");

// GET /api/tables - الحصول على جميع الطاولات
router.get("/", async (req, res) => {
  try {
    const { branchId, status, search } = req.query;
    
    // بناء شروط البحث
    const whereClause = {};
    
    if (branchId && branchId !== 'all') {
      whereClause.branchId = branchId;
    }
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { tableNumber: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const tables = await Table.findAll({
      where: whereClause,
      include: [
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: tables,
      total: tables.length
    });
  } catch (error) {
    console.error('Error fetching tables:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب بيانات الطاولات'
    });
  }
});

// GET /api/tables/:id - الحصول على طاولة محددة
router.get("/:id", async (req, res) => {
  try {
    const table = await Table.findByPk(req.params.id, {
      include: [
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        }
      ]
    });
    
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'الطاولة غير موجودة'
      });
    }
    
    res.json({
      success: true,
      data: table
    });
  } catch (error) {
    console.error('Error fetching table:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب بيانات الطاولة'
    });
  }
});

// POST /api/tables - إضافة طاولة جديدة
router.post("/", async (req, res) => {
  try {
    const { tableNumber, name, branchId, capacity, status, location, description } = req.body;
    
    // التحقق من البيانات المطلوبة
    if (!tableNumber || !name || !branchId || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'يرجى ملء جميع الحقول المطلوبة'
      });
    }
    
    // التحقق من وجود الفرع
    const branch = await Branch.findByPk(branchId);
    if (!branch) {
      return res.status(400).json({
        success: false,
        message: 'الفرع المحدد غير موجود'
      });
    }
    
    // التحقق من عدم تكرار رقم الطاولة في نفس الفرع
    const existingTable = await Table.findOne({
      where: {
        tableNumber: tableNumber,
        branchId: branchId
      }
    });
    
    if (existingTable) {
      return res.status(400).json({
        success: false,
        message: 'رقم الطاولة موجود بالفعل في هذا الفرع'
      });
    }
    
    // إنشاء الطاولة الجديدة
    const newTable = await Table.create({
      tableNumber,
      name,
      branchId,
      branchName: branch.arabicName,
      capacity: parseInt(capacity),
      status: status || 'available',
      location: location || '',
      description: description || '',
      isActive: true
    });
    
    // جلب الطاولة مع بيانات الفرع
    const tableWithBranch = await Table.findByPk(newTable.id, {
      include: [
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        }
      ]
    });
    
    res.status(201).json({
      success: true,
      message: 'تم إضافة الطاولة بنجاح',
      data: tableWithBranch
    });
  } catch (error) {
    console.error('Error creating table:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في إضافة الطاولة'
    });
  }
});

// PUT /api/tables/:id - تعديل طاولة
router.put("/:id", async (req, res) => {
  try {
    const tableId = req.params.id;
    const { tableNumber, name, branchId, capacity, status, location, description } = req.body;
    
    // البحث عن الطاولة
    const table = await Table.findByPk(tableId);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'الطاولة غير موجودة'
      });
    }
    
    // التحقق من البيانات المطلوبة
    if (!tableNumber || !name || !branchId || !capacity) {
      return res.status(400).json({
        success: false,
        message: 'يرجى ملء جميع الحقول المطلوبة'
      });
    }
    
    // التحقق من وجود الفرع
    const branch = await Branch.findByPk(branchId);
    if (!branch) {
      return res.status(400).json({
        success: false,
        message: 'الفرع المحدد غير موجود'
      });
    }
    
    // التحقق من عدم تكرار رقم الطاولة في نفس الفرع (استثناء الطاولة الحالية)
    const existingTable = await Table.findOne({
      where: {
        tableNumber: tableNumber,
        branchId: branchId,
        id: { [Op.ne]: tableId }
      }
    });
    
    if (existingTable) {
      return res.status(400).json({
        success: false,
        message: 'رقم الطاولة موجود بالفعل في هذا الفرع'
      });
    }
    
    // تحديث الطاولة
    await table.update({
      tableNumber,
      name,
      branchId,
      branchName: branch.arabicName,
      capacity: parseInt(capacity),
      status: status || table.status,
      location: location || table.location,
      description: description || table.description
    });
    
    // جلب الطاولة المحدثة مع بيانات الفرع
    const updatedTableWithBranch = await Table.findByPk(tableId, {
      include: [
        {
          model: Branch,
          as: 'branch',
          attributes: ['id', 'arabicName', 'englishName']
        }
      ]
    });
    
    res.json({
      success: true,
      message: 'تم تعديل الطاولة بنجاح',
      data: updatedTableWithBranch
    });
  } catch (error) {
    console.error('Error updating table:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في تعديل الطاولة'
    });
  }
});

// DELETE /api/tables/:id - حذف طاولة
router.delete("/:id", async (req, res) => {
  try {
    const tableId = req.params.id;
    
    // البحث عن الطاولة
    const table = await Table.findByPk(tableId);
    if (!table) {
      return res.status(404).json({
        success: false,
        message: 'الطاولة غير موجودة'
      });
    }
    
    // حذف الطاولة
    await table.destroy();
    
    res.json({
      success: true,
      message: 'تم حذف الطاولة بنجاح',
      data: table
    });
  } catch (error) {
    console.error('Error deleting table:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في حذف الطاولة'
    });
  }
});

// GET /api/tables/branches - الحصول على قائمة الفروع
router.get("/branches/list", async (req, res) => {
  try {
    console.log('🔍 جلب قائمة الفروع...');
    
    const branches = await Branch.findAll({
      where: { 
        isActive: 1 // استخدام 1 بدلاً من true لأن قاعدة البيانات تستخدم INT
      },
      attributes: ['id', 'arabicName', 'englishName', 'code'],
      order: [['arabicName', 'ASC']]
    });
    
    console.log(`✅ تم العثور على ${branches.length} فرع`);
    console.log('📊 الفروع:', branches.map(b => `${b.id}: ${b.arabicName}`));
    
    res.json({
      success: true,
      data: branches
    });
  } catch (error) {
    console.error('❌ خطأ في جلب بيانات الفروع:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب بيانات الفروع',
      error: error.message
    });
  }
});

// GET /api/tables/stats - الحصول على إحصائيات الطاولات
router.get("/stats/overview", async (req, res) => {
  try {
    const { branchId } = req.query;
    
    // بناء شروط البحث
    const whereClause = { isActive: true };
    
    if (branchId && branchId !== 'all') {
      whereClause.branchId = branchId;
    }
    
    const tables = await Table.findAll({
      where: whereClause,
      attributes: ['status']
    });
    
    const stats = {
      total: tables.length,
      available: tables.filter(t => t.status === 'available').length,
      occupied: tables.filter(t => t.status === 'occupied').length,
      reserved: tables.filter(t => t.status === 'reserved').length,
      maintenance: tables.filter(t => t.status === 'maintenance').length
    };
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching table stats:', error);
    res.status(500).json({
      success: false,
      message: 'خطأ في جلب إحصائيات الطاولات'
    });
  }
});

module.exports = router;

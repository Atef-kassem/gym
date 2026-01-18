const DebitNote = require('../Model/debitNoteModel');
const DebitNoteItem = require('../Model/debitNoteItemModel');
const Supplier = require('../Model/schema/suppliersSchema');
const PurchaseOrder = require('../Model/schema/purchaseOrderSchema');
const PurchaseInvoice = require('../Model/schema/purchaseInvoiceSchema');
const { Op } = require('sequelize');
const sequelize = require('../Config/sequelize');

// إنشاء إشعار مدين جديد
const create = async (req, res) => {
  try {
    const {
      debit_number,
      debit_date,
      supplier_id,
      po_number,
      purchase_order_id,
      invoice_number,
      invoice_id,
      reason,
      reason_details,
      debit_amount,
      status,
      notes,
      branch_id,
      branch_name,
      created_by,
      items
    } = req.body;

    // إنشاء إشعار المدين
    const debitNote = await DebitNote.create({
      debit_number,
      debit_date,
      supplier_id,
      po_number,
      purchase_order_id,
      invoice_number,
      invoice_id,
      reason,
      reason_details,
      debit_amount,
      status,
      notes,
      branch_id,
      branch_name,
      created_by
    });

    // إنشاء الأصناف إذا وجدت
    if (items && Array.isArray(items) && items.length > 0) {
      const itemsToCreate = items.map(item => ({
        ...item,
        debit_note_id: debitNote.id
      }));
      
      await DebitNoteItem.bulkCreate(itemsToCreate);
    }

    // جلب الإشعار مع الأصناف
    const createdDebitNote = await DebitNote.findByPk(debitNote.id, {
      include: [
        { model: DebitNoteItem, as: 'items' },
        { model: Supplier, as: 'supplier' }
      ]
    });

    res.status(201).json({
      success: true,
      data: { debitNote: createdDebitNote }
    });
  } catch (error) {
    console.error('Error creating debit note:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// جلب قائمة إشعارات المدين
const list = async (req, res) => {
  try {
    const {
      status,
      supplier,
      dateFrom,
      dateTo,
      reason,
      amountFrom,
      amountTo,
      branch_id,
      page = 1,
      limit = 10,
      include
    } = req.query;

    const where = {};
    
    // فلترة حسب الحالة
    if (status && status !== 'all') {
      where.status = status;
    }
    
    // فلترة حسب المورد
    if (supplier) {
      where.supplier_id = supplier;
    }
    
    // فلترة حسب التاريخ
    if (dateFrom || dateTo) {
      where.debit_date = {};
      if (dateFrom) where.debit_date[Op.gte] = new Date(dateFrom);
      if (dateTo) where.debit_date[Op.lte] = new Date(dateTo);
    }
    
    // فلترة حسب السبب
    if (reason) {
      where.reason = { [Op.like]: `%${reason}%` };
    }
    
    // فلترة حسب المبلغ
    if (amountFrom || amountTo) {
      where.debit_amount = {};
      if (amountFrom) where.debit_amount[Op.gte] = parseFloat(amountFrom);
      if (amountTo) where.debit_amount[Op.lte] = parseFloat(amountTo);
    }
    
    // فلترة حسب الفرع
    if (branch_id) {
      where.branch_id = branch_id;
    }

    // بناء includes
    const includes = [];
    if (include) {
      const includeArray = include.split(',');
      includeArray.forEach(inc => {
        switch (inc.trim()) {
          case 'supplier':
            includes.push({ model: Supplier, as: 'supplier' });
            break;
          case 'purchaseOrder':
            includes.push({ model: PurchaseOrder, as: 'purchaseOrder' });
            break;
          case 'invoice':
            includes.push({ model: PurchaseInvoice, as: 'invoice' });
            break;
          case 'items':
            includes.push({ model: DebitNoteItem, as: 'items' });
            break;
        }
      });
    }

    // إضافة includes افتراضية
    if (includes.length === 0) {
      includes.push(
        { model: Supplier, as: 'supplier' },
        { model: DebitNoteItem, as: 'items' }
      );
    }

    const offset = (page - 1) * limit;
    
    const { count, rows } = await DebitNote.findAndCountAll({
      where,
      include: includes,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error listing debit notes:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// جلب إشعار مدين واحد
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const debitNote = await DebitNote.findByPk(id, {
      include: [
        { model: Supplier, as: 'supplier' },
        { model: PurchaseOrder, as: 'purchaseOrder' },
        { model: PurchaseInvoice, as: 'invoice' },
        { model: DebitNoteItem, as: 'items' }
      ]
    });

    if (!debitNote) {
      return res.status(404).json({
        success: false,
        message: 'إشعار المدين غير موجود'
      });
    }

    res.json({
      success: true,
      data: { debitNote }
    });
  } catch (error) {
    console.error('Error getting debit note:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// تحديث إشعار مدين
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const debitNote = await DebitNote.findByPk(id);
    if (!debitNote) {
      return res.status(404).json({
        success: false,
        message: 'إشعار المدين غير موجود'
      });
    }

    // تحديث البيانات الأساسية
    await debitNote.update(updateData);

    // تحديث الأصناف إذا وجدت
    if (updateData.items && Array.isArray(updateData.items)) {
      // حذف الأصناف القديمة
      await DebitNoteItem.destroy({ where: { debit_note_id: id } });
      
      // إنشاء الأصناف الجديدة
      const itemsToCreate = updateData.items.map(item => ({
        ...item,
        debit_note_id: id
      }));
      
      await DebitNoteItem.bulkCreate(itemsToCreate);
    }

    // جلب الإشعار المحدث
    const updatedDebitNote = await DebitNote.findByPk(id, {
      include: [
        { model: DebitNoteItem, as: 'items' },
        { model: Supplier, as: 'supplier' }
      ]
    });

    res.json({
      success: true,
      data: { debitNote: updatedDebitNote }
    });
  } catch (error) {
    console.error('Error updating debit note:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// حذف إشعار مدين
const remove = async (req, res) => {
  try {
    const { id } = req.params;
    
    const debitNote = await DebitNote.findByPk(id);
    if (!debitNote) {
      return res.status(404).json({
        success: false,
        message: 'إشعار المدين غير موجود'
      });
    }

    // حذف الأصناف أولاً
    await DebitNoteItem.destroy({ where: { debit_note_id: id } });
    
    // حذف الإشعار
    await debitNote.destroy();

    res.json({
      success: true,
      message: 'تم حذف إشعار المدين بنجاح'
    });
  } catch (error) {
    console.error('Error deleting debit note:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// تغيير حالة إشعار المدين
const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, approver, notes } = req.body;
    
    const debitNote = await DebitNote.findByPk(id);
    if (!debitNote) {
      return res.status(404).json({
        success: false,
        message: 'إشعار المدين غير موجود'
      });
    }

    const updateData = { status };
    
    if (status === 'معتمد') {
      updateData.approved_by = approver;
      updateData.approved_at = new Date();
    }
    
    if (status === 'مرسل للمورد') {
      updateData.sent_date = new Date();
    }
    
    if (notes) {
      updateData.notes = notes;
    }

    await debitNote.update(updateData);

    res.json({
      success: true,
      data: { debitNote },
      message: `تم تغيير حالة الإشعار إلى ${status}`
    });
  } catch (error) {
    console.error('Error changing debit note status:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// إرسال إشعار المدين للمورد
const sendToSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, cc, subject, message } = req.body;
    
    const debitNote = await DebitNote.findByPk(id, {
      include: [
        { model: Supplier, as: 'supplier' },
        { model: DebitNoteItem, as: 'items' }
      ]
    });
    
    if (!debitNote) {
      return res.status(404).json({
        success: false,
        message: 'إشعار المدين غير موجود'
      });
    }

    // هنا يمكن إضافة منطق إرسال البريد الإلكتروني
    // يمكن استخدام nodemailer أو أي خدمة بريد أخرى
    
    // تحديث حالة الإشعار
    await debitNote.update({
      status: 'مرسل للمورد',
      sent_date: new Date()
    });

    res.json({
      success: true,
      message: 'تم إرسال إشعار المدين للمورد بنجاح'
    });
  } catch (error) {
    console.error('Error sending debit note to supplier:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// جلب إحصائيات إشعارات المدين
const getStats = async (req, res) => {
  try {
    const { branch_id } = req.query;
    
    const where = {};
    if (branch_id) {
      where.branch_id = branch_id;
    }

    const totalDebits = await DebitNote.count({ where });
    const totalAmount = await DebitNote.sum('debit_amount', { where });
    
    const statusCounts = await DebitNote.findAll({
      where,
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    const reasonCounts = await DebitNote.findAll({
      where,
      attributes: [
        'reason',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['reason']
    });

    const supplierCounts = await DebitNote.findAll({
      where,
      include: [{ model: Supplier, as: 'supplier', attributes: ['name_ar'] }],
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['supplier.name_ar']
    });

    const stats = {
      totalDebits,
      totalAmount: totalAmount || 0,
      pendingApproval: statusCounts.find(s => s.status === 'بانتظار الموافقة')?.dataValues?.count || 0,
      approved: statusCounts.find(s => s.status === 'معتمد')?.dataValues?.count || 0,
      rejected: statusCounts.find(s => s.status === 'مرفوض')?.dataValues?.count || 0,
      sentToSupplier: statusCounts.find(s => s.status === 'مرسل للمورد')?.dataValues?.count || 0,
      averageAmount: totalDebits > 0 ? (totalAmount || 0) / totalDebits : 0,
      averageProcessingTime: 0, // يمكن حسابها لاحقاً
      reasonBreakdown: reasonCounts.reduce((acc, item) => {
        acc[item.reason] = parseInt(item.dataValues.count);
        return acc;
      }, {}),
      supplierBreakdown: supplierCounts.reduce((acc, item) => {
        const supplierName = item.supplier?.name_ar || 'غير محدد';
        acc[supplierName] = parseInt(item.dataValues.count);
        return acc;
      }, {})
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting debit note stats:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  create,
  list,
  getById,
  update,
  remove,
  changeStatus,
  sendToSupplier,
  getStats
};

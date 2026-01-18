const repo = require("../Model/repository/quickPurchaseOrderRepository");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { productsSchema } = require("../Model/index");
const inventoryRepository = require("../Model/repository/inventoryRepository");
const { Op } = require("sequelize");

class QuickPurchaseOrderController {
  // إنشاء أمر شراء سريع جديد
  create = catchAsync(async (req, res, next) => {
    const orderData = {
      ...req.body,
      createdBy: req.user?.id
    };

    const order = await repo.create(orderData);
    
    res.status(201).json({
      status: "success",
      message: "تم إنشاء أمر الشراء السريع بنجاح",
      data: order
    });
  });

  // جلب أمر شراء سريع بالمعرف
  get = catchAsync(async (req, res, next) => {
    const order = await repo.findById(req.params.id);
    
    if (!order) {
      return next(new AppError("أمر الشراء السريع غير موجود", 404));
    }

    res.status(200).json({
      status: "success",
      data: order
    });
  });

  // جلب قائمة أوامر الشراء السريعة
  list = catchAsync(async (req, res, next) => {
    const result = await repo.findAll(req.query);
    
    res.status(200).json({
      status: "success",
      results: result.orders.length,
      data: {
        orders: result.orders,
        pagination: result.pagination
      }
    });
  });

  // تحديث أمر شراء سريع
  update = catchAsync(async (req, res, next) => {
    const updated = await repo.update(req.params.id, req.body);
    
    if (!updated) {
      return next(new AppError("أمر الشراء السريع غير موجود", 404));
    }

    res.status(200).json({
      status: "success",
      message: "تم تحديث أمر الشراء السريع بنجاح",
      data: updated
    });
  });

  // حذف أمر شراء سريع
  delete = catchAsync(async (req, res, next) => {
    const result = await repo.delete(req.params.id);
    
    res.status(200).json({
      status: "success",
      message: result.message
    });
  });

  // جلب الإحصائيات
  statistics = catchAsync(async (req, res, next) => {
    const stats = await repo.getStatistics(req.query);
    
    res.status(200).json({
      status: "success",
      data: stats
    });
  });

  // تغيير حالة أمر الشراء
  changeStatus = catchAsync(async (req, res, next) => {
    const { status } = req.body;
    
    if (!status) {
      return next(new AppError("يجب تحديد الحالة", 400));
    }

    // جلب أمر الشراء القديم لمعرفة الحالة السابقة
    const oldOrder = await repo.findById(req.params.id);
    
    if (!oldOrder) {
      return next(new AppError("أمر الشراء السريع غير موجود", 404));
    }

    const oldStatus = oldOrder.status;
    const newStatus = status;

    // تحديث حالة أمر الشراء
    const updated = await repo.update(req.params.id, { status: newStatus });

    // إذا تغيرت الحالة إلى "مؤكد"، أضف الكمية للمخزون
    if (oldStatus !== "مؤكد" && newStatus === "مؤكد") {
      try {
        const quantity = parseFloat(updated.quantity) || 0;
        const productId = updated.productId;
        const productName = updated.productName;

        if (quantity > 0) {
          let product = null;
          
          // البحث عن المنتج - أولاً بـ productId إن وُجد، وإلا بالاسم
          if (productId) {
            try {
              // محاولة البحث بـ product_id كـ STRING
              product = await productsSchema.findOne({ where: { product_id: productId.toString() } });
              if (!product) {
                // إذا لم نجد، نحاول البحث بـ id كـ INTEGER (إذا كان هناك id آخر)
                product = await productsSchema.findOne({ 
                  where: { 
                    [Op.or]: [
                      { product_id: productId.toString() },
                      { id: parseInt(productId) }
                    ]
                  } 
                });
              }
            } catch (err) {
              console.warn(`⚠️ خطأ في البحث عن المنتج بـ productId: ${err.message}`);
            }
          }
          
          // إذا لم نجد المنتج بـ productId، نبحث بالاسم
          if (!product && productName) {
            try {
              product = await productsSchema.findOne({ 
                where: { 
                  [Op.or]: [
                    { name_ar: productName },
                    { name_en: productName }
                  ]
                } 
              });
              
              if (product) {
                console.log(`✅ تم العثور على المنتج بالاسم: ${productName} -> ${product.product_id}`);
              }
            } catch (err) {
              console.warn(`⚠️ خطأ في البحث عن المنتج بالاسم: ${err.message}`);
            }
          }
          
          if (product) {
            // تحديث current_stock في جدول المنتجات
            const currentStock = parseFloat(product.current_stock) || 0;
            const newStock = currentStock + quantity;
            
            console.log(`📦 تحديث المخزون: ${product.name_ar || product.name_en || productName}`);
            console.log(`   الكمية الحالية: ${currentStock}`);
            console.log(`   الكمية المضافة: ${quantity}`);
            console.log(`   الكمية الجديدة: ${newStock}`);
            
            await productsSchema.update(
              { current_stock: newStock },
              { where: { product_id: product.product_id } }
            );

            console.log(`✅ تم تحديث المخزون بنجاح للمنتج ${product.product_id}`);

            // تحديث المخزون في جدول Inventory إذا كان هناك warehouseId
            if (product.warehouse_id) {
              try {
                await inventoryRepository.updateStock(product.product_id, product.warehouse_id, quantity);
                console.log(`✅ تم تحديث جدول Inventory أيضاً`);
              } catch (inventoryError) {
                console.warn(`⚠️ تحذير: لم يتم تحديث جدول Inventory: ${inventoryError.message}`);
                // لا نوقف العملية إذا فشل تحديث Inventory
              }
            } else {
              console.log(`   ملاحظة: لا يوجد warehouse_id للمنتج، تم تحديث current_stock فقط`);
            }
          } else {
            console.warn(`⚠️ تحذير: المنتج غير موجود - productId: ${productId || 'null'}, productName: ${productName || 'null'}`);
            console.warn(`   يرجى التأكد من أن المنتج موجود في قاعدة البيانات قبل تأكيد أمر الشراء`);
          }
        } else {
          console.warn(`⚠️ تحذير: الكمية غير صالحة - quantity: ${quantity}`);
        }
      } catch (error) {
        console.error(`❌ خطأ في تحديث المخزون: ${error.message}`);
        console.error(error.stack);
        // لا نوقف العملية، فقط نسجل الخطأ
      }
    }
    // إذا تغيرت الحالة من "مؤكد" إلى غير "مؤكد" (إلغاء)، اطرح الكمية من المخزون
    else if (oldStatus === "مؤكد" && newStatus !== "مؤكد") {
      try {
        const quantity = parseFloat(updated.quantity) || 0;
        const productId = updated.productId;
        const productName = updated.productName;

        if (quantity > 0) {
          let product = null;
          
          // البحث عن المنتج - أولاً بـ productId إن وُجد، وإلا بالاسم
          if (productId) {
            try {
              product = await productsSchema.findOne({ where: { product_id: productId.toString() } });
              if (!product) {
                product = await productsSchema.findOne({ 
                  where: { 
                    [Op.or]: [
                      { product_id: productId.toString() },
                      { id: parseInt(productId) }
                    ]
                  } 
                });
              }
            } catch (err) {
              console.warn(`⚠️ خطأ في البحث عن المنتج بـ productId: ${err.message}`);
            }
          }
          
          // إذا لم نجد المنتج بـ productId، نبحث بالاسم
          if (!product && productName) {
            try {
              product = await productsSchema.findOne({ 
                where: { 
                  [Op.or]: [
                    { name_ar: productName },
                    { name_en: productName }
                  ]
                } 
              });
            } catch (err) {
              console.warn(`⚠️ خطأ في البحث عن المنتج بالاسم: ${err.message}`);
            }
          }
          
          if (product) {
            const currentStock = parseFloat(product.current_stock) || 0;
            const newStock = Math.max(0, currentStock - quantity); // تأكد من عدم السالب
            
            console.log(`📦 إلغاء تحديث المخزون: ${product.name_ar || product.name_en || productName}`);
            console.log(`   الكمية الحالية: ${currentStock}`);
            console.log(`   الكمية المطروحة: ${quantity}`);
            console.log(`   الكمية الجديدة: ${newStock}`);
            
            await productsSchema.update(
              { current_stock: newStock },
              { where: { product_id: product.product_id } }
            );

            // تحديث المخزون في جدول Inventory
            if (product.warehouse_id) {
              try {
                await inventoryRepository.updateStock(product.product_id, product.warehouse_id, -quantity);
              } catch (inventoryError) {
                console.warn(`⚠️ تحذير: لم يتم تحديث جدول Inventory: ${inventoryError.message}`);
              }
            }
          } else {
            console.warn(`⚠️ تحذير: المنتج غير موجود عند الإلغاء - productId: ${productId || 'null'}, productName: ${productName || 'null'}`);
          }
        }
      } catch (error) {
        console.error(`❌ خطأ في تحديث المخزون عند الإلغاء: ${error.message}`);
        console.error(error.stack);
      }
    }
    
    res.status(200).json({
      status: "success",
      message: "تم تغيير حالة أمر الشراء السريع بنجاح",
      data: updated
    });
  });
}

module.exports = new QuickPurchaseOrderController();


const { Op } = require("sequelize");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const APIFeatures = require("../utils/apiFeatures");
const productsRepo = require("../Model/repository/productsRepository");
const inventoryRepo = require("../Model/repository/inventoryRepository");
const warehousesRepo = require("../Model/repository/warehousesRepository");
const productBranchesRepo = require("../Model/repository/productBranchesRepository");
const categoriesRepo = require("../Model/repository/categoriesRepository");
const { uploadFilesLocally } = require("../middlewares/fileUpload");
// const { productsSchema } = require("../Model/index");

// حقول الملفات للمنتجات
const productFileFields = ["image"];

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const {
    page,
    limit,
    search,
    categoryId,
    brandId,
    status,
    warehouseId,
    expiryDate,
    batchNumber,
    sortBy,
    sortOrder,
  } = req.query;

  const { products, pagination } = await productsRepo.findAll({
    page,
    limit,
    search,
    categoryId,
    brandId,
    status,
    warehouseId,
    expiryDate,
    batchNumber,
    sortBy,
    sortOrder,
  });

  res.status(200).json({
    status: "success",
    results: products.length,
    total: pagination.total,
    data: {
      products,
      pagination,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await productsRepo.findByIdWithDetails(req.params.id);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const inventory = await inventoryRepo.findByProductId(req.params.id);

  const productBranches = await productBranchesRepo.findByProductId(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      product,
      inventory,
      productBranches,
    },
  });
});

// Search products
exports.searchProducts = catchAsync(async (req, res, next) => {
  const { q } = req.query;
  
  if (!q) {
    return next(new AppError("Search query is required", 400));
  }

  const products = await productsRepo.search(q);

  res.status(200).json({
    status: "success",
    results: products.length,
    data: products
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  try {
    // التحقق من الحقول المطلوبة
    const { product_id, name_ar, selling_price, current_stock } = req.body;
    
    if (!product_id || !product_id.trim()) {
      return next(new AppError("كود المنتج مطلوب", 400));
    }
    
    if (!name_ar || !name_ar.trim()) {
      return next(new AppError("اسم المنتج مطلوب", 400));
    }
    
    if (!selling_price || parseFloat(selling_price) <= 0) {
      return next(new AppError("سعر المنتج مطلوب ويجب أن يكون أكبر من الصفر", 400));
    }
    
    if (current_stock === undefined || current_stock === null || parseInt(current_stock) < 0) {
      return next(new AppError("كمية المنتج مطلوبة ويجب أن تكون أكبر من أو تساوي الصفر", 400));
    }

    // معالجة رفع الصور إذا كانت موجودة
    let imageUrl = null;
    if (req.files && Object.keys(req.files).length > 0) {
      try {
        console.log('📦 الملفات المستلمة:', req.files);
        const uploadedFiles = await uploadFilesLocally(req.files, productFileFields);
        console.log('📤 الملفات المرفوعة:', uploadedFiles);
        uploadedFiles.forEach((file) => {
          if (file.fieldName === 'image') {
            imageUrl = file.link;
          }
        });
        console.log('✅ تم رفع صورة المنتج:', imageUrl);
      } catch (error) {
        console.error('❌ خطأ في رفع الصورة:', error);
      }
    }

  const {
    name_en,
    description,
    barcode,
    category_id,
    brand_id,
    manufacturer_id,
    supplier_id,
    cost_price,
    wholesale_price,
    weight_kg,
    dimensions,
    status,
    unit_of_measure,
    model,
    notes,
    // حقول المخزون
    min_stock,
    max_stock,
    reorder_point,
    warehouse_id,
    shelf_location,
    apply_to_all_branches,
    // حقول إضافية
    expiry_date,
    batch_number,
    color,
    size,
    material,
    warranty_period,
  } = req.body;

  

  const existingProduct = await productsRepo.findBySku(product_id);
  if (existingProduct) {
    return next(new AppError("المنتج بهذا الكود موجود بالفعل", 400));
  }

  // التحقق من وجود category_id إذا كان محدداً
  let finalCategoryId = null;
  if (category_id && category_id !== "" && category_id !== "null") {
    const category = await categoriesRepo.findById(category_id);
    if (!category) {
      return next(new AppError(`التصنيف المحدد (${category_id}) غير موجود في قاعدة البيانات`, 400));
    }
    finalCategoryId = parseInt(category_id);
  }

  const product = await productsRepo.create({
    product_id,
    name_ar,
    name_en: name_en || name_ar || null, // استخدام name_ar كقيمة افتراضية
    description: description || null,
    barcode: barcode || null,
    category_id: finalCategoryId, // استخدام null إذا لم يكن category_id موجوداً أو غير صحيح
    brand_id: brand_id || null,
    manufacturer_id: manufacturer_id || null,
    supplier_id: supplier_id || null,
    selling_price,
    cost_price: cost_price || 0, // قيمة افتراضية
    wholesale_price: wholesale_price || null,
    weight_kg: weight_kg || null,
    dimensions: dimensions || null,
    status: status || "active",
    unit_of_measure: unit_of_measure || "وحدة", // قيمة افتراضية
    model: model || null,
    notes: notes || null,
    // حقول المخزون
    current_stock: current_stock !== undefined && current_stock !== null ? parseInt(current_stock) : 0,
    min_stock: min_stock || 1,
    max_stock: max_stock || 1000,
    reorder_point: reorder_point || 10,
    warehouse_id: warehouse_id || null,
    shelf_location: shelf_location || null,
    apply_to_all_branches: apply_to_all_branches || false,
    // حقول إضافية
    expiry_date: expiry_date || null,
    batch_number: batch_number || null,
    image_url: imageUrl || null, // استخدام imageUrl من رفع الملف
    color: color || null,
    size: size || null,
    material: material || null,
    warranty_period: warranty_period || null,
  });
  
 

    res.status(201).json({
      status: "success",
      data: {
        product,
      },
    });
  } catch (error) {
    console.error('❌ خطأ في إنشاء المنتج:', error);
    console.error('Stack:', error.stack);
    return next(new AppError(`Failed to create product: ${error.message}`, 500));
  }
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await productsRepo.findById(id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // معالجة رفع الصور إذا كانت موجودة
  if (req.files && Object.keys(req.files).length > 0) {
    try {
      console.log('📦 الملفات المستلمة للتحديث:', req.files);
      const uploadedFiles = await uploadFilesLocally(req.files, productFileFields);
      console.log('📤 الملفات المرفوعة:', uploadedFiles);
      uploadedFiles.forEach((file) => {
        if (file.fieldName === 'image') {
          req.body.image_url = file.link;
        }
      });
      console.log('✅ تم رفع صورة المنتج:', req.body.image_url);
    } catch (error) {
      console.error('❌ خطأ في رفع الصورة:', error);
    }
  }

  if (req.body.product_id && req.body.product_id !== product.product_id) {
    const existingProduct = await productsRepo.findBySku(req.body.product_id);
    if (existingProduct) {
      return next(new AppError("Product with this SKU already exists", 400));
    }
  }

  if (req.body.dimensions) {
    req.body.dimensions = JSON.stringify(req.body.dimensions);
  }

  const updatedProduct = await productsRepo.update(id, req.body);

  res.status(200).json({
    status: "success",
    data: {
      product: updatedProduct,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await productsRepo.findById(id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const inventoryCount = await inventoryRepo.countByProductId(id);
  if (inventoryCount > 0) {
    return next(new AppError("Cannot delete product with existing inventory records", 400));
  }

  const productBranchesCount = await productBranchesRepo.countByProductId(id);
  if (productBranchesCount > 0) {
    return next(new AppError("Cannot delete product with existing product branches", 400));
  }

  await productsRepo.delete(id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getProductsByCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;

  const products = await productsRepo.findByCategory(categoryId);

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getProductsByBrand = catchAsync(async (req, res, next) => {
  const { brandId } = req.params;

  const products = await productsRepo.findByBrand(brandId);

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

exports.searchProducts = catchAsync(async (req, res, next) => {
  const { q } = req.query;

  if (!q) {
    return next(new AppError("Please provide a search query", 400));
  }

  const products = await productsRepo.search(q);

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getLowStockProducts = catchAsync(async (req, res, next) => {
  const products = await productsRepo.findLowStock();

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getProductInventory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const inventory = await inventoryRepo.findByProductWithWarehouse(id);

  res.status(200).json({
    status: "success",
    data: {
      inventory,
    },
  });
});

exports.updateProductStock = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { warehouse_id, quantity, operation_type, notes } = req.body;

  if (!["add", "subtract", "set"].includes(operation_type)) {
    return next(new AppError("Invalid operation type. Use: add, subtract, or set", 400));
  }

  const product = await productsRepo.findById(id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const warehouse = await warehousesRepo.findById(warehouse_id);
  if (!warehouse) {
    return next(new AppError("Warehouse not found", 404));
  }

  const updatedInventory = await inventoryRepo.updateStock(id, warehouse_id, quantity, operation_type, notes);

  res.status(200).json({
    status: "success",
    data: {
      inventory: updatedInventory,
    },
  });
});

exports.getProductStats = catchAsync(async (req, res, next) => {
  const stats = await productsRepo.getStatistics();

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

exports.bulkUpdateProducts = catchAsync(async (req, res, next) => {
  const { productIds, updates } = req.body;

  if (!Array.isArray(productIds) || productIds.length === 0) {
    return next(new AppError("Please provide an array of product IDs", 400));
  }

  const results = await productsRepo.bulkUpdate(productIds, updates);

  res.status(200).json({
    status: "success",
    data: {
      updated: results.updated,
      failed: results.failed,
    },
  });
});

exports.exportProducts = catchAsync(async (req, res, next) => {
  const { format = "csv" } = req.query;

  const products = await productsRepo.findAllWithDetails();

  res.setHeader("Content-Type", format === "csv" ? "text/csv" : "application/json");
  res.setHeader("Content-Disposition", `attachment; filename="products.${format}"`);

  if (format === "csv") {
    const csv = products.map((p) => ({
      id: p.id,
      name: p.name,
      sku: p.sku,
      category: p.category?.name || "",
      brand: p.brand?.name || "",
      price: p.unit_price,
      stock: p.total_stock || 0,
      status: p.status,
    }));

    const headers = Object.keys(csv[0]).join(",");
    const rows = csv.map((row) => Object.values(row).join(","));
    const csvContent = [headers, ...rows].join("\n");

    res.send(csvContent);
  } else {
    res.json(products);
  }
});

exports.importProducts = catchAsync(async (req, res, next) => {
  const { products } = req.body;

  if (!Array.isArray(products) || products.length === 0) {
    return next(new AppError("Please provide an array of products to import", 400));
  }

  const results = await productsRepo.bulkImport(products);

  res.status(200).json({
    status: "success",
    data: {
      imported: results.imported,
      failed: results.failed,
    },
  });
});

exports.getProductWithInventory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await productsRepo.findByIdWithDetails(id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const inventory = await inventoryRepo.findByProductWithWarehouse(id);

  res.status(200).json({
    status: "success",
    data: {
      product,
      inventory,
    },
  });
});

exports.getProductsByWarehouse = catchAsync(async (req, res, next) => {
  const { warehouseId } = req.params;

  const products = await productsRepo.findByWarehouse(warehouseId);

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getProductPricing = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await productsRepo.findById(id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const pricing = {
    unit_price: product.unit_price,
    cost_price: product.cost_price,
    profit_margin: (((product.unit_price - product.cost_price) / product.cost_price) * 100).toFixed(2),
    tax_rate: product.tax_rate,
    final_price: product.unit_price * (1 + product.tax_rate / 100),
  };

  res.status(200).json({
    status: "success",
    data: {
      pricing,
    },
  });
});

exports.getProductAvailability = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const product = await productsRepo.findById(id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  const availability = await productsRepo.getAvailability(id);

  res.status(200).json({
    status: "success",
    data: {
      availability,
    },
  });
});

exports.getProductMovementHistory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { start_date, end_date } = req.query;

  const history = await inventoryRepo.getMovementHistory(id, start_date, end_date);

  res.status(200).json({
    status: "success",
    data: {
      history,
    },
  });
});

// Update product stock quantity (for stock taking)
exports.updateProductStock = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { warehouseId, quantity } = req.body;

  if (!warehouseId || quantity === undefined || quantity === null) {
    return next(new AppError("Warehouse ID and quantity are required", 400));
  }

  // التحقق من أن المنتج موجود
  const product = await productsRepo.findById(id);
  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // تحديث الكمية في جدول المخزون
  const updatedInventory = await inventoryRepo.setStock(id, warehouseId, parseFloat(quantity));

  // تحديث current_stock في جدول المنتجات أيضاً
  await productsRepo.update(id, { current_stock: parseFloat(quantity) });

  res.status(200).json({
    status: "success",
    data: {
      inventory: updatedInventory,
    },
  });
});

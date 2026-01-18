const OpeningStock = require("../Model/openingStockModel");
const Product = require("../Model/schema/productsSchema");
const SparePart = require("../Model/sparePartModel");
const Branch = require("../Model/branchesModel");
const Warehouse = require("../Model/schema/warehousesSchema");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Create opening stock
exports.createOpeningStock = catchAsync(async (req, res, next) => {
  const {
    opening_stock_date,
    item_code,
    quantity,
    unit_cost,
    total_cost,
    notes,
    branch_id,
    warehouse_id,
    product_id,
    spare_part_id,
  } = req.body;

  // Validate required fields
  if (!item_code || !quantity || !unit_cost || !total_cost || !branch_id || !warehouse_id) {
    return next(new AppError("Please provide all required fields", 400));
  }

  // Validate branch exists
  const branch = await Branch.findByPk(branch_id);
  if (!branch) {
    return next(new AppError("Branch not found", 404));
  }

  // Validate warehouse exists
  const warehouse = await Warehouse.findByPk(warehouse_id);
  if (!warehouse) {
    return next(new AppError("Warehouse not found", 404));
  }

  // Validate product if provided
  if (product_id) {
    const product = await Product.findByPk(product_id);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }
  }

  // Validate spare part if provided
  if (spare_part_id) {
    const sparePart = await SparePart.findByPk(spare_part_id);
    if (!sparePart) {
      return next(new AppError("Spare part not found", 404));
    }
  }

  const openingStock = await OpeningStock.create({
    opening_stock_date,
    item_code,
    quantity,
    unit_cost,
    total_cost,
    notes,
    branch_id,
    warehouse_id,
    product_id,
    spare_part_id,
  });

  res.status(201).json({
    status: "success",
    data: {
      openingStock,
    },
  });
});

// Get all opening stocks
exports.getAllOpeningStocks = catchAsync(async (req, res, next) => {
  const openingStocks = await OpeningStock.findAll({
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["product_id", "name_ar", "name_en"],
      },
      {
        model: SparePart,
        as: "sparePart",
        attributes: ["id", "arabicName", "englishName"],
      },
      {
        model: Branch,
        as: "branch",
        attributes: ["id", "arabicName", "englishName"],
      },
      {
        model: Warehouse,
        as: "warehouse",
        attributes: ["warehouse_id", "name_ar", "name_en"],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  res.status(200).json({
    status: "success",
    results: openingStocks.length,
    data: {
      openingStocks,
    },
  });
});

// Get opening stock by ID
exports.getOpeningStock = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const openingStock = await OpeningStock.findByPk(id, {
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["product_id", "name_ar", "name_en"],
      },
      {
        model: SparePart,
        as: "sparePart",
        attributes: ["id", "arabicName", "englishName"],
      },
      {
        model: Branch,
        as: "branch",
        attributes: ["id", "arabicName", "englishName"],
      },
      {
        model: Warehouse,
        as: "warehouse",
        attributes: ["warehouse_id", "name_ar", "name_en"],
      },
    ],
  });

  if (!openingStock) {
    return next(new AppError("Opening stock not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      openingStock,
    },
  });
});

// Update opening stock
exports.updateOpeningStock = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    opening_stock_date,
    item_code,
    quantity,
    unit_cost,
    total_cost,
    notes,
    branch_id,
    warehouse_id,
    product_id,
    spare_part_id,
  } = req.body;

  const openingStock = await OpeningStock.findByPk(id);

  if (!openingStock) {
    return next(new AppError("Opening stock not found", 404));
  }

  // Validate branch if provided
  if (branch_id) {
    const branch = await Branch.findByPk(branch_id);
    if (!branch) {
      return next(new AppError("Branch not found", 404));
    }
  }

  // Validate warehouse if provided
  if (warehouse_id) {
    const warehouse = await Warehouse.findByPk(warehouse_id);
    if (!warehouse) {
      return next(new AppError("Warehouse not found", 404));
    }
  }

  // Validate product if provided
  if (product_id) {
    const product = await Product.findByPk(product_id);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }
  }

  // Validate spare part if provided
  if (spare_part_id) {
    const sparePart = await SparePart.findByPk(spare_part_id);
    if (!sparePart) {
      return next(new AppError("Spare part not found", 404));
    }
  }

  await openingStock.update({
    opening_stock_date,
    item_code,
    quantity,
    unit_cost,
    total_cost,
    notes,
    branch_id,
    warehouse_id,
    product_id,
    spare_part_id,
  });

  res.status(200).json({
    status: "success",
    data: {
      openingStock,
    },
  });
});

// Delete opening stock
exports.deleteOpeningStock = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const openingStock = await OpeningStock.findByPk(id);

  if (!openingStock) {
    return next(new AppError("Opening stock not found", 404));
  }

  await openingStock.destroy();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Get opening stocks by branch
exports.getOpeningStocksByBranch = catchAsync(async (req, res, next) => {
  const { branchId } = req.params;

  const openingStocks = await OpeningStock.findAll({
    where: { branch_id: branchId },
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["product_id", "name_ar", "name_en"],
      },
      {
        model: SparePart,
        as: "sparePart",
        attributes: ["id", "arabicName", "englishName"],
      },
      {
        model: Branch,
        as: "branch",
        attributes: ["id", "arabicName", "englishName"],
      },
      {
        model: Warehouse,
        as: "warehouse",
        attributes: ["warehouse_id", "name_ar", "name_en"],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  res.status(200).json({
    status: "success",
    results: openingStocks.length,
    data: {
      openingStocks,
    },
  });
});

// Get opening stocks by warehouse
exports.getOpeningStocksByWarehouse = catchAsync(async (req, res, next) => {
  const { warehouseId } = req.params;

  const openingStocks = await OpeningStock.findAll({
    where: { warehouse_id: warehouseId },
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["product_id", "name_ar", "name_en"],
      },
      {
        model: SparePart,
        as: "sparePart",
        attributes: ["id", "arabicName", "englishName"],
      },
      {
        model: Branch,
        as: "branch",
        attributes: ["id", "arabicName", "englishName"],
      },
      {
        model: Warehouse,
        as: "warehouse",
        attributes: ["warehouse_id", "name_ar", "name_en"],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  res.status(200).json({
    status: "success",
    results: openingStocks.length,
    data: {
      openingStocks,
    },
  });
});

// Get opening stocks with pagination
exports.getOpeningStocksPaginated = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100000;
  const offset = (page - 1) * limit;

  const { count, rows: openingStocks } = await OpeningStock.findAndCountAll({
    include: [
      {
        model: Product,
        as: "product",
        attributes: ["product_id", "name_ar", "name_en"],
      },
      {
        model: SparePart,
        as: "sparePart",
        attributes: ["id", "arabicName", "englishName"],
      },
      {
        model: Branch,
        as: "branch",
        attributes: ["id", "arabicName", "englishName"],
      },
      {
        model: Warehouse,
        as: "warehouse",
        attributes: ["warehouse_id", "name_ar", "name_en"],
      },
    ],
    limit,
    offset,
    order: [["created_at", "DESC"]],
  });

  res.status(200).json({
    status: "success",
    data: {
      openingStocks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
    },
  });
});

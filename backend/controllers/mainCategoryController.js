const MainCategory = require("../Model/mainCategoryModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const factory = require("./factoryHandler");

// Create main category
exports.createMainCategory = catchAsync(async (req, res, next) => {
  const { name, description, image, isActive } = req.body;

  const mainCategory = await MainCategory.create({
    name,
    description,
    image,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    status: "success",
    data: {
      mainCategory,
    },
  });
});

// Get all main categories
exports.getAllMainCategories = catchAsync(async (req, res, next) => {
  const mainCategories = await MainCategory.findAll({
    where: { isActive: true },
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    status: "success",
    results: mainCategories.length,
    data: {
      mainCategories,
    },
  });
});

// Get main category by ID
exports.getMainCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const mainCategory = await MainCategory.findByPk(id);

  if (!mainCategory) {
    return next(new AppError("Main category not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      mainCategory,
    },
  });
});

// Update main category
exports.updateMainCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, image, isActive } = req.body;

  const mainCategory = await MainCategory.findByPk(id);

  if (!mainCategory) {
    return next(new AppError("Main category not found", 404));
  }

  await mainCategory.update({
    name,
    description,
    image,
    isActive,
  });

  res.status(200).json({
    status: "success",
    data: {
      mainCategory,
    },
  });
});

// Delete main category
exports.deleteMainCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const mainCategory = await MainCategory.findByPk(id);

  if (!mainCategory) {
    return next(new AppError("Main category not found", 404));
  }

  await mainCategory.destroy();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Get main categories with pagination
exports.getMainCategoriesPaginated = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100000;
  const offset = (page - 1) * limit;

  const { count, rows: mainCategories } = await MainCategory.findAndCountAll({
    where: { isActive: true },
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    status: "success",
    data: {
      mainCategories,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
    },
  });
});

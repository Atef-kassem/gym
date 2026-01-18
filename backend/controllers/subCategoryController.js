const SubCategory = require("../Model/subCategoryModel");
const MainCategory = require("../Model/mainCategoryModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Create sub category
exports.createSubCategory = catchAsync(async (req, res, next) => {
  const { name, description, mainCategory_Id, image, isActive } = req.body;

  // Check if main category exists
  const mainCategory = await MainCategory.findByPk(mainCategory_Id);
  if (!mainCategory) {
    return next(new AppError("Main category not found", 404));
  }

  const subCategory = await SubCategory.create({
    name,
    description,
    mainCategory_Id,
    image,
    isActive: isActive !== undefined ? isActive : true,
  });

  res.status(201).json({
    status: "success",
    data: {
      subCategory,
    },
  });
});

// Get all sub categories
exports.getAllSubCategories = catchAsync(async (req, res, next) => {
  const subCategories = await SubCategory.findAll({
    where: { isActive: true },
    include: [
      {
        model: MainCategory,
        as: "mainCategory",
        attributes: ["id", "name"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    status: "success",
    results: subCategories.length,
    data: {
      subCategories,
    },
  });
});

// Get sub category by ID
exports.getSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  console.log(`Fetching sub-category with ID: ${id}`);

  const subCategory = await SubCategory.findByPk(id, {
    include: [
      {
        model: MainCategory,
        as: "mainCategory",
        attributes: ["id", "name"],
      },
    ],
  });

  if (!subCategory) {
    console.log(`Sub-category with ID ${id} not found`);
    return next(new AppError(`Sub category with ID ${id} not found`, 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      subCategory,
    },
  });
});

// Update sub category
exports.updateSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, mainCategory_Id, image, isActive } = req.body;

  const subCategory = await SubCategory.findByPk(id);

  if (!subCategory) {
    return next(new AppError("Sub category not found", 404));
  }

  // Check if main category exists if provided
  if (mainCategory_Id) {
    const mainCategory = await MainCategory.findByPk(mainCategory_Id);
    if (!mainCategory) {
      return next(new AppError("Main category not found", 404));
    }
  }

  await subCategory.update({
    name,
    description,
    mainCategory_Id,
    image,
    isActive,
  });

  res.status(200).json({
    status: "success",
    data: {
      subCategory,
    },
  });
});

// Delete sub category
exports.deleteSubCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const subCategory = await SubCategory.findByPk(id);

  if (!subCategory) {
    return next(new AppError("Sub category not found", 404));
  }

  await subCategory.destroy();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Get sub categories by main category
exports.getSubCategoriesByMainCategory = catchAsync(async (req, res, next) => {
  const { mainCategoryId } = req.params;

  const subCategories = await SubCategory.findAll({
    where: {
      mainCategory_Id: mainCategoryId,
      isActive: true,
    },
    include: [
      {
        model: MainCategory,
        as: "mainCategory",
        attributes: ["id", "name"],
      },
    ],
    order: [["name", "ASC"]],
  });

  res.status(200).json({
    status: "success",
    results: subCategories.length,
    data: {
      subCategories,
    },
  });
});

// Get sub categories with pagination
exports.getSubCategoriesPaginated = catchAsync(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 100000;
  const offset = (page - 1) * limit;

  const { count, rows: subCategories } = await SubCategory.findAndCountAll({
    where: { isActive: true },
    include: [
      {
        model: MainCategory,
        attributes: ["id", "name"],
      },
    ],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json({
    status: "success",
    data: {
      subCategories,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalItems: count,
        itemsPerPage: limit,
      },
    },
  });
});

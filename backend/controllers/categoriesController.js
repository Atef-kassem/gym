const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const categoriesRepository = require("../Model/repository/categoriesRepository");

class CategoriesController {
  getAllCategories = catchAsync(async (req, res, next) => {
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 1000000,
      search: req.query.search || "",
      parentId: req.query.parentId,
      isActive: req.query.isActive !== undefined ? req.query.isActive === "true" : undefined,
      sortBy: req.query.sortBy || "name_en",
      sortOrder: req.query.sortOrder || "ASC",
    };

    const result = await categoriesRepository.findAll(options);

    res.status(200).json({
      status: "success",
      data: {
        categories: result.categories,
        pagination: result.pagination,
      },
    });
  });

  getCategory = catchAsync(async (req, res, next) => {
    const category = await categoriesRepository.findById(req.params.id);

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { category },
    });
  });

  createCategory = catchAsync(async (req, res, next) => {
    const category = await categoriesRepository.create(req.body);

    res.status(201).json({
      status: "success",
      data: { category },
    });
  });

  updateCategory = catchAsync(async (req, res, next) => {
    const category = await categoriesRepository.update(req.params.id, req.body);

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { category },
    });
  });

  deleteCategory = catchAsync(async (req, res, next) => {
    const deleted = await categoriesRepository.delete(req.params.id);

    if (!deleted) {
      return next(new AppError("Category not found", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

  getRootCategories = catchAsync(async (req, res, next) => {
    const categories = await categoriesRepository.findRootCategories();

    res.status(200).json({
      status: "success",
      data: { categories },
    });
  });

  getChildrenCategories = catchAsync(async (req, res, next) => {
    const categories = await categoriesRepository.findChildren(req.params.id);

    res.status(200).json({
      status: "success",
      data: { categories },
    });
  });
}

module.exports = new CategoriesController();

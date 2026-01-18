const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const brandsRepository = require("../Model/repository/brandsRepository");

class BrandsController {
  getAllBrands = catchAsync(async (req, res, next) => {
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 1000000,
      search: req.query.search || "",
      isActive: req.query.isActive !== undefined ? req.query.isActive === "true" : undefined,
      sortBy: req.query.sortBy || "name_en",
      sortOrder: req.query.sortOrder || "ASC",
    };

    const result = await brandsRepository.findAll(options);

    res.status(200).json({
      status: "success",
      data: {
        brands: result.brands,
        pagination: result.pagination,
      },
    });
  });

  getBrand = catchAsync(async (req, res, next) => {
    const brand = await brandsRepository.findById(req.params.id);

    if (!brand) {
      return next(new AppError("Brand not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { brand },
    });
  });

  createBrand = catchAsync(async (req, res, next) => {
    const brand = await brandsRepository.create(req.body);

    res.status(201).json({
      status: "success",
      data: { brand },
    });
  });

  updateBrand = catchAsync(async (req, res, next) => {
    const brand = await brandsRepository.update(req.params.id, req.body);

    if (!brand) {
      return next(new AppError("Brand not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { brand },
    });
  });

  deleteBrand = catchAsync(async (req, res, next) => {
    const deleted = await brandsRepository.delete(req.params.id);

    if (!deleted) {
      return next(new AppError("Brand not found", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
}

module.exports = new BrandsController();

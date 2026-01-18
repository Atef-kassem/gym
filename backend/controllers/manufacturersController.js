const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const manufacturersRepository = require("../Model/repository/manufacturersRepository");

class ManufacturersController {
  getAllManufacturers = catchAsync(async (req, res, next) => {
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 1000000,
      search: req.query.search || "",
      isActive: req.query.isActive !== undefined ? req.query.isActive === "true" : undefined,
      sortBy: req.query.sortBy || "name_en",
      sortOrder: req.query.sortOrder || "ASC",
    };

    const result = await manufacturersRepository.findAll(options);

    res.status(200).json({
      status: "success",
      data: {
        manufacturers: result.manufacturers,
        pagination: result.pagination,
      },
    });
  });

  getManufacturer = catchAsync(async (req, res, next) => {
    const manufacturer = await manufacturersRepository.findById(req.params.id);

    if (!manufacturer) {
      return next(new AppError("Manufacturer not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { manufacturer },
    });
  });

  createManufacturer = catchAsync(async (req, res, next) => {
    const manufacturer = await manufacturersRepository.create(req.body);

    res.status(201).json({
      status: "success",
      data: { manufacturer },
    });
  });

  updateManufacturer = catchAsync(async (req, res, next) => {
    const manufacturer = await manufacturersRepository.update(req.params.id, req.body);

    if (!manufacturer) {
      return next(new AppError("Manufacturer not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { manufacturer },
    });
  });

  deleteManufacturer = catchAsync(async (req, res, next) => {
    const deleted = await manufacturersRepository.delete(req.params.id);

    if (!deleted) {
      return next(new AppError("Manufacturer not found", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
}

module.exports = new ManufacturersController();

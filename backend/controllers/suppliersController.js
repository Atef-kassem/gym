const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const suppliersRepository = require("../Model/repository/suppliersRepository");

class SuppliersController {
  getAllSuppliers = catchAsync(async (req, res, next) => {
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 1000000,
      search: req.query.search || "",
      isActive: req.query.isActive !== undefined ? req.query.isActive === "true" : undefined,
      sortBy: req.query.sortBy || "name_en",
      sortOrder: req.query.sortOrder || "ASC",
    };

    const result = await suppliersRepository.findAll(options);

    res.status(200).json({
      status: "success",
      data: {
        suppliers: result.suppliers,
        pagination: result.pagination,
      },
    });
  });

  getSupplier = catchAsync(async (req, res, next) => {
    const supplier = await suppliersRepository.findById(req.params.id);

    if (!supplier) {
      return next(new AppError("Supplier not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { supplier },
    });
  });

  createSupplier = catchAsync(async (req, res, next) => {
    try {
      const requiredFields = ["name_ar", "name_en"];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        return next(new AppError(`Missing required fields: ${missingFields.join(", ")}`, 400));
      }

      if (req.body.name_ar && req.body.name_ar.length > 100) {
        return next(new AppError("name_ar must be 100 characters or less", 400));
      }

      if (req.body.name_en && req.body.name_en.length > 100) {
        return next(new AppError("name_en must be 100 characters or less", 400));
      }

      if (req.body.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(req.body.email)) {
        return next(new AppError("Invalid email format", 400));
      }

      console.log("Creating supplier with data:", {
        name_ar: req.body.name_ar,
        name_en: req.body.name_en,
        email: req.body.email,
        phone: req.body.phone,
      });

      const supplier = await suppliersRepository.create(req.body);

      res.status(201).json({
        status: "success",
        data: { supplier },
      });
    } catch (error) {
      console.error("Error creating supplier:", {
        message: error.message,
        body: req.body,
        error: error,
      });

      if (error.name === "SequelizeValidationError") {
        const validationErrors = error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        }));

        return next(
          new AppError(`Validation failed: ${validationErrors.map((e) => `${e.field}: ${e.message}`).join(", ")}`, 400)
        );
      }

      return next(new AppError(`Error creating supplier: ${error.message}`, 500));
    }
  });

  updateSupplier = catchAsync(async (req, res, next) => {
    const supplier = await suppliersRepository.update(req.params.id, req.body);

    if (!supplier) {
      return next(new AppError("Supplier not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { supplier },
    });
  });

  deleteSupplier = catchAsync(async (req, res, next) => {
    const deleted = await suppliersRepository.delete(req.params.id);

    if (!deleted) {
      return next(new AppError("Supplier not found", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
}

module.exports = new SuppliersController();

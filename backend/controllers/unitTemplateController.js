const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const unitTemplateRepository = require("../Model/repository/unitTemplateRepository");

class UnitTemplateController {
  getAllTemplates = catchAsync(async (req, res, next) => {
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 1000000,
      search: req.query.search || "",
      category: req.query.category,
      isActive: req.query.isActive !== undefined ? req.query.isActive === "true" : undefined,
      sortBy: req.query.sortBy || "name_en",
      sortOrder: req.query.sortOrder || "ASC",
    };

    const result = await unitTemplateRepository.findAll(options);

    res.status(200).json({
      status: "success",
      data: result.templates,
      pagination: result.pagination,
    });
  });

  getTemplate = catchAsync(async (req, res, next) => {
    const template = await unitTemplateRepository.findById(req.params.id);

    if (!template) {
      return next(new AppError("Unit template not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { template },
    });
  });

  createTemplate = catchAsync(async (req, res, next) => {
    const template = await unitTemplateRepository.create(req.body);

    res.status(201).json({
      status: "success",
      data: { template },
    });
  });

  updateTemplate = catchAsync(async (req, res, next) => {
    const template = await unitTemplateRepository.update(req.params.id, req.body);

    if (!template) {
      return next(new AppError("Unit template not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: { template },
    });
  });

  deleteTemplate = catchAsync(async (req, res, next) => {
    const deleted = await unitTemplateRepository.delete(req.params.id);

    if (!deleted) {
      return next(new AppError("Unit template not found", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

  getTemplatesByCategory = catchAsync(async (req, res, next) => {
    const { category } = req.params;
    const templates = await unitTemplateRepository.findByCategory(category);

    res.status(200).json({
      status: "success",
      data: { templates },
    });
  });

  getActiveTemplates = catchAsync(async (req, res, next) => {
    const templates = await unitTemplateRepository.getActiveTemplates();

    res.status(200).json({
      status: "success",
      data: { templates },
    });
  });

  incrementUsageCount = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await unitTemplateRepository.incrementUsageCount(id);

    res.status(200).json({
      status: "success",
      message: "Usage count incremented successfully",
    });
  });
}

module.exports = new UnitTemplateController();

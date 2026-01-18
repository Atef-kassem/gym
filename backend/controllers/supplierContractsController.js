const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const supplierContractsRepository = require("../Model/repository/supplierContractsRepository");

class SupplierContractsController {
  getAll = catchAsync(async (req, res, next) => {
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 1000000,
      search: req.query.search || "",
      status: req.query.status,
      sortBy: req.query.sortBy || "created_at",
      sortOrder: req.query.sortOrder || "DESC",
    };
    const result = await supplierContractsRepository.findAll(options);
    res.status(200).json({ status: "success", data: result });
  });

  getOne = catchAsync(async (req, res, next) => {
    const contract = await supplierContractsRepository.findById(req.params.id);
    if (!contract) return next(new AppError("Contract not found", 404));
    res.status(200).json({ status: "success", data: { contract } });
  });

  create = catchAsync(async (req, res, next) => {
    const required = ["contract_number", "start_date", "end_date"];
    const missing = required.filter((f) => !req.body[f]);
    if (missing.length) return next(new AppError(`Missing required fields: ${missing.join(", ")}`, 400));
    const contract = await supplierContractsRepository.create(req.body);
    res.status(201).json({ status: "success", data: { contract } });
  });

  update = catchAsync(async (req, res, next) => {
    const updated = await supplierContractsRepository.update(req.params.id, req.body);
    if (!updated) return next(new AppError("Contract not found", 404));
    res.status(200).json({ status: "success", data: { contract: updated } });
  });

  delete = catchAsync(async (req, res, next) => {
    const ok = await supplierContractsRepository.delete(req.params.id);
    if (!ok) return next(new AppError("Contract not found", 404));
    res.status(204).json({ status: "success", data: null });
  });
}

module.exports = new SupplierContractsController();



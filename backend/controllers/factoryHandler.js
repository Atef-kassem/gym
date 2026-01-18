const ApiFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const { Op } = require("sequelize");

// Factory function to create a record
exports.createOne = (Model, data) =>
  catchAsync(async (req, res, next) => {
    let fields = {};
    data.forEach((field) => {
      if (req.body[field]) {
        fields = {
          ...fields,
          field: req.body[field],
        };
      }
    });

    const record = await Model.create();

    res.status(201).json({
      status: "success",
      data: record,
      message: `${Model.name} created successfully`,
    });
  });

// Factory function to get a single record by ID or other unique identifier
exports.getOne = (Model, identifier, options = {}) =>
  catchAsync(async (req, res, next) => {
    const where = typeof identifier === "object" ? identifier : { id: identifier };
    const record = await Model.findOne({
      where,
      ...options, // Include options like include, attributes, etc.
    });

    if (!record) {
      return next(new AppError(`${Model.name} not found`, 404));
    }

    res.status(200).json({
      status: "success",
      data: record,
      message: `${Model.name} retrieved successfully`,
    });
  });

// Factory function to get multiple records with optional filtering and pagination
exports.getAll = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    const { where = {}, limit = 100000000, offset = 0, order = [["createdAt", "DESC"]], ...otherOptions } = options;

    const records = await Model.findAndCountAll({
      where,
      limit,
      offset,
      order,
      ...otherOptions, // Include options like include, attributes, etc.
    });

    res.status(200).json({
      status: "success",
      data: records.rows,
      total: records.count,
      message: `${Model.name}s retrieved successfully`,
    });
  });

// Factory function to update a record by ID or other unique identifier
exports.updateOne = (Model, identifier, data, options = {}) =>
  catchAsync(async (req, res, next) => {
    const where = typeof identifier === "object" ? identifier : { id: identifier };
    const [updatedCount, updatedRecords] = await Model.update(data, {
      where,
      returning: true, // Return the updated record(s)
      ...options,
    });

    if (updatedCount === 0) {
      return next(new AppError(`${Model.name} not found`, 404));
    }

    res.status(200).json({
      status: "success",
      data: updatedRecords[0] || updatedRecords,
      message: `${Model.name} updated successfully`,
    });
  });

// Factory function to delete a record by ID or other unique identifier
exports.deleteOne = (Model, identifier = 'id', options = {}) =>
  catchAsync(async (req, res, next) => {
    const fieldName = typeof identifier === 'string' ? identifier : 'id';
    const fieldValue = req.params[fieldName];
    
    if (!fieldValue) {
      return next(new AppError(`${fieldName} parameter is required`, 400));
    }
    
    const where = { [fieldName]: fieldValue };
    console.log(`Attempting to delete ${Model.name} with ${fieldName}:`, fieldValue);
    console.log('Where clause:', where);
    
    const deletedCount = await Model.destroy({
      where,
      ...options,
    });

    console.log(`Deleted ${deletedCount} record(s)`);

    if (deletedCount === 0) {
      return next(new AppError(`${Model.name} not found with ${fieldName}: ${fieldValue}`, 404));
    }

    res.status(200).json({
      status: "success",
      message: `${Model.name} deleted successfully`,
    });
  });

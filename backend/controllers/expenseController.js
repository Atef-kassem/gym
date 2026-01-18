const repo = require("../Model/repository/expenseRepository");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

class ExpenseController {
  create = catchAsync(async (req, res, next) => {
    const expenseData = {
      ...req.body,
      createdBy: req.user?.id
    };

    const expense = await repo.create(expenseData);
    
    res.status(201).json({
      status: "success",
      message: "تم إنشاء المصروف بنجاح",
      data: expense
    });
  });

  get = catchAsync(async (req, res, next) => {
    const expense = await repo.findById(req.params.id);
    
    if (!expense) {
      return next(new AppError("المصروف غير موجود", 404));
    }

    res.status(200).json({
      status: "success",
      data: expense
    });
  });

  list = catchAsync(async (req, res, next) => {
    const result = await repo.findAll(req.query);
    
    res.status(200).json({
      status: "success",
      results: result.expenses.length,
      data: {
        expenses: result.expenses,
        pagination: result.pagination
      }
    });
  });

  update = catchAsync(async (req, res, next) => {
    const updated = await repo.update(req.params.id, req.body);
    
    res.status(200).json({
      status: "success",
      message: "تم تحديث المصروف بنجاح",
      data: updated
    });
  });

  delete = catchAsync(async (req, res, next) => {
    const result = await repo.delete(req.params.id);
    
    res.status(200).json({
      status: "success",
      message: result.message
    });
  });

  statistics = catchAsync(async (req, res, next) => {
    const stats = await repo.getStatistics(req.query);
    
    res.status(200).json({
      status: "success",
      data: stats
    });
  });

  approve = catchAsync(async (req, res, next) => {
    const expense = await repo.approve(req.params.id, req.user?.id);
    
    res.status(200).json({
      status: "success",
      message: "تم الموافقة على المصروف بنجاح",
      data: expense
    });
  });

  reject = catchAsync(async (req, res, next) => {
    const expense = await repo.reject(req.params.id);
    
    res.status(200).json({
      status: "success",
      message: "تم رفض المصروف",
      data: expense
    });
  });
}

module.exports = new ExpenseController();


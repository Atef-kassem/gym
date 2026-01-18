const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { TrainerSalary, AppTrainer } = require("../Model/index");
const { Op } = require("sequelize");

// Get all trainer salaries
exports.getAllTrainerSalaries = catchAsync(async (req, res, next) => {
  const { trainerId, isActive, search } = req.query;
  
  const where = {};
  if (trainerId) where.trainerId = trainerId;
  if (isActive !== undefined) where.isActive = isActive === "true";
  
  const include = [
    {
      model: AppTrainer,
      as: "trainer",
      attributes: ["id", "name", "email", "phone", "specialization"],
    },
  ];
  
  // If search is provided, search in trainer name
  if (search) {
    include[0].where = {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ],
    };
  }
  
  const salaries = await TrainerSalary.findAll({
    where,
    include,
    order: [["createdAt", "DESC"]],
  });
  
  res.status(200).json({
    status: "success",
    results: salaries.length,
    data: salaries,
  });
});

// Get trainer salary by ID
exports.getTrainerSalary = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const salary = await TrainerSalary.findByPk(id, {
    include: [
      {
        model: AppTrainer,
        as: "trainer",
        attributes: ["id", "name", "email", "phone", "specialization"],
      },
    ],
  });
  
  if (!salary) {
    return next(new AppError("Trainer salary not found", 404));
  }
  
  res.status(200).json({
    status: "success",
    data: salary,
  });
});

// Get active salary for a trainer
exports.getActiveTrainerSalary = catchAsync(async (req, res, next) => {
  const { trainerId } = req.params;
  
  const salary = await TrainerSalary.findOne({
    where: {
      trainerId,
      isActive: true,
      [Op.or]: [
        { endDate: null },
        { endDate: { [Op.gte]: new Date() } },
      ],
    },
    include: [
      {
        model: AppTrainer,
        as: "trainer",
        attributes: ["id", "name", "email", "phone", "specialization"],
      },
    ],
    order: [["effectiveDate", "DESC"]],
  });
  
  if (!salary) {
    return res.status(200).json({
      status: "success",
      data: null,
      message: "No active salary found for this trainer",
    });
  }
  
  res.status(200).json({
    status: "success",
    data: salary,
  });
});

// Create trainer salary
exports.createTrainerSalary = catchAsync(async (req, res, next) => {
  const {
    trainerId,
    baseSalary,
    classCommissionPercentage,
    subscriptionCommissionPercentage,
    effectiveDate,
    endDate,
    notes,
  } = req.body;
  
  // Validate required fields
  if (!trainerId) {
    return next(new AppError("Trainer ID is required", 400));
  }
  
  if (baseSalary === undefined || baseSalary === null) {
    return next(new AppError("Base salary is required", 400));
  }
  
  if (classCommissionPercentage === undefined || classCommissionPercentage === null) {
    return next(new AppError("Class commission percentage is required", 400));
  }
  
  if (subscriptionCommissionPercentage === undefined || subscriptionCommissionPercentage === null) {
    return next(new AppError("Subscription commission percentage is required", 400));
  }
  
  // Validate percentages
  if (classCommissionPercentage < 0 || classCommissionPercentage > 100) {
    return next(new AppError("Class commission percentage must be between 0 and 100", 400));
  }
  
  if (subscriptionCommissionPercentage < 0 || subscriptionCommissionPercentage > 100) {
    return next(new AppError("Subscription commission percentage must be between 0 and 100", 400));
  }
  
  // Check if trainer exists
  const trainer = await AppTrainer.findByPk(trainerId);
  if (!trainer) {
    return next(new AppError("Trainer not found", 404));
  }
  
  // If creating a new active salary, deactivate old ones
  if (req.body.isActive !== false) {
    await TrainerSalary.update(
      { isActive: false },
      {
        where: {
          trainerId,
          isActive: true,
        },
      }
    );
  }
  
  const salary = await TrainerSalary.create({
    trainerId,
    baseSalary: parseFloat(baseSalary),
    classCommissionPercentage: parseFloat(classCommissionPercentage),
    subscriptionCommissionPercentage: parseFloat(subscriptionCommissionPercentage),
    effectiveDate: effectiveDate || new Date(),
    endDate: endDate || null,
    notes: notes || null,
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    createdBy: req.user?.id || null,
  });
  
  const salaryWithTrainer = await TrainerSalary.findByPk(salary.id, {
    include: [
      {
        model: AppTrainer,
        as: "trainer",
        attributes: ["id", "name", "email", "phone", "specialization"],
      },
    ],
  });
  
  res.status(201).json({
    status: "success",
    data: salaryWithTrainer,
  });
});

// Update trainer salary
exports.updateTrainerSalary = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    baseSalary,
    classCommissionPercentage,
    subscriptionCommissionPercentage,
    effectiveDate,
    endDate,
    isActive,
    notes,
  } = req.body;
  
  const salary = await TrainerSalary.findByPk(id);
  if (!salary) {
    return next(new AppError("Trainer salary not found", 404));
  }
  
  // Validate percentages if provided
  if (classCommissionPercentage !== undefined) {
    if (classCommissionPercentage < 0 || classCommissionPercentage > 100) {
      return next(new AppError("Class commission percentage must be between 0 and 100", 400));
    }
  }
  
  if (subscriptionCommissionPercentage !== undefined) {
    if (subscriptionCommissionPercentage < 0 || subscriptionCommissionPercentage > 100) {
      return next(new AppError("Subscription commission percentage must be between 0 and 100", 400));
    }
  }
  
  // Update fields
  const updateData = {};
  if (baseSalary !== undefined) updateData.baseSalary = parseFloat(baseSalary);
  if (classCommissionPercentage !== undefined) updateData.classCommissionPercentage = parseFloat(classCommissionPercentage);
  if (subscriptionCommissionPercentage !== undefined) updateData.subscriptionCommissionPercentage = parseFloat(subscriptionCommissionPercentage);
  if (effectiveDate !== undefined) updateData.effectiveDate = effectiveDate;
  if (endDate !== undefined) updateData.endDate = endDate;
  if (isActive !== undefined) updateData.isActive = isActive;
  if (notes !== undefined) updateData.notes = notes;
  updateData.updatedBy = req.user?.id || null;
  
  await salary.update(updateData);
  
  const updatedSalary = await TrainerSalary.findByPk(id, {
    include: [
      {
        model: AppTrainer,
        as: "trainer",
        attributes: ["id", "name", "email", "phone", "specialization"],
      },
    ],
  });
  
  res.status(200).json({
    status: "success",
    data: updatedSalary,
  });
});

// Delete trainer salary
exports.deleteTrainerSalary = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const salary = await TrainerSalary.findByPk(id);
  if (!salary) {
    return next(new AppError("Trainer salary not found", 404));
  }
  
  await salary.destroy();
  
  res.status(204).json({
    status: "success",
    data: null,
  });
});


const { GymClass, ClassEnrollment, Member, AppTrainer, Branch } = require("../Model/index");
const { Op } = require("sequelize");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Get all classes
exports.getAllClasses = catchAsync(async (req, res) => {
  const { search, branchId, trainerId, status, startDate, endDate } = req.query;

  const where = {};
  if (search) {
    where[Op.or] = [
      { className: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }
  if (branchId) {
    where.branchId = branchId;
  }
  if (trainerId) {
    where.trainerId = trainerId;
  }
  if (status) {
    where.status = status;
  }
  if (startDate && endDate) {
    where.classDate = {
      [Op.between]: [startDate, endDate],
    };
  } else if (startDate) {
    where.classDate = {
      [Op.gte]: startDate,
    };
  } else if (endDate) {
    where.classDate = {
      [Op.lte]: endDate,
    };
  }

  const classes = await GymClass.findAll({
    where,
    include: [
      { model: Branch, as: "branch", attributes: ["id", "arabicName", "englishName"] },
      { model: AppTrainer, as: "trainer", attributes: ["id", "name", "phone", "email"] },
      {
        model: ClassEnrollment,
        as: "enrollments",
        include: [
          { model: Member, as: "member", attributes: ["id", "name", "memberCode", "phone"] },
        ],
      },
    ],
    order: [["classDate", "DESC"], ["startTime", "ASC"]],
  });

  res.status(200).json({
    status: "success",
    results: classes.length,
    data: {
      classes,
    },
  });
});

// Get class by ID
exports.getClassById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const classRecord = await GymClass.findByPk(id, {
    include: [
      { model: Branch, as: "branch", attributes: ["id", "arabicName", "englishName"] },
      { model: AppTrainer, as: "trainer", attributes: ["id", "name", "phone", "email"] },
      {
        model: ClassEnrollment,
        as: "enrollments",
        include: [
          { model: Member, as: "member", attributes: ["id", "name", "memberCode", "phone"] },
        ],
      },
    ],
  });

  if (!classRecord) {
    return next(new AppError("الحصة غير موجودة", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      class: classRecord,
    },
  });
});

// Create new class
exports.createClass = catchAsync(async (req, res, next) => {
  const {
    className,
    description,
    trainerId,
    branchId,
    classDate,
    startTime,
    endTime,
    maxCapacity,
    price,
    notes,
    memberIds, // Array of member IDs to enroll
  } = req.body;

  // Validation
  if (!className || !trainerId || !branchId || !classDate || !startTime || !endTime) {
    return next(new AppError("يرجى إدخال جميع الحقول المطلوبة", 400));
  }

  // Check if trainer exists
  const trainer = await AppTrainer.findByPk(trainerId);
  if (!trainer) {
    return next(new AppError("المدرب غير موجود", 404));
  }

  // Check if branch exists
  const branch = await Branch.findByPk(branchId);
  if (!branch) {
    return next(new AppError("الفرع غير موجود", 404));
  }

  // Create class
  const newClass = await GymClass.create({
    className,
    description: description || null,
    trainerId,
    branchId,
    classDate,
    startTime,
    endTime,
    maxCapacity: maxCapacity || 10,
    price: price || 0,
    notes: notes || null,
    status: "scheduled",
    currentEnrollments: 0,
    isActive: true,
  });

  // Enroll members if provided
  if (memberIds && Array.isArray(memberIds) && memberIds.length > 0) {
    const enrollments = [];
    for (const memberId of memberIds) {
      // Check if member exists
      const member = await Member.findByPk(memberId);
      if (!member) {
        continue; // Skip if member doesn't exist
      }

      // Check if already enrolled
      const existingEnrollment = await ClassEnrollment.findOne({
        where: { classId: newClass.id, memberId },
      });

      if (!existingEnrollment) {
        enrollments.push({
          classId: newClass.id,
          memberId,
          enrollmentDate: new Date().toISOString().split("T")[0],
          attendanceStatus: "registered",
        });
      }
    }

    if (enrollments.length > 0) {
      await ClassEnrollment.bulkCreate(enrollments);
      await newClass.update({ currentEnrollments: enrollments.length });
    }
  }

  // Fetch the created class with relations
  const createdClass = await GymClass.findByPk(newClass.id, {
    include: [
      { model: Branch, as: "branch", attributes: ["id", "arabicName", "englishName"] },
      { model: AppTrainer, as: "trainer", attributes: ["id", "name", "phone", "email"] },
      {
        model: ClassEnrollment,
        as: "enrollments",
        include: [
          { model: Member, as: "member", attributes: ["id", "name", "memberCode", "phone"] },
        ],
      },
    ],
  });

  res.status(201).json({
    status: "success",
    data: {
      class: createdClass,
    },
  });
});

// Update class
exports.updateClass = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    className,
    description,
    trainerId,
    branchId,
    classDate,
    startTime,
    endTime,
    maxCapacity,
    price,
    status,
    notes,
    isActive,
  } = req.body;

  const classRecord = await GymClass.findByPk(id);

  if (!classRecord) {
    return next(new AppError("الحصة غير موجودة", 404));
  }

  // Update class fields
  const updateData = {};
  if (className !== undefined) updateData.className = className;
  if (description !== undefined) updateData.description = description;
  if (trainerId !== undefined) {
    const trainer = await AppTrainer.findByPk(trainerId);
    if (!trainer) {
      return next(new AppError("المدرب غير موجود", 404));
    }
    updateData.trainerId = trainerId;
  }
  if (branchId !== undefined) {
    const branch = await Branch.findByPk(branchId);
    if (!branch) {
      return next(new AppError("الفرع غير موجود", 404));
    }
    updateData.branchId = branchId;
  }
  if (classDate !== undefined) updateData.classDate = classDate;
  if (startTime !== undefined) updateData.startTime = startTime;
  if (endTime !== undefined) updateData.endTime = endTime;
  if (maxCapacity !== undefined) updateData.maxCapacity = maxCapacity;
  if (price !== undefined) updateData.price = price;
  if (status !== undefined) updateData.status = status;
  if (notes !== undefined) updateData.notes = notes;
  if (isActive !== undefined) updateData.isActive = isActive;

  await classRecord.update(updateData);

  // Fetch updated class with relations
  const updatedClass = await GymClass.findByPk(id, {
    include: [
      { model: Branch, as: "branch", attributes: ["id", "arabicName", "englishName"] },
      { model: AppTrainer, as: "trainer", attributes: ["id", "name", "phone", "email"] },
      {
        model: ClassEnrollment,
        as: "enrollments",
        include: [
          { model: Member, as: "member", attributes: ["id", "name", "memberCode", "phone"] },
        ],
      },
    ],
  });

  res.status(200).json({
    status: "success",
    data: {
      class: updatedClass,
    },
  });
});

// Delete class
exports.deleteClass = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const classRecord = await GymClass.findByPk(id);

  if (!classRecord) {
    return next(new AppError("الحصة غير موجودة", 404));
  }

  // Delete all enrollments first
  await ClassEnrollment.destroy({ where: { classId: id } });

  // Delete class
  await classRecord.destroy();

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Enroll member to class
exports.enrollMember = catchAsync(async (req, res, next) => {
  const { classId, memberId } = req.params;

  const classRecord = await GymClass.findByPk(classId);
  if (!classRecord) {
    return next(new AppError("الحصة غير موجودة", 404));
  }

  const member = await Member.findByPk(memberId);
  if (!member) {
    return next(new AppError("العضو غير موجود", 404));
  }

  // Check if already enrolled
  const existingEnrollment = await ClassEnrollment.findOne({
    where: { classId, memberId },
  });

  if (existingEnrollment) {
    return next(new AppError("العضو مسجل بالفعل في هذه الحصة", 400));
  }

  // Check capacity
  if (classRecord.currentEnrollments >= classRecord.maxCapacity) {
    return next(new AppError("الحصة ممتلئة", 400));
  }

  // Create enrollment
  const enrollment = await ClassEnrollment.create({
    classId,
    memberId,
    enrollmentDate: new Date().toISOString().split("T")[0],
    attendanceStatus: "registered",
  });

  // Update class enrollment count
  await classRecord.increment("currentEnrollments");

  // Fetch enrollment with relations
  const createdEnrollment = await ClassEnrollment.findByPk(enrollment.id, {
    include: [
      { model: GymClass, as: "class", attributes: ["id", "className", "classDate", "startTime"] },
      { model: Member, as: "member", attributes: ["id", "name", "memberCode", "phone"] },
    ],
  });

  res.status(201).json({
    status: "success",
    data: {
      enrollment: createdEnrollment,
    },
  });
});

// Remove member from class
exports.removeMember = catchAsync(async (req, res, next) => {
  const { classId, memberId } = req.params;

  const enrollment = await ClassEnrollment.findOne({
    where: { classId, memberId },
  });

  if (!enrollment) {
    return next(new AppError("العضو غير مسجل في هذه الحصة", 404));
  }

  // Delete enrollment
  await enrollment.destroy();

  // Update class enrollment count
  const classRecord = await GymClass.findByPk(classId);
  if (classRecord && classRecord.currentEnrollments > 0) {
    await classRecord.decrement("currentEnrollments");
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Update attendance status
exports.updateAttendance = catchAsync(async (req, res, next) => {
  const { classId, memberId } = req.params;
  const { attendanceStatus, attendanceTime } = req.body;

  const enrollment = await ClassEnrollment.findOne({
    where: { classId, memberId },
  });

  if (!enrollment) {
    return next(new AppError("العضو غير مسجل في هذه الحصة", 404));
  }

  const updateData = {};
  if (attendanceStatus !== undefined) updateData.attendanceStatus = attendanceStatus;
  if (attendanceTime !== undefined) updateData.attendanceTime = attendanceTime;

  await enrollment.update(updateData);

  // Fetch updated enrollment with relations
  const updatedEnrollment = await ClassEnrollment.findByPk(enrollment.id, {
    include: [
      { model: GymClass, as: "class", attributes: ["id", "className", "classDate", "startTime"] },
      { model: Member, as: "member", attributes: ["id", "name", "memberCode", "phone"] },
    ],
  });

  res.status(200).json({
    status: "success",
    data: {
      enrollment: updatedEnrollment,
    },
  });
});

// Get class statistics
exports.getClassStatistics = catchAsync(async (req, res) => {
  const { branchId, trainerId, startDate, endDate } = req.query;

  const where = {};
  if (branchId) where.branchId = branchId;
  if (trainerId) where.trainerId = trainerId;
  if (startDate && endDate) {
    where.classDate = { [Op.between]: [startDate, endDate] };
  }

  const totalClasses = await GymClass.count({ where });
  const scheduledClasses = await GymClass.count({ where: { ...where, status: "scheduled" } });
  const completedClasses = await GymClass.count({ where: { ...where, status: "completed" } });
  const cancelledClasses = await GymClass.count({ where: { ...where, status: "cancelled" } });

  const totalEnrollments = await ClassEnrollment.count({
    include: [
      {
        model: GymClass,
        as: "class",
        where,
      },
    ],
  });

  const totalAttendances = await ClassEnrollment.count({
    where: { attendanceStatus: "attended" },
    include: [
      {
        model: GymClass,
        as: "class",
        where,
      },
    ],
  });

  res.status(200).json({
    status: "success",
    data: {
      statistics: {
        totalClasses,
        scheduledClasses,
        completedClasses,
        cancelledClasses,
        totalEnrollments,
        totalAttendances,
        attendanceRate: totalEnrollments > 0 ? (totalAttendances / totalEnrollments) * 100 : 0,
      },
    },
  });
});


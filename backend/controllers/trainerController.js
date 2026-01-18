const { AppTrainer, GymClass, ClassEnrollment, Member, TrainerSalary, Branch, GymSubscription } = require("../Model/index");
const { Op } = require("sequelize");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const sequelize = require("../Config/sequelize");

// Get trainer details with statistics
exports.getTrainerDetails = catchAsync(async (req, res, next) => {
  const { trainerId } = req.params;
  const { startDate, endDate, month, year } = req.query;

  // Validate trainer exists
  const trainer = await AppTrainer.findByPk(trainerId);
  if (!trainer) {
    return next(new AppError("المدرب غير موجود", 404));
  }

  // Build date filter
  let dateFilter = {};
  if (startDate && endDate) {
    dateFilter = {
      classDate: {
        [Op.between]: [startDate, endDate],
      },
    };
  } else if (month && year) {
    // Filter by month and year
    const start = `${year}-${String(month).padStart(2, '0')}-01`;
    const endDateObj = new Date(year, month, 0);
    const end = `${year}-${String(month).padStart(2, '0')}-${String(endDateObj.getDate()).padStart(2, '0')}`;
    dateFilter = {
      classDate: {
        [Op.between]: [start, end],
      },
    };
  } else if (month) {
    // Current month of current year
    const currentYear = new Date().getFullYear();
    const start = `${currentYear}-${String(month).padStart(2, '0')}-01`;
    const endDateObj = new Date(currentYear, month, 0);
    const end = `${currentYear}-${String(month).padStart(2, '0')}-${String(endDateObj.getDate()).padStart(2, '0')}`;
    dateFilter = {
      classDate: {
        [Op.between]: [start, end],
      },
    };
  } else {
    // Default: all time
    dateFilter = {};
  }

  // Get trainer's classes
  const classes = await GymClass.findAll({
    where: {
      trainerId: parseInt(trainerId),
      ...dateFilter,
    },
    include: [
      {
        model: Branch,
        as: "branch",
        attributes: ["id", "arabicName", "englishName"],
      },
      {
        model: ClassEnrollment,
        as: "enrollments",
        include: [
          {
            model: Member,
            as: "member",
            attributes: ["id", "name", "memberCode", "phone"],
          },
        ],
      },
    ],
    order: [["classDate", "DESC"], ["startTime", "ASC"]],
  });

  // Get active salary
  const activeSalary = await TrainerSalary.findOne({
    where: {
      trainerId: parseInt(trainerId),
      isActive: true,
      [Op.or]: [
        { endDate: null },
        { endDate: { [Op.gte]: new Date() } },
      ],
    },
    order: [["effectiveDate", "DESC"]],
  });

  // Calculate statistics
  const totalClasses = classes.length;
  const uniqueDates = new Set(classes.map((c) => c.classDate));
  const totalDays = uniqueDates.size;
  
  const totalEnrollments = classes.reduce((sum, c) => sum + (c.currentEnrollments || 0), 0);
  const uniqueMembers = new Set();
  classes.forEach((c) => {
    c.enrollments?.forEach((e) => {
      if (e.memberId) uniqueMembers.add(e.memberId);
    });
  });

  // Calculate earnings
  let totalClassEarnings = 0;
  let totalClassCommission = 0;
  let totalSubscriptionEarnings = 0;
  let totalSubscriptionCommission = 0;

  classes.forEach((classRecord) => {
    const enrollmentsCount = classRecord.currentEnrollments || 0;
    const classPrice = parseFloat(classRecord.price || 0);
    const classRevenue = enrollmentsCount * classPrice;
    totalClassEarnings += classRevenue;

    if (activeSalary) {
      const commissionRate = parseFloat(activeSalary.classCommissionPercentage || 0) / 100;
      totalClassCommission += classRevenue * commissionRate;
    }
  });

  // Get subscriptions for members enrolled in trainer's classes
  const enrolledMemberIds = Array.from(uniqueMembers);
  let subscriptions = [];
  
  if (enrolledMemberIds.length > 0) {
    // Build subscription date filter (same as class date filter)
    let subscriptionDateFilter = {};
    if (startDate && endDate) {
      subscriptionDateFilter = {
        [Op.or]: [
          {
            subscriptionStartDate: {
              [Op.lte]: endDate,
            },
            subscriptionEndDate: {
              [Op.gte]: startDate,
            },
          },
        ],
      };
    } else if (month && year) {
      const start = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDateObj = new Date(year, month, 0);
      const end = `${year}-${String(month).padStart(2, '0')}-${String(endDateObj.getDate()).padStart(2, '0')}`;
      subscriptionDateFilter = {
        [Op.or]: [
          {
            subscriptionStartDate: {
              [Op.lte]: end,
            },
            subscriptionEndDate: {
              [Op.gte]: start,
            },
          },
        ],
      };
    }
    
    subscriptions = await GymSubscription.findAll({
      where: {
        memberId: {
          [Op.in]: enrolledMemberIds,
        },
        ...subscriptionDateFilter,
      },
      include: [
        {
          model: Branch,
          as: "branch",
          attributes: ["id", "arabicName", "englishName"],
        },
      ],
      order: [["subscriptionStartDate", "DESC"]],
    });
    
    // Calculate subscription commission
    subscriptions.forEach((subscription) => {
      const subscriptionValue = parseFloat(subscription.subscriptionValue || 0);
      totalSubscriptionEarnings += subscriptionValue;
      
      if (activeSalary) {
        const commissionRate = parseFloat(activeSalary.subscriptionCommissionPercentage || 0) / 100;
        totalSubscriptionCommission += subscriptionValue * commissionRate;
      }
    });
  }
  
  const baseSalary = activeSalary ? parseFloat(activeSalary.baseSalary || 0) : 0;
  const totalEarnings = baseSalary + totalClassCommission + totalSubscriptionCommission;

  // Get classes grouped by date
  const classesByDate = {};
  classes.forEach((classRecord) => {
    if (!classesByDate[classRecord.classDate]) {
      classesByDate[classRecord.classDate] = [];
    }
    classesByDate[classRecord.classDate].push({
      id: classRecord.id,
      className: classRecord.className,
      startTime: classRecord.startTime,
      endTime: classRecord.endTime,
      enrollments: classRecord.currentEnrollments,
      maxCapacity: classRecord.maxCapacity,
      price: classRecord.price,
      status: classRecord.status,
      members: classRecord.enrollments?.map((e) => ({
        id: e.member?.id,
        name: e.member?.name,
        memberCode: e.member?.memberCode,
        phone: e.member?.phone,
        attendanceStatus: e.attendanceStatus,
      })) || [],
    });
  });

  res.status(200).json({
    status: "success",
    data: {
      trainer: {
        id: trainer.id,
        name: trainer.name,
        email: trainer.email,
        phone: trainer.phone,
        specialization: trainer.specialization,
        experience: trainer.experience,
        bio: trainer.bio,
        isActive: trainer.isActive,
      },
      salary: activeSalary
        ? {
            id: activeSalary.id,
            baseSalary: activeSalary.baseSalary,
            classCommissionPercentage: activeSalary.classCommissionPercentage,
            subscriptionCommissionPercentage: activeSalary.subscriptionCommissionPercentage,
            effectiveDate: activeSalary.effectiveDate,
            endDate: activeSalary.endDate,
          }
        : null,
      statistics: {
        totalClasses,
        totalDays,
        totalEnrollments,
        totalMembers: uniqueMembers.size,
        totalSubscriptions: subscriptions.length,
        totalClassEarnings: totalClassEarnings.toFixed(2),
        totalClassCommission: totalClassCommission.toFixed(2),
        totalSubscriptionEarnings: totalSubscriptionEarnings.toFixed(2),
        totalSubscriptionCommission: totalSubscriptionCommission.toFixed(2),
        baseSalary: baseSalary.toFixed(2),
        totalEarnings: totalEarnings.toFixed(2),
      },
      classes: classesByDate,
      subscriptions: await Promise.all(subscriptions.map(async (sub) => {
        // Get member info if memberId exists
        let memberInfo = null;
        if (sub.memberId) {
          const member = await Member.findByPk(sub.memberId, {
            attributes: ["id", "name", "memberCode", "phone"],
          });
          if (member) {
            memberInfo = {
              id: member.id,
              name: member.name,
              memberCode: member.memberCode,
              phone: member.phone,
            };
          }
        }
        
        return {
          id: sub.id,
          subscriptionNumber: sub.subscriptionNumber,
          customerName: sub.customerName,
          subscriptionType: sub.subscriptionType,
          subscriptionStartDate: sub.subscriptionStartDate,
          subscriptionEndDate: sub.subscriptionEndDate,
          subscriptionValue: sub.subscriptionValue,
          paidAmount: sub.paidAmount,
          remainingAmount: sub.remainingAmount,
          status: sub.status,
          isSpecial: sub.isSpecial,
          member: memberInfo,
          branch: sub.branch ? {
            id: sub.branch.id,
            arabicName: sub.branch.arabicName,
            englishName: sub.branch.englishName,
          } : null,
        };
      })),
      dateRange: {
        startDate: startDate || null,
        endDate: endDate || null,
        month: month || null,
        year: year || null,
      },
    },
  });
});


const { TimeBasedSpecialSubscription, Branch, Employee, Member } = require("../Model/index");
const { Op } = require("sequelize");

// Get all time-based special subscriptions
exports.getAllTimeBasedSpecialSubscriptions = async (req, res) => {
  try {
    const { search, branchId, subscriptionType, status } = req.query;
    
    const where = {};
    if (search) {
      where[Op.or] = [
        { customerName: { [Op.like]: `%${search}%` } },
        { subscriptionNumber: { [Op.like]: `%${search}%` } },
        { receiptNumber: { [Op.like]: `%${search}%` } },
      ];
    }
    if (branchId) {
      where.branchId = branchId;
    }
    if (subscriptionType) {
      where.subscriptionType = subscriptionType;
    }
    if (status) {
      where.status = status;
    }

    const subscriptions = await TimeBasedSpecialSubscription.findAll({
      where,
      include: [
        { model: Branch, as: "branch", attributes: ["id", "arabicName", "englishName"] },
        { model: Employee, as: "employee", attributes: ["id", "arabicName", "englishName", "employeeCode"] },
        { model: Member, as: "member", attributes: ["id", "name", "memberCode"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Calculate status if not provided
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const subscriptionsWithStatus = subscriptions.map(sub => {
      const startDate = new Date(sub.subscriptionStartDate);
      const endDate = new Date(sub.subscriptionEndDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      let status = sub.status;
      if (today < startDate) {
        status = "upcoming";
      } else if (today > endDate) {
        status = "expired";
      } else {
        status = "active";
      }
      
      return { ...sub.toJSON(), status };
    });

    res.json({
      success: true,
      data: subscriptionsWithStatus,
      count: subscriptionsWithStatus.length,
    });
  } catch (error) {
    console.error("Error fetching time-based special subscriptions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching time-based special subscriptions",
      error: error.message,
    });
  }
};

// Get time-based special subscription by ID
exports.getTimeBasedSpecialSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await TimeBasedSpecialSubscription.findByPk(id, {
      include: [
        { model: Branch, as: "branch" },
        { model: Employee, as: "employee" },
        { model: Member, as: "member" },
      ],
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Time-based special subscription not found",
      });
    }

    res.json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    console.error("Error fetching time-based special subscription:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching time-based special subscription",
      error: error.message,
    });
  }
};

// Create time-based special subscription
exports.createTimeBasedSpecialSubscription = async (req, res) => {
  try {
    console.log('📥 بيانات الاشتراك الخاص بوقت المستلمة:', req.body);

    let subscriptionData = { ...req.body };

    // Set registrationDate to today if not provided
    if (!subscriptionData.registrationDate || subscriptionData.registrationDate === "") {
      subscriptionData.registrationDate = new Date().toISOString().split('T')[0];
    }

    // تحويل الحقول الفارغة إلى null
    if (subscriptionData.subscriptionStartDate === "" || subscriptionData.subscriptionStartDate === null) subscriptionData.subscriptionStartDate = null;
    if (subscriptionData.subscriptionEndDate === "" || subscriptionData.subscriptionEndDate === null) subscriptionData.subscriptionEndDate = null;
    if (subscriptionData.receiptNumber === "" || subscriptionData.receiptNumber === null) subscriptionData.receiptNumber = null;
    if (subscriptionData.employeeId === "" || subscriptionData.employeeId === null || subscriptionData.employeeId === "null") subscriptionData.employeeId = null;
    if (subscriptionData.memberId === "" || subscriptionData.memberId === null || subscriptionData.memberId === "null") subscriptionData.memberId = null;
    if (subscriptionData.customerName === "" || subscriptionData.customerName === null) subscriptionData.customerName = null;
    
    // Convert values to numbers
    if (subscriptionData.subscriptionValue) subscriptionData.subscriptionValue = parseFloat(subscriptionData.subscriptionValue) || 0;
    if (subscriptionData.discountValue) subscriptionData.discountValue = parseFloat(subscriptionData.discountValue) || 0;
    if (subscriptionData.paidAmount) subscriptionData.paidAmount = parseFloat(subscriptionData.paidAmount) || 0;

    // Convert IDs to integers
    if (subscriptionData.branchId) subscriptionData.branchId = parseInt(subscriptionData.branchId);
    if (subscriptionData.employeeId) subscriptionData.employeeId = parseInt(subscriptionData.employeeId);
    if (subscriptionData.memberId) subscriptionData.memberId = parseInt(subscriptionData.memberId);
    
    // Generate subscription number if not provided
    if (!subscriptionData.subscriptionNumber) {
      const lastSubscription = await TimeBasedSpecialSubscription.findOne({
        order: [["id", "DESC"]],
      });
      const nextId = lastSubscription ? lastSubscription.id + 1 : 1;
      subscriptionData.subscriptionNumber = `TBSS${String(nextId).padStart(6, "0")}`;
    }

    // Validate required fields
    if (!subscriptionData.branchId || !subscriptionData.customerName || 
        !subscriptionData.subscriptionStartDate || !subscriptionData.subscriptionEndDate ||
        !subscriptionData.timeFrom || !subscriptionData.timeTo) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: branchId, customerName, subscriptionStartDate, subscriptionEndDate, timeFrom, and timeTo are required",
      });
    }

    // Validate time format (should be HH:MM:SS or HH:MM)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:([0-5][0-9]))?$/;
    if (!timeRegex.test(subscriptionData.timeFrom) || !timeRegex.test(subscriptionData.timeTo)) {
      return res.status(400).json({
        success: false,
        message: "Invalid time format. Please use HH:MM:SS or HH:MM format",
      });
    }

    // Ensure time format is HH:MM:SS
    if (subscriptionData.timeFrom.length === 5) {
      subscriptionData.timeFrom = subscriptionData.timeFrom + ":00";
    }
    if (subscriptionData.timeTo.length === 5) {
      subscriptionData.timeTo = subscriptionData.timeTo + ":00";
    }

    // Validate that timeFrom < timeTo
    const [fromHours, fromMinutes] = subscriptionData.timeFrom.split(':').map(Number);
    const [toHours, toMinutes] = subscriptionData.timeTo.split(':').map(Number);
    const fromTime = fromHours * 60 + fromMinutes;
    const toTime = toHours * 60 + toMinutes;
    
    if (fromTime >= toTime) {
      return res.status(400).json({
        success: false,
        message: "وقت البدء يجب أن يكون قبل وقت الانتهاء",
      });
    }

    // Calculate remaining amount
    const subscriptionValue = parseFloat(subscriptionData.subscriptionValue) || 0;
    const discountValue = subscriptionData.discountEnabled ? (parseFloat(subscriptionData.discountValue) || 0) : 0;
    const paidAmount = parseFloat(subscriptionData.paidAmount) || 0;
    subscriptionData.remainingAmount = subscriptionValue - discountValue - paidAmount;

    // Calculate status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(subscriptionData.subscriptionStartDate);
    const endDate = new Date(subscriptionData.subscriptionEndDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    if (today < startDate) {
      subscriptionData.status = "upcoming";
    } else if (today > endDate) {
      subscriptionData.status = "expired";
    } else {
      subscriptionData.status = "active";
    }

    console.log('📝 بيانات الاشتراك بعد المعالجة:', subscriptionData);
    
    const subscription = await TimeBasedSpecialSubscription.create(subscriptionData);
    
    const subscriptionWithRelations = await TimeBasedSpecialSubscription.findByPk(subscription.id, {
      include: [
        { model: Branch, as: "branch" },
        { model: Employee, as: "employee" },
        { model: Member, as: "member" },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Time-based special subscription created successfully",
      data: subscriptionWithRelations,
    });
  } catch (error) {
    console.error("❌ Error creating time-based special subscription:", error);
    
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => err.message).join(', ');
      return res.status(400).json({
        success: false,
        message: `Validation error: ${validationErrors}`,
        errors: error.errors
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: `Duplicate entry: ${error.errors[0]?.message || 'This value already exists'}`,
      });
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({
        success: false,
        message: `Invalid reference: The selected branch, member, or employee does not exist`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating time-based special subscription",
      error: error.message,
    });
  }
};

// Update time-based special subscription
exports.updateTimeBasedSpecialSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await TimeBasedSpecialSubscription.findByPk(id);
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Time-based special subscription not found",
      });
    }

    // Validate time format if provided
    if (req.body.timeFrom || req.body.timeTo) {
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:([0-5][0-9]))?$/;
      const timeFrom = req.body.timeFrom || subscription.timeFrom;
      const timeTo = req.body.timeTo || subscription.timeTo;
      
      if (timeFrom && !timeRegex.test(timeFrom)) {
        return res.status(400).json({
          success: false,
          message: "Invalid timeFrom format. Please use HH:MM:SS or HH:MM format",
        });
      }
      if (timeTo && !timeRegex.test(timeTo)) {
        return res.status(400).json({
          success: false,
          message: "Invalid timeTo format. Please use HH:MM:SS or HH:MM format",
        });
      }

      // Ensure time format is HH:MM:SS
      let finalTimeFrom = timeFrom;
      let finalTimeTo = timeTo;
      if (finalTimeFrom && finalTimeFrom.length === 5) {
        finalTimeFrom = finalTimeFrom + ":00";
      }
      if (finalTimeTo && finalTimeTo.length === 5) {
        finalTimeTo = finalTimeTo + ":00";
      }

      // Validate that timeFrom < timeTo
      const [fromHours, fromMinutes] = finalTimeFrom.split(':').map(Number);
      const [toHours, toMinutes] = finalTimeTo.split(':').map(Number);
      const fromTime = fromHours * 60 + fromMinutes;
      const toTime = toHours * 60 + toMinutes;
      
      if (fromTime >= toTime) {
        return res.status(400).json({
          success: false,
          message: "وقت البدء يجب أن يكون قبل وقت الانتهاء",
        });
      }

      if (req.body.timeFrom) req.body.timeFrom = finalTimeFrom;
      if (req.body.timeTo) req.body.timeTo = finalTimeTo;
    }

    // Recalculate remaining amount if values changed
    if (req.body.subscriptionValue !== undefined || req.body.discountValue !== undefined || req.body.paidAmount !== undefined) {
      const subscriptionValue = parseFloat(req.body.subscriptionValue || subscription.subscriptionValue) || 0;
      const discountValue = req.body.discountEnabled !== undefined ? (req.body.discountEnabled ? (parseFloat(req.body.discountValue || subscription.discountValue) || 0) : 0) : (subscription.discountEnabled ? (parseFloat(subscription.discountValue) || 0) : 0);
      const paidAmount = parseFloat(req.body.paidAmount || subscription.paidAmount) || 0;
      req.body.remainingAmount = subscriptionValue - discountValue - paidAmount;
    }

    // Recalculate status if dates changed
    if (req.body.subscriptionStartDate || req.body.subscriptionEndDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(req.body.subscriptionStartDate || subscription.subscriptionStartDate);
      const endDate = new Date(req.body.subscriptionEndDate || subscription.subscriptionEndDate);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      if (today < startDate) {
        req.body.status = "upcoming";
      } else if (today > endDate) {
        req.body.status = "expired";
      } else {
        req.body.status = "active";
      }
    }

    await subscription.update(req.body);
    
    const subscriptionWithRelations = await TimeBasedSpecialSubscription.findByPk(id, {
      include: [
        { model: Branch, as: "branch" },
        { model: Employee, as: "employee" },
        { model: Member, as: "member" },
      ],
    });

    res.json({
      success: true,
      message: "Time-based special subscription updated successfully",
      data: subscriptionWithRelations,
    });
  } catch (error) {
    console.error("Error updating time-based special subscription:", error);
    res.status(500).json({
      success: false,
      message: "Error updating time-based special subscription",
      error: error.message,
    });
  }
};

// Delete time-based special subscription
exports.deleteTimeBasedSpecialSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await TimeBasedSpecialSubscription.findByPk(id);
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Time-based special subscription not found",
      });
    }

    await subscription.destroy();

    res.json({
      success: true,
      message: "Time-based special subscription deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting time-based special subscription:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting time-based special subscription",
      error: error.message,
    });
  }
};

// Get time-based special subscription statistics
exports.getTimeBasedSpecialSubscriptionStatistics = async (req, res) => {
  try {
    const subscriptions = await TimeBasedSpecialSubscription.findAll();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let total = subscriptions.length;
    let active = 0;
    let expired = 0;
    let upcoming = 0;
    let totalValue = 0;
    let totalPaid = 0;
    let totalRemaining = 0;
    let monthlyCount = 0;
    let yearlyCount = 0;

    subscriptions.forEach(sub => {
      if (!sub.subscriptionStartDate || !sub.subscriptionEndDate) {
        return;
      }

      const startDate = new Date(sub.subscriptionStartDate);
      const endDate = new Date(sub.subscriptionEndDate);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return;
      }

      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      
      if (today < startDate) {
        upcoming++;
      } else if (today > endDate) {
        expired++;
      } else {
        active++;
      }

      totalValue += parseFloat(sub.subscriptionValue || 0);
      totalPaid += parseFloat(sub.paidAmount || 0);
      totalRemaining += parseFloat(sub.remainingAmount || 0);

      const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      if (daysDiff <= 35) {
        monthlyCount++;
      } else if (daysDiff >= 360) {
        yearlyCount++;
      }
    });

    res.json({
      success: true,
      data: {
        total,
        active,
        expired,
        upcoming,
        totalValue,
        totalPaid,
        totalRemaining,
        monthlyCount,
        yearlyCount,
      },
    });
  } catch (error) {
    console.error("Error fetching time-based special subscription statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching time-based special subscription statistics",
      error: error.message,
    });
  }
};


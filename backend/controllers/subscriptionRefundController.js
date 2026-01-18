const { GymSubscription, SubscriptionRefund, Branch, Employee, Member, User } = require("../Model/index");
const { Op } = require("sequelize");

// Get all subscription refunds
exports.getAllRefunds = async (req, res) => {
  try {
    const { search, branchId, memberId, status, startDate, endDate } = req.query;
    
    const where = {};
    if (search) {
      where[Op.or] = [
        { customerName: { [Op.like]: `%${search}%` } },
        { invoiceNumber: { [Op.like]: `%${search}%` } },
        { subscriptionType: { [Op.like]: `%${search}%` } },
      ];
    }
    if (branchId) {
      where.branchId = branchId;
    }
    if (memberId) {
      where.memberId = memberId;
    }
    if (status) {
      where.status = status;
    }
    if (startDate && endDate) {
      where.refundDate = {
        [Op.between]: [startDate, endDate],
      };
    }

    const refunds = await SubscriptionRefund.findAll({
      where,
      include: [
        { model: GymSubscription, as: "subscription", attributes: ["id", "subscriptionNumber"] },
        { model: Branch, as: "branch", attributes: ["id", "arabicName", "englishName"] },
        { model: Member, as: "member", attributes: ["id", "name", "memberCode"], required: false },
        { model: User, as: "creator", attributes: ["id", "arabicName", "englinshName"], required: false },
      ],
      order: [["refundDate", "DESC"], ["createdAt", "DESC"]],
    });

    // Convert Sequelize models to plain objects
    const refundsData = refunds.map(refund => refund.toJSON ? refund.toJSON() : refund);

    res.json({
      success: true,
      data: refundsData,
      count: refundsData.length,
    });
  } catch (error) {
    console.error("Error fetching subscription refunds:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching subscription refunds",
      error: error.message,
    });
  }
};

// Get refund by ID
exports.getRefundById = async (req, res) => {
  try {
    const { id } = req.params;
    const refund = await SubscriptionRefund.findByPk(id, {
      include: [
        { model: GymSubscription, as: "subscription" },
        { model: Branch, as: "branch" },
        { model: Member, as: "member", required: false },
        { model: User, as: "creator", required: false },
      ],
    });

    if (!refund) {
      return res.status(404).json({
        success: false,
        message: "Refund not found",
      });
    }

    res.json({
      success: true,
      data: refund,
    });
  } catch (error) {
    console.error("Error fetching refund:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching refund",
      error: error.message,
    });
  }
};

// Create subscription refund
exports.createRefund = async (req, res) => {
  try {
    const refundData = { ...req.body };
    const { subscriptionId, stopDate } = refundData;

    // Get the original subscription
    const originalSubscription = await GymSubscription.findByPk(subscriptionId);
    if (!originalSubscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    // Validate stop date
    const stop = new Date(stopDate);
    const start = new Date(originalSubscription.subscriptionStartDate);
    const end = new Date(originalSubscription.subscriptionEndDate);
    
    if (stop < start || stop > end) {
      return res.status(400).json({
        success: false,
        message: "تاريخ الإيقاف يجب أن يكون بين تاريخي البداية والنهاية للاشتراك",
      });
    }

    // Calculate remaining days
    const remainingDays = Math.ceil((end - stop) / (1000 * 60 * 60 * 24));
    
    if (remainingDays <= 0) {
      return res.status(400).json({
        success: false,
        message: "لا توجد أيام متبقية في الاشتراك",
      });
    }

    // Calculate total days
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    
    // Calculate daily rate
    const subscriptionValue = parseFloat(originalSubscription.subscriptionValue || 0);
    const discountValue = originalSubscription.discountEnabled ? (parseFloat(originalSubscription.discountValue || 0)) : 0;
    const netValue = subscriptionValue - discountValue;
    const dailyRate = totalDays > 0 ? netValue / totalDays : 0;
    
    // Calculate refund amount
    const refundAmount = remainingDays * dailyRate;

    // Generate invoice number
    const lastRefund = await SubscriptionRefund.findOne({
      order: [["id", "DESC"]],
    });
    const nextId = lastRefund ? lastRefund.id + 1 : 1;
    const invoiceNumber = `REF-${String(nextId).padStart(6, "0")}`;

    // Prepare refund data
    refundData.subscriptionType = originalSubscription.subscriptionType;
    refundData.originalStartDate = originalSubscription.subscriptionStartDate;
    refundData.originalEndDate = originalSubscription.subscriptionEndDate;
    refundData.originalValue = netValue;
    refundData.dailyRate = dailyRate;
    refundData.remainingDays = remainingDays;
    refundData.refundAmount = refundAmount;
    refundData.invoiceNumber = invoiceNumber;
    refundData.customerName = originalSubscription.customerName;
    refundData.memberId = originalSubscription.memberId || null;
    refundData.branchId = originalSubscription.branchId;
    
    if (!refundData.refundDate) {
      refundData.refundDate = new Date().toISOString().split('T')[0];
    }

    // Create the refund record
    const refund = await SubscriptionRefund.create(refundData);

    // Update the subscription status
    await originalSubscription.update({
      subscriptionEndDate: stopDate,
      status: "expired",
    });

    // Recalculate remaining amount
    const usedDays = Math.ceil((stop - start) / (1000 * 60 * 60 * 24));
    const usedAmount = usedDays * dailyRate;
    const newRemainingAmount = netValue - usedAmount;
    
    await originalSubscription.update({
      remainingAmount: newRemainingAmount,
    });

    const refundWithRelations = await SubscriptionRefund.findByPk(refund.id, {
      include: [
        { model: GymSubscription, as: "subscription" },
        { model: Branch, as: "branch" },
        { model: Member, as: "member", required: false },
        { model: User, as: "creator", required: false },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Subscription refund created successfully",
      data: refundWithRelations,
    });
  } catch (error) {
    console.error("Error creating subscription refund:", error);
    res.status(500).json({
      success: false,
      message: "Error creating subscription refund",
      error: error.message,
    });
  }
};

// Update refund status
exports.updateRefundStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const refund = await SubscriptionRefund.findByPk(id);
    if (!refund) {
      return res.status(404).json({
        success: false,
        message: "Refund not found",
      });
    }

    await refund.update({ status });

    res.json({
      success: true,
      message: "Refund status updated successfully",
      data: refund,
    });
  } catch (error) {
    console.error("Error updating refund status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating refund status",
      error: error.message,
    });
  }
};

// Get refund statistics
exports.getRefundStatistics = async (req, res) => {
  try {
    const { branchId, startDate, endDate } = req.query;
    
    const where = {};
    if (branchId) {
      where.branchId = branchId;
    }
    if (startDate && endDate) {
      where.refundDate = {
        [Op.between]: [startDate, endDate],
      };
    }

    const refunds = await SubscriptionRefund.findAll({ where });

    let totalRefunds = refunds.length;
    let totalRefundAmount = 0;
    let pendingRefunds = 0;
    let completedRefunds = 0;
    let cancelledRefunds = 0;

    refunds.forEach(refund => {
      totalRefundAmount += parseFloat(refund.refundAmount || 0);
      if (refund.status === "pending") pendingRefunds++;
      else if (refund.status === "completed") completedRefunds++;
      else if (refund.status === "cancelled") cancelledRefunds++;
    });

    res.json({
      success: true,
      data: {
        totalRefunds,
        totalRefundAmount,
        averageRefundAmount: totalRefunds > 0 ? totalRefundAmount / totalRefunds : 0,
        pendingRefunds,
        completedRefunds,
        cancelledRefunds,
      },
    });
  } catch (error) {
    console.error("Error fetching refund statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching refund statistics",
      error: error.message,
    });
  }
};


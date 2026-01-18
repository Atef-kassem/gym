const { GymSubscription, SubscriptionTransfer, Branch, Employee, Member, User } = require("../Model/index");
const { Op } = require("sequelize");

// Get all subscription transfers
exports.getAllTransfers = async (req, res) => {
  try {
    const { search, branchId, memberId, startDate, endDate } = req.query;
    
    const where = {};
    if (search) {
      where[Op.or] = [
        { customerName: { [Op.like]: `%${search}%` } },
        { fromSubscriptionType: { [Op.like]: `%${search}%` } },
        { toSubscriptionType: { [Op.like]: `%${search}%` } },
      ];
    }
    if (branchId) {
      where.branchId = branchId;
    }
    if (memberId) {
      where.memberId = memberId;
    }
    if (startDate && endDate) {
      where.transferDate = {
        [Op.between]: [startDate, endDate],
      };
    }

    const transfers = await SubscriptionTransfer.findAll({
      where,
      include: [
        { model: GymSubscription, as: "subscription", attributes: ["id", "subscriptionNumber"] },
        { model: Branch, as: "branch", attributes: ["id", "arabicName", "englishName"] },
        { model: Member, as: "member", attributes: ["id", "name", "memberCode"], required: false },
        { model: User, as: "creator", attributes: ["id", "arabicName", "englinshName"], required: false },
      ],
      order: [["transferDate", "DESC"], ["createdAt", "DESC"]],
    });

    // Convert Sequelize models to plain objects
    const transfersData = transfers.map(transfer => transfer.toJSON ? transfer.toJSON() : transfer);

    res.json({
      success: true,
      data: transfersData,
      count: transfersData.length,
    });
  } catch (error) {
    console.error("Error fetching subscription transfers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching subscription transfers",
      error: error.message,
    });
  }
};

// Get transfer by ID
exports.getTransferById = async (req, res) => {
  try {
    const { id } = req.params;
    const transfer = await SubscriptionTransfer.findByPk(id, {
      include: [
        { model: GymSubscription, as: "subscription" },
        { model: Branch, as: "branch" },
        { model: Member, as: "member", required: false },
        { model: User, as: "creator", required: false },
      ],
    });

    if (!transfer) {
      return res.status(404).json({
        success: false,
        message: "Transfer not found",
      });
    }

    res.json({
      success: true,
      data: transfer,
    });
  } catch (error) {
    console.error("Error fetching transfer:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching transfer",
      error: error.message,
    });
  }
};

// Get member subscription history (all transfers for a member)
exports.getMemberSubscriptionHistory = async (req, res) => {
  try {
    const { memberId } = req.params;
    
    if (!memberId) {
      return res.status(400).json({
        success: false,
        message: "Member ID is required",
      });
    }

    // Get all subscriptions for this member
    const subscriptions = await GymSubscription.findAll({
      where: { memberId },
      include: [
        { model: Branch, as: "branch", attributes: ["id", "arabicName", "englishName"] },
        { model: Employee, as: "employee", attributes: ["id", "arabicName", "englishName"], required: false },
      ],
      order: [["subscriptionStartDate", "ASC"]],
    });

    // Get all transfers for this member
    const transfers = await SubscriptionTransfer.findAll({
      where: { memberId },
      include: [
        { model: GymSubscription, as: "subscription", attributes: ["id", "subscriptionNumber"] },
        { model: Branch, as: "branch", attributes: ["id", "arabicName", "englishName"] },
        { model: User, as: "creator", attributes: ["id", "arabicName", "englinshName"], required: false },
      ],
      order: [["transferDate", "ASC"], ["createdAt", "ASC"]],
    });

    res.json({
      success: true,
      data: {
        subscriptions,
        transfers,
        history: [
          ...subscriptions.map(sub => ({
            type: "subscription",
            data: sub,
            date: sub.subscriptionStartDate,
          })),
          ...transfers.map(transfer => ({
            type: "transfer",
            data: transfer,
            date: transfer.transferDate,
          })),
        ].sort((a, b) => new Date(a.date) - new Date(b.date)),
      },
    });
  } catch (error) {
    console.error("Error fetching member subscription history:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching member subscription history",
      error: error.message,
    });
  }
};

// Create subscription transfer
exports.createTransfer = async (req, res) => {
  try {
    const transferData = { ...req.body };
    const { subscriptionId } = transferData;

    // Get the original subscription
    const originalSubscription = await GymSubscription.findByPk(subscriptionId);
    if (!originalSubscription) {
      return res.status(404).json({
        success: false,
        message: "Subscription not found",
      });
    }

    // Prepare transfer data
    transferData.fromSubscriptionType = originalSubscription.subscriptionType;
    transferData.fromStartDate = originalSubscription.subscriptionStartDate;
    transferData.fromEndDate = originalSubscription.subscriptionEndDate;
    transferData.fromValue = originalSubscription.subscriptionValue;
    transferData.customerName = originalSubscription.customerName;
    transferData.memberId = originalSubscription.memberId || null;
    transferData.branchId = originalSubscription.branchId;
    
    if (!transferData.transferDate) {
      transferData.transferDate = new Date().toISOString().split('T')[0];
    }

    // Create the transfer record
    const transfer = await SubscriptionTransfer.create(transferData);

    // Update the original subscription
    await originalSubscription.update({
      subscriptionType: transferData.toSubscriptionType,
      subscriptionStartDate: transferData.toStartDate,
      subscriptionEndDate: transferData.toEndDate,
      subscriptionValue: transferData.toValue,
      // Recalculate remaining amount if needed
      remainingAmount: transferData.toValue - (originalSubscription.discountValue || 0) - (originalSubscription.paidAmount || 0),
    });

    // Recalculate status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(transferData.toStartDate);
    const endDate = new Date(transferData.toEndDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    let status = "active";
    if (today < startDate) {
      status = "upcoming";
    } else if (today > endDate) {
      status = "expired";
    }

    await originalSubscription.update({ status });

    const transferWithRelations = await SubscriptionTransfer.findByPk(transfer.id, {
      include: [
        { model: GymSubscription, as: "subscription" },
        { model: Branch, as: "branch" },
        { model: Member, as: "member", required: false },
        { model: User, as: "creator", required: false },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Subscription transfer created successfully",
      data: transferWithRelations,
    });
  } catch (error) {
    console.error("Error creating subscription transfer:", error);
    res.status(500).json({
      success: false,
      message: "Error creating subscription transfer",
      error: error.message,
    });
  }
};

// Get transfer statistics
exports.getTransferStatistics = async (req, res) => {
  try {
    const { branchId, startDate, endDate } = req.query;
    
    const where = {};
    if (branchId) {
      where.branchId = branchId;
    }
    if (startDate && endDate) {
      where.transferDate = {
        [Op.between]: [startDate, endDate],
      };
    }

    const transfers = await SubscriptionTransfer.findAll({ where });

    let totalTransfers = transfers.length;
    let totalValueDifference = 0;

    transfers.forEach(transfer => {
      totalValueDifference += parseFloat(transfer.toValue || 0) - parseFloat(transfer.fromValue || 0);
    });

    res.json({
      success: true,
      data: {
        totalTransfers,
        totalValueDifference,
        averageValueDifference: totalTransfers > 0 ? totalValueDifference / totalTransfers : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching transfer statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching transfer statistics",
      error: error.message,
    });
  }
};


const { Locker, LockerSubscription, LockerSubscriptionType, Branch, Employee } = require("../Model/index");
const { Op } = require("sequelize");

// Get all lockers
exports.getAllLockers = async (req, res) => {
  try {
    const { mainBranchId, subBranchId, lockerNumber, isAvailable } = req.query;
    
    const where = {};
    if (mainBranchId) {
      where.mainBranchId = mainBranchId;
    }
    if (subBranchId) {
      where.subBranchId = subBranchId;
    }
    if (lockerNumber) {
      where.lockerNumber = { [Op.like]: `%${lockerNumber}%` };
    }
    if (isAvailable !== undefined) {
      where.isAvailable = isAvailable === "true";
    }

    const lockers = await Locker.findAll({
      where,
      include: [
        { model: Branch, as: "mainBranch", attributes: ["id", "arabicName", "englishName"] },
        { model: Branch, as: "subBranch", attributes: ["id", "arabicName", "englishName"] },
      ],
      order: [["lockerNumber", "ASC"]],
    });

    res.json({
      success: true,
      data: lockers,
      count: lockers.length,
    });
  } catch (error) {
    console.error("Error fetching lockers:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching lockers",
      error: error.message,
    });
  }
};

// Get locker by ID
exports.getLockerById = async (req, res) => {
  try {
    const { id } = req.params;
    const locker = await Locker.findByPk(id, {
      include: [
        { model: Branch, as: "mainBranch" },
        { model: Branch, as: "subBranch" },
      ],
    });

    if (!locker) {
      return res.status(404).json({
        success: false,
        message: "Locker not found",
      });
    }

    res.json({
      success: true,
      data: locker,
    });
  } catch (error) {
    console.error("Error fetching locker:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching locker",
      error: error.message,
    });
  }
};

// Create locker
exports.createLocker = async (req, res) => {
  try {
    const locker = await Locker.create(req.body);
    
    const lockerWithRelations = await Locker.findByPk(locker.id, {
      include: [
        { model: Branch, as: "mainBranch" },
        { model: Branch, as: "subBranch" },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Locker created successfully",
      data: lockerWithRelations,
    });
  } catch (error) {
    console.error("Error creating locker:", error);
    res.status(500).json({
      success: false,
      message: "Error creating locker",
      error: error.message,
    });
  }
};

// Update locker
exports.updateLocker = async (req, res) => {
  try {
    const { id } = req.params;
    const locker = await Locker.findByPk(id);
    
    if (!locker) {
      return res.status(404).json({
        success: false,
        message: "Locker not found",
      });
    }

    await locker.update(req.body);
    
    const lockerWithRelations = await Locker.findByPk(id, {
      include: [
        { model: Branch, as: "mainBranch" },
        { model: Branch, as: "subBranch" },
      ],
    });

    res.json({
      success: true,
      message: "Locker updated successfully",
      data: lockerWithRelations,
    });
  } catch (error) {
    console.error("Error updating locker:", error);
    res.status(500).json({
      success: false,
      message: "Error updating locker",
      error: error.message,
    });
  }
};

// Delete locker
exports.deleteLocker = async (req, res) => {
  try {
    const { id } = req.params;
    const locker = await Locker.findByPk(id);
    
    if (!locker) {
      return res.status(404).json({
        success: false,
        message: "Locker not found",
      });
    }

    // Check if locker has active subscriptions
    const activeSubscriptions = await LockerSubscription.count({
      where: {
        lockerId: id,
        status: "active",
      },
    });

    if (activeSubscriptions > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete locker with active subscriptions",
      });
    }

    await locker.destroy();

    res.json({
      success: true,
      message: "Locker deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting locker:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting locker",
      error: error.message,
    });
  }
};

// Get locker subscription types
exports.getLockerSubscriptionTypes = async (req, res) => {
  try {
    const subscriptionTypes = await LockerSubscriptionType.findAll({
      where: { isActive: true },
      order: [["name", "ASC"]],
    });

    res.json({
      success: true,
      data: subscriptionTypes,
    });
  } catch (error) {
    console.error("Error fetching locker subscription types:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching locker subscription types",
      error: error.message,
    });
  }
};

// Create locker subscription type
exports.createLockerSubscriptionType = async (req, res) => {
  try {
    const subscriptionType = await LockerSubscriptionType.create(req.body);

    res.status(201).json({
      success: true,
      message: "Locker subscription type created successfully",
      data: subscriptionType,
    });
  } catch (error) {
    console.error("Error creating locker subscription type:", error);
    res.status(500).json({
      success: false,
      message: "Error creating locker subscription type",
      error: error.message,
    });
  }
};

// Update locker subscription type
exports.updateLockerSubscriptionType = async (req, res) => {
  try {
    const { id } = req.params;
    const subscriptionType = await LockerSubscriptionType.findByPk(id);
    
    if (!subscriptionType) {
      return res.status(404).json({
        success: false,
        message: "Locker subscription type not found",
      });
    }

    await subscriptionType.update(req.body);

    res.json({
      success: true,
      message: "Locker subscription type updated successfully",
      data: subscriptionType,
    });
  } catch (error) {
    console.error("Error updating locker subscription type:", error);
    res.status(500).json({
      success: false,
      message: "Error updating locker subscription type",
      error: error.message,
    });
  }
};

// Delete locker subscription type
exports.deleteLockerSubscriptionType = async (req, res) => {
  try {
    const { id } = req.params;
    const subscriptionType = await LockerSubscriptionType.findByPk(id);
    
    if (!subscriptionType) {
      return res.status(404).json({
        success: false,
        message: "Locker subscription type not found",
      });
    }

    await subscriptionType.destroy();

    res.json({
      success: true,
      message: "Locker subscription type deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting locker subscription type:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting locker subscription type",
      error: error.message,
    });
  }
};

// Get all locker subscriptions
exports.getAllLockerSubscriptions = async (req, res) => {
  try {
    const { search, mainBranchId, subBranchId, status } = req.query;
    
    const where = {};
    if (search) {
      where[Op.or] = [
        { customerName: { [Op.like]: `%${search}%` } },
        { subscriptionNumber: { [Op.like]: `%${search}%` } },
        { receiptNumber: { [Op.like]: `%${search}%` } },
      ];
    }
    if (mainBranchId) {
      where.mainBranchId = mainBranchId;
    }
    if (subBranchId) {
      where.subBranchId = subBranchId;
    }
    if (status) {
      where.status = status;
    }

    const subscriptions = await LockerSubscription.findAll({
      where,
      include: [
        { model: Branch, as: "mainBranch", attributes: ["id", "arabicName", "englishName"] },
        { model: Branch, as: "subBranch", attributes: ["id", "arabicName", "englishName"] },
        { model: Locker, as: "locker", attributes: ["id", "lockerNumber"] },
        { model: LockerSubscriptionType, as: "subscriptionType", attributes: ["id", "name", "days"] },
        { model: Employee, as: "recommendedEmployee", attributes: ["id", "arabicName", "englishName"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      data: subscriptions,
      count: subscriptions.length,
    });
  } catch (error) {
    console.error("Error fetching locker subscriptions:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching locker subscriptions",
      error: error.message,
    });
  }
};

// Create locker subscription
exports.createLockerSubscription = async (req, res) => {
  try {
    // Generate subscription number if not provided
    if (!req.body.subscriptionNumber) {
      const lastSubscription = await LockerSubscription.findOne({
        order: [["id", "DESC"]],
      });
      const nextId = lastSubscription ? lastSubscription.id + 1 : 1;
      req.body.subscriptionNumber = `LOCK${String(nextId).padStart(6, "0")}`;
    }

    // Calculate status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(req.body.subscriptionStartDate);
    const endDate = new Date(req.body.subscriptionEndDate);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    if (today < startDate) {
      req.body.status = "upcoming";
    } else if (today > endDate) {
      req.body.status = "expired";
    } else {
      req.body.status = "active";
    }

    // Mark locker as unavailable
    const locker = await Locker.findByPk(req.body.lockerId);
    if (locker) {
      await locker.update({ isAvailable: false });
    }

    const subscription = await LockerSubscription.create(req.body);
    
    const subscriptionWithRelations = await LockerSubscription.findByPk(subscription.id, {
      include: [
        { model: Branch, as: "mainBranch" },
        { model: Branch, as: "subBranch" },
        { model: Locker, as: "locker" },
        { model: LockerSubscriptionType, as: "subscriptionType" },
        { model: Employee, as: "recommendedEmployee" },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Locker subscription created successfully",
      data: subscriptionWithRelations,
    });
  } catch (error) {
    console.error("Error creating locker subscription:", error);
    res.status(500).json({
      success: false,
      message: "Error creating locker subscription",
      error: error.message,
    });
  }
};

// Get locker subscription statistics
exports.getLockerStatistics = async (req, res) => {
  try {
    const total = await Locker.count();
    const available = await Locker.count({ where: { isAvailable: true } });
    const unavailable = await Locker.count({ where: { isAvailable: false } });
    
    const subscriptions = await LockerSubscription.findAll();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let activeSubscriptions = 0;
    let expiredSubscriptions = 0;
    
    subscriptions.forEach(sub => {
      const endDate = new Date(sub.subscriptionEndDate);
      endDate.setHours(0, 0, 0, 0);
      if (today > endDate) {
        expiredSubscriptions++;
      } else {
        activeSubscriptions++;
      }
    });

    res.json({
      success: true,
      data: {
        total,
        available,
        unavailable,
        activeSubscriptions,
        expiredSubscriptions,
      },
    });
  } catch (error) {
    console.error("Error fetching locker statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching locker statistics",
      error: error.message,
    });
  }
};


const { GymSubscriptionType } = require("../Model/index");

// Get all gym subscription types
exports.getAllSubscriptionTypes = async (req, res) => {
  try {
    const subscriptionTypes = await GymSubscriptionType.findAll({
      where: { isActive: true },
      order: [["name", "ASC"]],
    });

    res.json({
      success: true,
      data: subscriptionTypes,
      count: subscriptionTypes.length,
    });
  } catch (error) {
    console.error("Error fetching gym subscription types:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching gym subscription types",
      error: error.message,
    });
  }
};

// Create gym subscription type
exports.createSubscriptionType = async (req, res) => {
  try {
    const subscriptionType = await GymSubscriptionType.create(req.body);

    res.status(201).json({
      success: true,
      message: "Gym subscription type created successfully",
      data: subscriptionType,
    });
  } catch (error) {
    console.error("Error creating gym subscription type:", error);
    res.status(500).json({
      success: false,
      message: "Error creating gym subscription type",
      error: error.message,
    });
  }
};

// Update gym subscription type
exports.updateSubscriptionType = async (req, res) => {
  try {
    const { id } = req.params;
    const subscriptionType = await GymSubscriptionType.findByPk(id);

    if (!subscriptionType) {
      return res.status(404).json({
        success: false,
        message: "Gym subscription type not found",
      });
    }

    await subscriptionType.update(req.body);

    res.json({
      success: true,
      message: "Gym subscription type updated successfully",
      data: subscriptionType,
    });
  } catch (error) {
    console.error("Error updating gym subscription type:", error);
    res.status(500).json({
      success: false,
      message: "Error updating gym subscription type",
      error: error.message,
    });
  }
};

// Delete gym subscription type
exports.deleteSubscriptionType = async (req, res) => {
  try {
    const { id } = req.params;
    const subscriptionType = await GymSubscriptionType.findByPk(id);

    if (!subscriptionType) {
      return res.status(404).json({
        success: false,
        message: "Gym subscription type not found",
      });
    }

    await subscriptionType.destroy();

    res.json({
      success: true,
      message: "Gym subscription type deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting gym subscription type:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting gym subscription type",
      error: error.message,
    });
  }
};



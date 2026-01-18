const { MembershipType } = require("../Model/index");

exports.getAllMembershipTypes = async (req, res) => {
  try {
    const membershipTypes = await MembershipType.findAll({
      where: { isActive: true },
      order: [["name", "ASC"]],
    });

    res.json({
      success: true,
      data: membershipTypes,
    });
  } catch (error) {
    console.error("Error fetching membership types:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching membership types",
      error: error.message,
    });
  }
};

exports.getMembershipTypeById = async (req, res) => {
  try {
    const { id } = req.params;
    const membershipType = await MembershipType.findByPk(id);

    if (!membershipType) {
      return res.status(404).json({
        success: false,
        message: "Membership type not found",
      });
    }

    res.json({
      success: true,
      data: membershipType,
    });
  } catch (error) {
    console.error("Error fetching membership type:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching membership type",
      error: error.message,
    });
  }
};

exports.createMembershipType = async (req, res) => {
  try {
    const membershipType = await MembershipType.create(req.body);

    res.status(201).json({
      success: true,
      message: "Membership type created successfully",
      data: membershipType,
    });
  } catch (error) {
    console.error("Error creating membership type:", error);
    res.status(500).json({
      success: false,
      message: "Error creating membership type",
      error: error.message,
    });
  }
};

exports.updateMembershipType = async (req, res) => {
  try {
    const { id } = req.params;
    const membershipType = await MembershipType.findByPk(id);
    
    if (!membershipType) {
      return res.status(404).json({
        success: false,
        message: "Membership type not found",
      });
    }

    await membershipType.update(req.body);

    res.json({
      success: true,
      message: "Membership type updated successfully",
      data: membershipType,
    });
  } catch (error) {
    console.error("Error updating membership type:", error);
    res.status(500).json({
      success: false,
      message: "Error updating membership type",
      error: error.message,
    });
  }
};

exports.deleteMembershipType = async (req, res) => {
  try {
    const { id } = req.params;
    const membershipType = await MembershipType.findByPk(id);
    
    if (!membershipType) {
      return res.status(404).json({
        success: false,
        message: "Membership type not found",
      });
    }

    await membershipType.destroy();

    res.json({
      success: true,
      message: "Membership type deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting membership type:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting membership type",
      error: error.message,
    });
  }
};


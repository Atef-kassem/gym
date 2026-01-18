const { Inbody, Member } = require("../Model/index");
const { Op } = require("sequelize");

// Get all inbody records for a member
exports.getAllInbody = async (req, res) => {
  try {
    const { memberId } = req.query;
    
    const where = {};
    if (memberId) {
      where.memberId = memberId;
    }

    const inbodyRecords = await Inbody.findAll({
      where,
      include: [
        {
          model: Member,
          as: "member",
          attributes: ["id", "name", "memberCode", "phone"],
          required: false,
        },
      ],
      order: [["measurementDate", "DESC"]],
    });

    res.json({
      success: true,
      data: inbodyRecords,
      count: inbodyRecords.length,
    });
  } catch (error) {
    console.error("Error fetching inbody records:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching inbody records",
      error: error.message,
    });
  }
};

// Create inbody record
exports.createInbody = async (req, res) => {
  try {
    const inbody = await Inbody.create(req.body);
    const inbodyWithMember = await Inbody.findByPk(inbody.id, {
      include: [
        {
          model: Member,
          as: "member",
          attributes: ["id", "name", "memberCode"],
        },
      ],
    });
    res.status(201).json({
      success: true,
      message: "Inbody record created successfully",
      data: inbodyWithMember,
    });
  } catch (error) {
    console.error("Error creating inbody record:", error);
    res.status(500).json({
      success: false,
      message: "Error creating inbody record",
      error: error.message,
    });
  }
};

// Update inbody record
exports.updateInbody = async (req, res) => {
  try {
    const { id } = req.params;
    const inbody = await Inbody.findByPk(id);
    if (!inbody) {
      return res.status(404).json({
        success: false,
        message: "Inbody record not found",
      });
    }
    await inbody.update(req.body);
    const inbodyWithMember = await Inbody.findByPk(id, {
      include: [
        {
          model: Member,
          as: "member",
          attributes: ["id", "name", "memberCode"],
        },
      ],
    });
    res.json({
      success: true,
      message: "Inbody record updated successfully",
      data: inbodyWithMember,
    });
  } catch (error) {
    console.error("Error updating inbody record:", error);
    res.status(500).json({
      success: false,
      message: "Error updating inbody record",
      error: error.message,
    });
  }
};

// Delete inbody record
exports.deleteInbody = async (req, res) => {
  try {
    const { id } = req.params;
    const inbody = await Inbody.findByPk(id);
    if (!inbody) {
      return res.status(404).json({
        success: false,
        message: "Inbody record not found",
      });
    }
    await inbody.destroy();
    res.json({
      success: true,
      message: "Inbody record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting inbody record:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting inbody record",
      error: error.message,
    });
  }
};


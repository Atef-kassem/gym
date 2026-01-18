const { Section } = require("../Model");

exports.getAllSections = async (req, res) => {
  try {
    const sections = await Section.findAll();
    res.status(200).json({ success: true, data: sections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

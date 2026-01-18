const { suppliersSchema: Supplier } = require("../Model/index");
const { Op } = require("sequelize");

exports.list = async (req, res) => {
  try {
    const { q } = req.query;
    const where = q
      ? { [Op.or]: [{ name_ar: { [Op.like]: `%${q}%` } }, { name_en: { [Op.like]: `%${q}%` } }, { email: { [Op.like]: `%${q}%` } }] }
      : {};
    const suppliers = await Supplier.findAll({ where, order: [["supplier_id", "DESC"]] });
    res.json({ status: "success", results: suppliers.length, data: suppliers });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ status: "fail", message: "Supplier not found" });
    res.json({ status: "success", data: supplier });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const payload = req.body;
    const created = await Supplier.create(payload);
    res.status(201).json({ status: "success", data: created });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ status: "fail", message: "Supplier not found" });
    await supplier.update(req.body);
    res.json({ status: "success", data: supplier });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const supplier = await Supplier.findByPk(req.params.id);
    if (!supplier) return res.status(404).json({ status: "fail", message: "Supplier not found" });
    await supplier.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};



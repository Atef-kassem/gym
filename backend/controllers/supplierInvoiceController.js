const SupplierInvoice = require("../Model/supplierInvoiceModel");
const { Op } = require("sequelize");

exports.list = async (req, res) => {
  try {
    const { supplier_id, status, q } = req.query;
    const where = { isDeleted: false };
    if (supplier_id) where.supplier_id = supplier_id;
    if (status) where.status = status;
    if (q) where.invoiceNumber = { [Op.like]: `%${q}%` };
    const rows = await SupplierInvoice.findAll({ where, order: [["invoiceDate", "DESC"]] });
    res.json({ status: "success", results: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.get = async (req, res) => {
  try {
    const row = await SupplierInvoice.findByPk(req.params.id);
    if (!row) return res.status(404).json({ status: "fail", message: "Invoice not found" });
    res.json({ status: "success", data: row });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const payload = req.body;
    const created = await SupplierInvoice.create(payload).then((i) => i.calculateTotals());
    await created.save();
    res.status(201).json({ status: "success", data: created });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const row = await SupplierInvoice.findByPk(req.params.id);
    if (!row) return res.status(404).json({ status: "fail", message: "Invoice not found" });
    await row.update(req.body);
    row.calculateTotals();
    await row.save();
    res.json({ status: "success", data: row });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const row = await SupplierInvoice.findByPk(req.params.id);
    if (!row) return res.status(404).json({ status: "fail", message: "Invoice not found" });
    await row.destroy();
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};



const { Feedback, Customer } = require("../Model");
const catchAsync = require("../utils/catchAsync");

exports.createFeedback = catchAsync(async (req, res) => {
  const payload = req.body || {};
  const record = await Feedback.create(payload);
  const created = await Feedback.findByPk(record.id, {
    include: [{ model: Customer, as: "customer" }],
  });
  res.status(201).json({ status: "success", data: created });
});

exports.getFeedbacks = catchAsync(async (req, res) => {
  const rows = await Feedback.findAll({
    include: [{ model: Customer, as: "customer" }],
    order: [["createdAt", "DESC"]],
  });
  res.status(200).json({ status: "success", data: rows, total: rows.length });
});

exports.getFeedbackById = catchAsync(async (req, res) => {
  const id = req.params.id;
  const record = await Feedback.findByPk(id, {
    include: [{ model: Customer, as: "customer" }],
  });
  res.status(200).json({ status: "success", data: record });
});

exports.updateFeedback = catchAsync(async (req, res) => {
  const id = req.params.id;
  await Feedback.update(req.body || {}, { where: { id } });
  const updated = await Feedback.findByPk(id, {
    include: [{ model: Customer, as: "customer" }],
  });
  res.status(200).json({ status: "success", data: updated });
});

exports.deleteFeedback = catchAsync(async (req, res) => {
  const id = req.params.id;
  await Feedback.destroy({ where: { id } });
  res.status(204).json({ status: "success" });
});



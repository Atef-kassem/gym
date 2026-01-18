const { Op } = require("sequelize");
const Car = require("../Model/schema/carSchema");
const Customer = require("../Model/schema/customerSchema");
const catchAsync = require("../utils/catchAsync");

exports.list = catchAsync(async (req, res) => {
  const { q, make, model, color, year, limit = 1000000000, offset = 0 } = req.query;
  const where = {};
  const customerWhere = {};
  if (make) where.make = { [Op.like]: `%${make}%` };
  if (model) where.model = { [Op.like]: `%${model}%` };
  if (color) where.color = { [Op.like]: `%${color}%` };
  if (year) where.year = { [Op.like]: `%${year}%` };
  if (q) {
    where[Op.or] = [
      { plate: { [Op.like]: `%${q}%` } },
      { make: { [Op.like]: `%${q}%` } },
      { model: { [Op.like]: `%${q}%` } },
      { color: { [Op.like]: `%${q}%` } },
    ];
  }
  const { rows, count } = await Car.findAndCountAll({
    where,
    include: [
      { model: Customer, as: "customer", where: customerWhere, attributes: ["id", "name", "phone"] },
    ],
    order: [["createdAt", "DESC"]],
    limit: Number(limit),
    offset: Number(offset),
  });
  res.json({ status: "success", data: rows, total: count });
});



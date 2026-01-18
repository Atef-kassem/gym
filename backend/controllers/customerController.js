const { Op } = require("sequelize");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Customer = require("../Model/schema/customerSchema");
const Car = require("../Model/schema/carSchema");
const Contact = require("../Model/schema/contactSchema");
const RelatedPerson = require("../Model/schema/relatedPersonSchema");

// Include relations
const includeRelations = [
  { model: Car, as: "cars" },
  { model: Contact, as: "contacts" },
  { model: RelatedPerson, as: "relatedCustomers" },
];

exports.list = catchAsync(async (req, res) => {
  const { q, type, limit = 50, offset = 0 } = req.query;
  const where = {};
  if (type) where.customerType = type;
  if (q) {
    where[Op.or] = [
      { name: { [Op.like]: `%${q}%` } },
      { phone: { [Op.like]: `%${q}%` } },
      { email: { [Op.like]: `%${q}%` } },
    ];
  }
  const { rows, count } = await Customer.findAndCountAll({
    where,
    include: includeRelations,
    order: [["createdAt", "DESC"]],
    limit: Number(limit),
    offset: Number(offset),
  });
  res.json({ status: "success", data: rows, total: count });
});

exports.getById = catchAsync(async (req, res, next) => {
  const customer = await Customer.findByPk(req.params.id, { include: includeRelations });
  if (!customer) return next(new AppError("Customer not found", 404));
  res.json({ status: "success", data: customer });
});

exports.create = catchAsync(async (req, res) => {
  const { cars = [], contacts = [], relatedCustomers = [], ...customerData } = req.body;
  const created = await Customer.create(customerData);

  const sanitize = (obj = {}) => {
    const { id, customerId, createdAt, updatedAt, ...rest } = obj;
    return rest;
  };

  if (cars.length)
    await Car.bulkCreate(cars.map((c) => ({ ...sanitize(c), customerId: created.id })));
  if (contacts.length)
    await Contact.bulkCreate(contacts.map((c) => ({ ...sanitize(c), customerId: created.id })));
  if (relatedCustomers.length)
    await RelatedPerson.bulkCreate(relatedCustomers.map((c) => ({ ...sanitize(c), customerId: created.id })));
  const withRelations = await Customer.findByPk(created.id, { include: includeRelations });
  res.status(201).json({ status: "success", data: withRelations });
});

exports.update = catchAsync(async (req, res, next) => {
  const { cars, contacts, relatedCustomers, ...customerData } = req.body;
  const existing = await Customer.findByPk(req.params.id);
  if (!existing) return next(new AppError("Customer not found", 404));
  await existing.update(customerData);

  // Replace children if provided
  const sanitize = (obj = {}) => {
    const { id, customerId, createdAt, updatedAt, ...rest } = obj;
    return rest;
  };
  if (Array.isArray(cars)) {
    await Car.destroy({ where: { customerId: existing.id } });
    if (cars.length) await Car.bulkCreate(cars.map((c) => ({ ...sanitize(c), customerId: existing.id })));
  }
  if (Array.isArray(contacts)) {
    await Contact.destroy({ where: { customerId: existing.id } });
    if (contacts.length) await Contact.bulkCreate(contacts.map((c) => ({ ...sanitize(c), customerId: existing.id })));
  }
  if (Array.isArray(relatedCustomers)) {
    await RelatedPerson.destroy({ where: { customerId: existing.id } });
    if (relatedCustomers.length)
      await RelatedPerson.bulkCreate(relatedCustomers.map((c) => ({ ...sanitize(c), customerId: existing.id })));
  }

  const withRelations = await Customer.findByPk(existing.id, { include: includeRelations });
  res.json({ status: "success", data: withRelations });
});

exports.remove = catchAsync(async (req, res, next) => {
  const existing = await Customer.findByPk(req.params.id);
  if (!existing) return next(new AppError("Customer not found", 404));
  await Car.destroy({ where: { customerId: existing.id } });
  await Contact.destroy({ where: { customerId: existing.id } });
  await RelatedPerson.destroy({ where: { customerId: existing.id } });
  await existing.destroy();
  res.status(204).json({ status: "success" });
});



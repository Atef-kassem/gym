const { Op } = require("sequelize");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Campaign = require("../Model/schema/campaignSchema");
const CampaignTarget = require("../Model/schema/campaignTargetSchema");
const Customer = require("../Model/schema/customerSchema");
const Car = require("../Model/schema/carSchema");

exports.list = catchAsync(async (req, res) => {
  const { q, status, channel, limit = 50, offset = 0 } = req.query;
  const where = {};
  if (status) where.status = status;
  if (channel) where.channel = { [Op.like]: `%${channel}%` };
  if (q) {
    where[Op.or] = [
      { name: { [Op.like]: `%${q}%` } },
      { description: { [Op.like]: `%${q}%` } },
      { targetAudience: { [Op.like]: `%${q}%` } },
    ];
  }
  const { rows, count } = await Campaign.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    include: [{ model: CampaignTarget, as: "targets", include: [{ model: Customer, as: "customer" }] }],
    limit: Number(limit),
    offset: Number(offset),
  });
  res.json({ status: "success", data: rows, total: count });
});

exports.getById = catchAsync(async (req, res, next) => {
  const record = await Campaign.findByPk(req.params.id, {
    include: [{ model: CampaignTarget, as: "targets", include: [{ model: Customer, as: "customer" }] }],
  });
  if (!record) return next(new AppError("Campaign not found", 404));
  res.json({ status: "success", data: record });
});

exports.create = catchAsync(async (req, res) => {
  const { customerIds = [], targetAudience, location, vehicleMake, ...body } = req.body || {};
  const created = await Campaign.create(body);
  let selectedIds = [];
  if (Array.isArray(customerIds) && customerIds.length) {
    selectedIds = customerIds;
  } else {
    const where = {};
    let include = [];
    if (targetAudience === "جميع العملاء") {
      // no extra filters
    } else if (targetAudience === "عملاء VIP") {
      where.customerType = { [Op.in]: ["Company", "Group"] };
    } else if (targetAudience === "عملاء جدد") {
      const since = new Date();
      since.setDate(since.getDate() - 30);
      where.joinDate = { [Op.gte]: since };
    } else if (targetAudience === "عملاء غير نشطين") {
      const before = new Date();
      before.setDate(before.getDate() - 60);
      where[Op.or] = [
        { lastVisit: { [Op.lt]: before } },
        { lastVisit: null },
      ];
    } else if (targetAudience === "حسب المدينة" && location) {
      where.address = { [Op.like]: `%${location}%` };
    } else if (targetAudience === "حسب نوع المشروب" && vehicleMake) {
      include = [{ model: Car, as: "cars", where: { make: { [Op.like]: `%${vehicleMake}%` } } }];
    }
    const found = await Customer.findAll({ where, include, attributes: ["id"], raw: true });
    selectedIds = found.map((r) => r.id);
  }
  if (selectedIds.length) {
    const rows = selectedIds.map((cid) => ({ campaignId: created.id, customerId: cid }));
    await CampaignTarget.bulkCreate(rows);
    await created.update({ totalTargets: selectedIds.length });
  }
  const withTargets = await Campaign.findByPk(created.id, {
    include: [{ model: CampaignTarget, as: "targets", include: [{ model: Customer, as: "customer" }] }],
  });
  res.status(201).json({ status: "success", data: withTargets });
});

exports.update = catchAsync(async (req, res, next) => {
  const existing = await Campaign.findByPk(req.params.id);
  if (!existing) return next(new AppError("Campaign not found", 404));
  const { customerIds, targetAudience, location, vehicleMake, ...body } = req.body || {};
  await existing.update(body);
  let selectedIds = null;
  if (Array.isArray(customerIds)) {
    selectedIds = customerIds;
  } else if (targetAudience) {
    const where = {};
    let include = [];
    if (targetAudience === "جميع العملاء") {
      // no where
    } else if (targetAudience === "عملاء VIP") {
      where.customerType = { [Op.in]: ["Company", "Group"] };
    } else if (targetAudience === "عملاء جدد") {
      const since = new Date();
      since.setDate(since.getDate() - 30);
      where.joinDate = { [Op.gte]: since };
    } else if (targetAudience === "عملاء غير نشطين") {
      const before = new Date();
      before.setDate(before.getDate() - 60);
      where[Op.or] = [
        { lastVisit: { [Op.lt]: before } },
        { lastVisit: null },
      ];
    } else if (targetAudience === "حسب المدينة" && location) {
      where.address = { [Op.like]: `%${location}%` };
    } else if (targetAudience === "حسب نوع المشروب" && vehicleMake) {
      include = [{ model: Car, as: "cars", where: { make: { [Op.like]: `%${vehicleMake}%` } } }];
    }
    const found = await Customer.findAll({ where, include, attributes: ["id"], raw: true });
    selectedIds = found.map((r) => r.id);
  }
  if (selectedIds) {
    await CampaignTarget.destroy({ where: { campaignId: existing.id } });
    if (selectedIds.length) {
      const rows = selectedIds.map((cid) => ({ campaignId: existing.id, customerId: cid }));
      await CampaignTarget.bulkCreate(rows);
    }
    await existing.update({ totalTargets: selectedIds.length });
  }
  const withTargets = await Campaign.findByPk(existing.id, {
    include: [{ model: CampaignTarget, as: "targets", include: [{ model: Customer, as: "customer" }] }],
  });
  res.json({ status: "success", data: withTargets });
});

exports.remove = catchAsync(async (req, res, next) => {
  const existing = await Campaign.findByPk(req.params.id);
  if (!existing) return next(new AppError("Campaign not found", 404));
  await existing.destroy();
  res.status(204).json({ status: "success" });
});



const sequelize = require("../../Config/sequelize");
const { Op } = require("sequelize");
const PurchaseRequisition = require("../schema/purchaseRequisitionSchema");
const PurchaseRequisitionItem = require("../schema/purchaseRequisitionItemSchema");

class PurchaseRequisitionRepository {
	_generateRequestNumber() {
		const year = new Date().getFullYear();
		return `PR-${year}-${String(Date.now()).slice(-6)}`;
	}
	async create(data) {
		const { items = [], ...header } = data;
		return await sequelize.transaction(async (t) => {
			const toCreate = { ...header };
			if (!toCreate.requestNumber) {
				toCreate.requestNumber = this._generateRequestNumber();
			}
			let rec;
			try {
				rec = await PurchaseRequisition.create(toCreate, { transaction: t });
			} catch (err) {
				// handle duplicate requestNumber by regenerating once
				if (err && err.name && err.name.includes('UniqueConstraintError')) {
					toCreate.requestNumber = this._generateRequestNumber();
					rec = await PurchaseRequisition.create(toCreate, { transaction: t });
				} else {
					throw err;
				}
			}
			if (items.length) {
				await PurchaseRequisitionItem.bulkCreate(
					items.map((x) => ({ ...x, requisitionId: rec.id })),
					{ transaction: t }
				);
			}
			return rec;
		});
	}

	async findById(id) {
		return await PurchaseRequisition.findByPk(id, { include: [{ model: PurchaseRequisitionItem, as: "items" }] });
	}

	async update(id, body) {
		return await PurchaseRequisition.update(body, { where: { id } });
	}

	async list({ search = "", status, department, page = 1, limit = 20 } = {}) {
		const where = {};
		if (status) where.status = status;
		if (department) where.requestingDepartment = department;
		if (search) {
			where[Op.or] = [
				{ requestNumber: { [Op.like]: `%${search}%` } },
				{ requestingDepartment: { [Op.like]: `%${search}%` } },
			];
		}
		const offset = (Number(page) - 1) * Number(limit);
		const { count, rows } = await PurchaseRequisition.findAndCountAll({
			where,
			order: [["createdAt", "DESC"]],
			offset,
			limit: Number(limit),
		});
		// enrich itemsCount quickly
		const data = await Promise.all(
			rows.map(async (r) => {
				const items = await PurchaseRequisitionItem.count({ where: { requisitionId: r.id } });
				return { ...r.toJSON(), itemsCount: items };
			})
		);
		return { total: count, data };
	}

	async addItem(id, item) {
		return await PurchaseRequisitionItem.create({ ...item, requisitionId: id });
	}

	async items(id) {
		return await PurchaseRequisitionItem.findAll({ where: { requisitionId: id } });
	}
}

module.exports = new PurchaseRequisitionRepository();



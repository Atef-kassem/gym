const repo = require("../Model/repository/purchaseRequisitionRepository");

class PurchaseRequisitionController {
	async create(req, res) {
		try {
			const rec = await repo.create(req.body);
			res.status(201).json({ message: 'created', id: rec.id });
		} catch (e) {
			res.status(500).json({ message: e.message });
		}
	}

	async get(req, res) {
		try {
			const rec = await repo.findById(req.params.id);
			if (!rec) return res.status(404).json({ message: "Not found" });
			res.json(rec);
		} catch (e) {
			res.status(500).json({ message: e.message });
		}
	}

	async update(req, res) {
		try {
			const result = await repo.update(req.params.id, req.body);
			if (!result[0]) return res.status(404).json({ message: "Not found" });
			res.json({ message: "Updated" });
		} catch (e) {
			res.status(500).json({ message: e.message });
		}
	}

	async list(req, res) {
		try {
			const result = await repo.list(req.query);
			res.json(result);
		} catch (e) {
			res.status(500).json({ message: e.message });
		}
	}

	async addItem(req, res) {
		try {
			const item = await repo.addItem(req.params.id, req.body);
			res.status(201).json(item);
		} catch (e) {
			res.status(500).json({ message: e.message });
		}
	}

	async items(req, res) {
		try {
			const items = await repo.items(req.params.id);
			res.json(items);
		} catch (e) {
			res.status(500).json({ message: e.message });
		}
	}
}

module.exports = new PurchaseRequisitionController();



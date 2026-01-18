const repo = require("../Model/repository/procurementSettingsRepository");

class ProcurementSettingsController {
	async get(req, res) {
		try {
			const record = await repo.get();
			res.json(record);
		} catch (e) {
			res.status(500).json({ message: e.message });
		}
	}

async save(req, res) {
		try {
			const record = await repo.save(req.body);
			res.json(record);
		} catch (e) {
			res.status(500).json({ message: e.message });
		}
	}
}

module.exports = new ProcurementSettingsController();



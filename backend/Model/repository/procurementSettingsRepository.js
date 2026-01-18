const ProcurementSettings = require("../schema/procurementSettingsSchema");

class ProcurementSettingsRepository {
	async get() {
		let record = await ProcurementSettings.findOne();
		if (!record) {
			record = await ProcurementSettings.create({});
		}
		return record;
	}

	async save(updates) {
		const record = await this.get();
		await record.update(updates);
		return record;
	}
}

module.exports = new ProcurementSettingsRepository();



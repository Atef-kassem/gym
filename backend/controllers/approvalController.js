const PurchaseRequisition = require("../Model/schema/purchaseRequisitionSchema");
const PurchaseRequisitionItem = require("../Model/schema/purchaseRequisitionItemSchema");

class ApprovalController {
	async list(req, res) {
		try {
			const { status = "pending" } = req.query;
			const items = await PurchaseRequisition.findAll({ where: { status }, include: [{ model: PurchaseRequisitionItem, as: 'items' }] });
			res.json({ data: items });
		} catch (e) {
			res.status(500).json({ message: e.message });
		}
	}

	async action(req, res) {
		try {
			const { id } = req.params;
			const { action, notes } = req.body;
			const rec = await PurchaseRequisition.findByPk(id);
			if (!rec) return res.status(404).json({ message: "Not found" });
			if (!["approve", "reject", "return"].includes(action)) {
				return res.status(400).json({ message: "Invalid action" });
			}
			const nextStatus = action === "approve" ? "approved" : action === "reject" ? "rejected" : "returned";
			await rec.update({ status: nextStatus });
			res.json({ message: "Updated", status: nextStatus });
		} catch (e) {
			res.status(500).json({ message: e.message });
		}
	}
}

module.exports = new ApprovalController();



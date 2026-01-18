const repo = require("../Model/repository/purchaseOrderRepository");

class PurchaseOrderController {
  async create(req, res) {
    try {
      const po = await repo.create(req.body);
      res.status(201).json(po);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async get(req, res) {
    try {
      const po = await repo.findById(req.params.id);
      if (!po) return res.status(404).json({ message: "Not found" });
      res.json(po);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async update(req, res) {
    try {
      const updated = await repo.update(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: "Not found" });
      res.json(updated);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async list(req, res) {
    try {
      const items = await repo.list(req.query);
      res.json(items);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new PurchaseOrderController();



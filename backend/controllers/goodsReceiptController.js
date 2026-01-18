const repo = require("../Model/repository/goodsReceiptRepository");

class GoodsReceiptController {
  async create(req, res) {
    try {
      const it = await repo.create(req.body);
      res.status(201).json(it);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async list(req, res) {
    try {
      const items = await repo.list();
      res.json(items);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async getById(req, res) {
    try {
      const it = await repo.getById(req.params.id);
      if (!it) return res.status(404).json({ message: "Not found" });
      res.json(it);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async update(req, res) {
    try {
      const it = await repo.update(req.params.id, req.body);
      res.json(it);
    } catch (e) {
      const code = /not found/i.test(e.message) ? 404 : 500;
      res.status(code).json({ message: e.message });
    }
  }
}

module.exports = new GoodsReceiptController();



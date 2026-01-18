const RFQRepository = require("../Model/repository/rfqRepository");

class RFQController {
  async createRFQ(req, res) {
    try {
      const rfq = await RFQRepository.createRFQ(req.body);
      res.status(201).json(rfq);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getRFQ(req, res) {
    try {
      const rfq = await RFQRepository.getRFQById(req.params.id);
      if (!rfq) return res.status(404).json({ message: "RFQ not found" });
      res.json(rfq);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateRFQ(req, res) {
    try {
      const rfq = await RFQRepository.updateRFQ(req.params.id, req.body);
      if (!rfq[0]) return res.status(404).json({ message: "RFQ not found" });
      res.json({ message: "RFQ updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteRFQ(req, res) {
    try {
      const rfq = await RFQRepository.deleteRFQ(req.params.id);
      if (!rfq) return res.status(404).json({ message: "RFQ not found" });
      res.json({ message: "RFQ deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async listRFQs(req, res) {
    try {
      const result = await RFQRepository.listRFQs(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async addItem(req, res) {
    try {
      const item = await RFQRepository.addRFQItem(req.params.id, req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async listItems(req, res) {
    try {
      const items = await RFQRepository.getRFQItems(req.params.id);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new RFQController();

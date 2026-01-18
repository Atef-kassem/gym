const QuotationRepository = require("../Model/repository/quotationRepository");

class QuotationController {
  async createQuotation(req, res) {
    try {
      const quotation = await QuotationRepository.createQuotation(req.body);
      res.status(201).json(quotation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getQuotation(req, res) {
    try {
      const quotation = await QuotationRepository.getQuotationById(req.params.id);
      if (!quotation) return res.status(404).json({ message: "Quotation not found" });
      res.json(quotation);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateQuotation(req, res) {
    try {
      const result = await QuotationRepository.updateQuotation(req.params.id, req.body);
      if (!result[0]) return res.status(404).json({ message: "Quotation not found" });
      res.json({ message: "Quotation updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async deleteQuotation(req, res) {
    try {
      const quotation = await QuotationRepository.deleteQuotation(req.params.id);
      if (!quotation) return res.status(404).json({ message: "Quotation not found" });
      res.json({ message: "Quotation deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async list(req, res) {
    try {
      const items = await QuotationRepository.list(req.query);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new QuotationController();

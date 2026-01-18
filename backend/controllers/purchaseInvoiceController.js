const repo = require("../Model/repository/purchaseInvoiceRepository");

class PurchaseInvoiceController {
  async create(req, res) {
    try {
      const data = req.body;
      console.log('Creating purchase invoice with data:', data);
      
      const rec = await repo.create(data);
      console.log('Created purchase invoice:', rec);
      
      res.status(201).json({
        success: true,
        data: {
          purchaseInvoice: rec
        }
      });
    } catch (e) {
      console.error('Error creating purchase invoice:', e);
      res.status(500).json({ message: e.message });
    }
  }

  async list(req, res) {
    try {
      const items = await repo.list(req.query);
      res.json({
        success: true,
        data: {
          purchaseInvoices: items
        }
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async get(req, res) {
    try {
      console.log('Finding purchase invoice by ID:', req.params.id);
      const rec = await repo.findById(req.params.id);
      console.log('Found purchase invoice:', rec);
      if (!rec) return res.status(404).json({ message: "Purchase invoice not found" });
      res.json({
        success: true,
        data: {
          purchaseInvoice: rec
        }
      });
    } catch (e) {
      console.error('Error getting purchase invoice:', e);
      res.status(500).json({ message: e.message });
    }
  }

  async update(req, res) {
    try {
      console.log('Updating purchase invoice ID:', req.params.id);
      console.log('Update data:', req.body);
      const rec = await repo.update(req.params.id, req.body);
      console.log('Updated purchase invoice:', rec);
      res.json({
        success: true,
        data: {
          purchaseInvoice: rec
        }
      });
    } catch (e) {
      console.error('Error updating purchase invoice:', e);
      const code = /not found/i.test(e.message) ? 404 : 500;
      res.status(code).json({ message: e.message });
    }
  }

  async remove(req, res) {
    try {
      await repo.remove(req.params.id);
      res.status(204).send();
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async match(req, res) {
    try {
      // Simple matching: variance > 0 if any item (quantity - grnQuantity) * price != 0
      const rec = await repo.findById(req.params.id);
      if (!rec) return res.status(404).json({ message: "Not found" });
      const hasVariance = (rec.items || []).some((it) => {
        const q = Number(it.quantity || 0);
        const grn = Number(it.grnQuantity || 0);
        const price = Number(it.price || 0);
        return Math.abs(q - grn) * price > 0;
      });
      const next = hasVariance
        ? { matchingStatus: "غير مطابق", status: "تحت المراجعة" }
        : { matchingStatus: "مطابق", status: "بانتظار الموافقة" };
      const updated = await repo.update(rec.id, next);
      res.json({
        success: true,
        data: {
          purchaseInvoice: updated
        }
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }

  async addAttachment(req, res) {
    try {
      const rec = await repo.findById(req.params.id);
      if (!rec) return res.status(404).json({ message: "Not found" });
      // Files are uploaded by middleware to /Uploads; collect links
      const files = req.files || {};
      const links = [];
      for (const key of Object.keys(files)) {
        const arr = files[key];
        for (const f of arr) {
          links.push(`/Uploads/${f.filename}`);
        }
      }
      const existing = rec.attachments ? JSON.parse(rec.attachments) : [];
      const updated = [...existing, ...links];
      const out = await repo.update(rec.id, { attachments: JSON.stringify(updated) });
      res.json({
        success: true,
        data: {
          purchaseInvoice: out
        }
      });
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  }
}

module.exports = new PurchaseInvoiceController();



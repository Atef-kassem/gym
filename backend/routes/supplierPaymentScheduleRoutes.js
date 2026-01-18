const express = require("express");
const router = express.Router();
const { SupplierPaymentSchedule, PurchaseInvoice } = require("../Model/index");

// جلب جميع جداول الدفع
router.get("/", async (req, res) => {
  try {
    const schedules = await SupplierPaymentSchedule.findAll({
      include: [
        { model: PurchaseInvoice, as: "invoice" }
      ],
      order: [["scheduledDate", "ASC"]]
    });
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching payment schedules:', error);
    res.status(500).json({ message: error.message });
  }
});

// جلب جدول دفع واحد
router.get("/:id", async (req, res) => {
  try {
    const schedule = await SupplierPaymentSchedule.findByPk(req.params.id, {
      include: [
        { model: PurchaseInvoice, as: "invoice" }
      ]
    });
    if (!schedule) {
      return res.status(404).json({ message: "Payment schedule not found" });
    }
    res.json(schedule);
  } catch (error) {
    console.error('Error fetching payment schedule:', error);
    res.status(500).json({ message: error.message });
  }
});

// إنشاء جدول دفع جديد
router.post("/", async (req, res) => {
  try {
    const schedule = await SupplierPaymentSchedule.create(req.body);
    const createdSchedule = await SupplierPaymentSchedule.findByPk(schedule.id, {
      include: [
        { model: PurchaseInvoice, as: "invoice" }
      ]
    });
    res.status(201).json(createdSchedule);
  } catch (error) {
    console.error('Error creating payment schedule:', error);
    res.status(400).json({ message: error.message });
  }
});

// تحديث جدول دفع
router.put("/:id", async (req, res) => {
  try {
    const schedule = await SupplierPaymentSchedule.findByPk(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: "Payment schedule not found" });
    }
    await schedule.update(req.body);
    const updatedSchedule = await SupplierPaymentSchedule.findByPk(req.params.id, {
      include: [
        { model: PurchaseInvoice, as: "invoice" }
      ]
    });
    res.json(updatedSchedule);
  } catch (error) {
    console.error('Error updating payment schedule:', error);
    res.status(400).json({ message: error.message });
  }
});

// حذف جدول دفع
router.delete("/:id", async (req, res) => {
  try {
    const schedule = await SupplierPaymentSchedule.findByPk(req.params.id);
    if (!schedule) {
      return res.status(404).json({ message: "Payment schedule not found" });
    }
    await schedule.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting payment schedule:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

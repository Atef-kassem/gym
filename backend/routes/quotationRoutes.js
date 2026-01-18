const express = require("express");
const router = express.Router();
const QuotationController = require("../controllers/quotationController");

router.get("/", QuotationController.list);
router.post("/", QuotationController.createQuotation);
router.get("/:id", QuotationController.getQuotation);
router.put("/:id", QuotationController.updateQuotation);
router.delete("/:id", QuotationController.deleteQuotation);

module.exports = router;

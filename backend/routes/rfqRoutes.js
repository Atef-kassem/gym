const express = require("express");
const router = express.Router();
const RFQController = require("../controllers/rfqController");

router.get("/", RFQController.listRFQs);
router.post("/", RFQController.createRFQ);
router.get("/:id", RFQController.getRFQ);
router.put("/:id", RFQController.updateRFQ);
router.delete("/:id", RFQController.deleteRFQ);
router.post("/:id/items", RFQController.addItem);
router.get("/:id/items", RFQController.listItems);

module.exports = router;

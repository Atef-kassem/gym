const express = require("express");
const router = express.Router();
const inbodyController = require("../controllers/inbodyController");

// Inbody routes
router.get("/", inbodyController.getAllInbody);
router.post("/", inbodyController.createInbody);
router.put("/:id", inbodyController.updateInbody);
router.delete("/:id", inbodyController.deleteInbody);

module.exports = router;


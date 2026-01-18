const express = require("express");
const router = express.Router();
const controller = require("../controllers/purchaseRequisitionController");

router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", controller.get);
router.put("/:id", controller.update);
router.post("/:id/items", controller.addItem);
router.get("/:id/items", controller.items);

module.exports = router;



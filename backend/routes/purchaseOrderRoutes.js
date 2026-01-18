const express = require("express");
const router = express.Router();
const controller = require("../controllers/purchaseOrderController");

router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", controller.get);
router.put("/:id", controller.update);

module.exports = router;



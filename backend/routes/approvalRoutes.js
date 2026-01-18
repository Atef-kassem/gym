const express = require("express");
const router = express.Router();
const controller = require("../controllers/approvalController");

router.get("/", controller.list);
router.post("/:id", controller.action);

module.exports = router;



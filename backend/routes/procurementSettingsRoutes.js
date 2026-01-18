const express = require("express");
const router = express.Router();
const controller = require("../controllers/procurementSettingsController");

router.get("/", controller.get);
router.put("/", controller.save);

module.exports = router;



const express = require("express");
const router = express.Router();
const controller = require("../controllers/procurementLookupController");

router.get("/search", controller.search);

module.exports = router;



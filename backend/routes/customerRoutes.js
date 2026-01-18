const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

// GET /api/v1/customers
router.get("/", customerController.list);

// GET /api/v1/customers/:id
router.get("/:id", customerController.getById);

// POST /api/v1/customers
router.post("/", customerController.create);

// PUT /api/v1/customers/:id
router.put("/:id", customerController.update);

// DELETE /api/v1/customers/:id
router.delete("/:id", customerController.remove);

module.exports = router;



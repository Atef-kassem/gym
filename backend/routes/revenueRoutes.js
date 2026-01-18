const express = require("express");
const router = express.Router();
const controller = require("../controllers/revenueController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

router.use(isLoggedIn);

router.get("/statistics", controller.statistics);
router.get("/top-customers", controller.topCustomers);
router.post("/sync", controller.syncRevenues);
router.get("/from-sales", controller.getRevenuesFromSales);
router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", controller.get);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

module.exports = router;


const express = require("express");
const router = express.Router();
const controller = require("../controllers/expenseController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

router.use(isLoggedIn);

router.get("/statistics", controller.statistics);
router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", controller.get);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);
router.patch("/:id/approve", controller.approve);
router.patch("/:id/reject", controller.reject);

module.exports = router;


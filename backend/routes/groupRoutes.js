const express = require("express");
const router = express.Router();
const groupController = require("../controllers/groupController");

// Groups routes
router.route("/")
  .get(groupController.getAllGroups)
  .post(groupController.createGroup);

router.get("/statistics", groupController.getGroupStatistics);

router.route("/:id")
  .get(groupController.getGroupById)
  .put(groupController.updateGroup)
  .delete(groupController.deleteGroup);

// Categories routes
router.get("/categories/all", groupController.getAllCategories);
router.post("/categories", groupController.createCategory);
router.put("/categories/:id", groupController.updateCategory);
router.delete("/categories/:id", groupController.deleteCategory);

module.exports = router;







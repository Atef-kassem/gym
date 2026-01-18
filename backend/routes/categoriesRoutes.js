const Router = require("express").Router();
const categoriesController = require("../controllers/categoriesController");

// Categories routes
Router.route("/").get(categoriesController.getAllCategories).post(categoriesController.createCategory);

Router.route("/:id")
  .get(categoriesController.getCategory)
  .patch(categoriesController.updateCategory)
  .delete(categoriesController.deleteCategory);

// Additional category routes
Router.route("/root").get(categoriesController.getRootCategories);

Router.route("/:id/children").get(categoriesController.getChildrenCategories);

module.exports = Router;

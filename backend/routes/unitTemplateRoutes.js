const Router = require("express").Router();
const unitTemplateController = require("../controllers/unitTemplateController");

// Unit template routes
Router.route("/").get(unitTemplateController.getAllTemplates).post(unitTemplateController.createTemplate);

Router.route("/:id")
  .get(unitTemplateController.getTemplate)
  .patch(unitTemplateController.updateTemplate)
  .delete(unitTemplateController.deleteTemplate);

// Additional routes
Router.route("/category/:category").get(unitTemplateController.getTemplatesByCategory);
Router.route("/active").get(unitTemplateController.getActiveTemplates);
Router.route("/:id/increment-usage").post(unitTemplateController.incrementUsageCount);

module.exports = Router;

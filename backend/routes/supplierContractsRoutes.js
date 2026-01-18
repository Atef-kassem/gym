const Router = require("express").Router();
const controller = require("../controllers/supplierContractsController");

Router.route("/")
  .get(controller.getAll)
  .post(controller.create);

Router.route("/:id")
  .get(controller.getOne)
  .patch(controller.update)
  .delete(controller.delete);

module.exports = Router;



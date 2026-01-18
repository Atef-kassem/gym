const Router = require("express").Router();
const productController = require("../controllers/productController");
const { dynamicUpload } = require("../middlewares/fileUpload");

// حقول الملفات للمنتجات
const productFileFields = ["image"];

// Product routes
Router.route("/")
  .get(productController.getAllProducts)
  .post(dynamicUpload(productFileFields), productController.createProduct);

// Search products route
Router.route("/search").get(productController.searchProducts);

Router.route("/:id")
  .get(productController.getProduct)
  .patch(dynamicUpload(productFileFields), productController.updateProduct)
  .delete(productController.deleteProduct);

// Update product stock quantity
Router.route("/:id/stock").put(productController.updateProductStock);

module.exports = Router;

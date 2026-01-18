const express = require("express");
const router = express.Router();
const controller = require("../controllers/purchaseInvoiceController");
const { dynamicUpload } = require("../middlewares/fileUpload");

router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", controller.get);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);
router.post("/:id/match", controller.match);
router.post(
  "/:id/attachments",
  dynamicUpload(["invoice_file", "supporting_doc"]),
  controller.addAttachment
);

module.exports = router;



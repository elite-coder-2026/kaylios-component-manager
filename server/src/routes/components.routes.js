const express = require("express");
const controller = require("../controllers/components.controller");

const router = express.Router();

router.post("/", controller.createComponent);
router.get("/", controller.listComponents);
router.get("/:framework/:component", controller.getComponentFiles);
router.delete("/:framework/:component", controller.deleteComponent);

module.exports = router;

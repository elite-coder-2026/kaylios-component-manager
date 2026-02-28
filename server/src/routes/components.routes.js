const express = require("express");
const controller = require("../controllers/components.controller");

const router = express.Router();

router.post("/", controller.createComponent);
router.get("/", controller.listComponents);
router.get("/search", controller.searchComponents);
router.get("/line-count-total", controller.countAllComponentLines);
router.get("/:framework/:component/content", controller.getComponentContent);
router.get("/:framework/:component/line-count", controller.countComponentLines);
router.get("/:framework/:component", controller.getComponentFiles);
router.delete("/:framework/:component", controller.deleteComponent);

module.exports = router;

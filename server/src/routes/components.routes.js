const express = require("express");
const controller = require("../controllers/components.controller");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/", requireAuth, requireRole("admin", "editor"), controller.createComponent);
router.get("/", controller.listComponents);
router.get("/search", controller.searchComponents);
router.get("/line-count-total", controller.countAllComponentLines);
router.get("/:framework/:component/content", controller.getComponentContent);
router.get("/:framework/:component/line-count", controller.countComponentLines);
router.get("/:framework/:component", controller.getComponentFiles);
router.delete("/:framework/:component", requireAuth, requireRole("admin"), controller.deleteComponent);

module.exports = router;

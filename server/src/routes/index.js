const express = require("express");
const componentsRoutes = require("./components.routes");

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ ok: true, service: "component-manager-api" });
});

router.use("/components", componentsRoutes);

module.exports = router;

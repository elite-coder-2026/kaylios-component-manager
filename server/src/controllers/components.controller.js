const componentsService = require("../services/components.service");
const { createComponentSchema, componentParamsSchema } = require("../validation/components.validation");

async function createComponent(req, res, next) {
  try {
    const { error, value } = createComponentSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const err = new Error(error.details.map((d) => d.message).join("; "));
      err.statusCode = 400;
      throw err;
    }

    const created = await componentsService.createComponent(value);
    res.status(201).json({ ok: true, ...created });
  } catch (error) {
    next(error);
  }
}

async function listComponents(_req, res, next) {
  try {
    const components = await componentsService.listComponents();
    res.json({ ok: true, components });
  } catch (error) {
    next(error);
  }
}

async function getComponentFiles(req, res, next) {
  try {
    const { error, value } = componentParamsSchema.validate(req.params);
    if (error) {
      const err = new Error(error.details.map((d) => d.message).join("; "));
      err.statusCode = 400;
      throw err;
    }

    const found = await componentsService.getComponentFiles(value.framework, value.component);
    res.json({ ok: true, ...found });
  } catch (error) {
    next(error);
  }
}

async function deleteComponent(req, res, next) {
  try {
    const { error, value } = componentParamsSchema.validate(req.params);
    if (error) {
      const err = new Error(error.details.map((d) => d.message).join("; "));
      err.statusCode = 400;
      throw err;
    }

    const deleted = await componentsService.deleteComponent(value.framework, value.component);
    res.json({ ok: true, ...deleted });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createComponent,
  listComponents,
  getComponentFiles,
  deleteComponent
};

const componentsService = require("../services/components.service");
const {
  createComponentSchema,
  componentParamsSchema,
  searchComponentsQuerySchema
} = require("../validation/components.validation");

function validate(schema, data) {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const err = new Error(error.details.map((d) => d.message).join("; "));
    err.statusCode = 400;
    throw err;
  }
  return value;
}

function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

const createComponent = asyncHandler(async (req, res) => {
  const value = validate(createComponentSchema, req.body);
  const created = await componentsService.createComponent(value);
  res.status(201).json({ ok: true, ...created });
});

const listComponents = asyncHandler(async (_req, res) => {
  const components = await componentsService.listComponents();
  res.status(200).json({ ok: true, components });
});

const searchComponents = asyncHandler(async (req, res) => {
  const value = validate(searchComponentsQuerySchema, req.query);
  const result = await componentsService.searchComponents(value);
  res.status(200).json({ ok: true, ...result });
});

const getComponentFiles = asyncHandler(async (req, res) => {
  const value = validate(componentParamsSchema, req.params);
  const found = await componentsService.getComponentFiles(value.framework, value.component);
  res.status(200).json({ ok: true, ...found });
});

const deleteComponent = asyncHandler(async (req, res) => {
  const value = validate(componentParamsSchema, req.params);
  const deleted = await componentsService.deleteComponent(value.framework, value.component);
  res.status(200).json({ ok: true, ...deleted });
});

const getComponentContent = asyncHandler(async (req, res) => {
  const value = validate(componentParamsSchema, req.params);
  const found = await componentsService.getComponentContent(value.framework, value.component);
  res.status(200).json({ ok: true, ...found });
});

const countComponentLines = asyncHandler(async (req, res) => {
  const value = validate(componentParamsSchema, req.params);
  const result = await componentsService.countComponentLines(value.framework, value.component);
  res.status(200).json({ ok: true, ...result });
});

const countAllComponentLines = asyncHandler(async (_req, res) => {
  const result = await componentsService.countAllComponentLines();
  res.status(200).json({ ok: true, ...result });
});

module.exports = {
  createComponent,
  listComponents,
  searchComponents,
  getComponentFiles,
  getComponentContent,
  countComponentLines,
  countAllComponentLines,
  deleteComponent
};

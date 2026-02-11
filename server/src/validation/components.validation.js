const Joi = require("joi");

const frameworks = ["react", "angular", "vue", "vanilla"];

const createComponentSchema = Joi.object({
  framework: Joi.string()
    .valid(...frameworks)
    .required(),
  component: Joi.string()
    .trim()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required(),
  version: Joi.string().trim().default("1.0.0"),
  author: Joi.string().trim().allow("").default("Unknown"),
  number: Joi.string().trim().allow("").default("N/A")
});

const componentParamsSchema = Joi.object({
  framework: Joi.string()
    .valid(...frameworks)
    .required(),
  component: Joi.string()
    .trim()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .required()
});

const searchComponentsQuerySchema = Joi.object({
  q: Joi.string().trim().min(1).max(80).required(),
  framework: Joi.string().valid(...frameworks),
  limit: Joi.number().integer().min(1).max(50).default(10)
});

module.exports = {
  createComponentSchema,
  componentParamsSchema,
  searchComponentsQuerySchema
};

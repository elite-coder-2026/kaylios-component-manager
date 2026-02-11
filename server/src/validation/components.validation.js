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

module.exports = {
  createComponentSchema,
  componentParamsSchema
};

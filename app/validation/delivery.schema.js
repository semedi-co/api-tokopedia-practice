const joi = require("joi");

module.exports = joi.object({
  name: joi.string().trim().required().messages({
    "any.required": "name cannot be empty",
    "string.base": "name must be a text",
  }),
});

const joi = require("joi");

module.exports = joi.object({
  name: joi.string().required().trim().messages({
    "any.required": "name cannot be empty",
    "string.base": "name must be a text"
  }),

  address: joi.string().required().trim().messages({
    "any.required": "address cannot be empty",
    "string.base": "address must be a text"
  }) 
});
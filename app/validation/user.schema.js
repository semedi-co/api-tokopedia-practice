const joi = require("joi");


module.exports = joi.object({
  name: joi.string().required().trim().messages({
    "any.required": "name cannot be empty",
    "string.base": "name must be a text"
  }),

  email: joi.string().email().required().trim().messages({
    "any.required": "address cannot be empty",
    "string.base": "address must be a text"
  }),

  password: joi.string().min(8).max(20).required().trim().messages({
    "any.required": "address cannot be empty",
    "string.base": "address must be a text"
  }) 
});
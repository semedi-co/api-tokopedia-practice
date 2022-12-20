const joi = require("joi");

module.exports = joi.object({
  name: joi.string().required().trim().messages({
    "any.required": "name cannot be empty",
    "string.base": "name must be a text"
  }),
  
  stock: joi.number().required().messages({
    "any.required": "stock cannot be empty",
    "number.base": "stock must be a number"
  }),

  storefront_id: joi.number().required().messages({
    "any.required": "storefront id cannot be empty",
    "number.base": "storefront id must be a number"
  }),

  price: joi.number().required().messages({
    "any.required": "price cannot be empty",
    "number.base": "price must be a number"
  }),
  
  description: joi.string().required().trim().messages({
    "any.required": "description cannot be empty",
    "string.base": "description must be a text"
  }),
  
  sold_total: joi.number().required().messages({
    "any.required": "address cannot be empty",
    "number.base": "address must be a number"
  }),
});
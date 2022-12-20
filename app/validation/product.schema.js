const Joi = require("joi");

module.exports = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Name cannot be empty",
        "string.base": "Name must be a text",
    }),
    stock: Joi.number().required().messages({
        "any.required": "Stock cannot be empty",
    }),
    price: Joi.number().required().messages({
        "any.required": "Price cannot be empty",
    }),
    description: Joi.string().required().messages({
        "any.required": "Description cannot be empty",
        "string.base": "Description must be a text",
    }),
    sold_total: Joi.number().required().messages({
        "any.required": "Sold total cannot be empty",
    }),
});
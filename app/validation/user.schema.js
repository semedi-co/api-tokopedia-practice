const Joi = require("joi");

module.exports = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Name cannot be empty",
        "string.base": "Name must be a text",
    }),
    username: Joi.string().required().messages({
        "any.required": "Address cannot be empty",
        "string.base": "Address must be a text",
    }),
    password: Joi.string().min(8).max(20).required().messages({
        "any.required": "Address cannot be empty",
        "string.base": "Address must be a text",
    }),
});
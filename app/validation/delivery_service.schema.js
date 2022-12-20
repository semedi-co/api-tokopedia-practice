const Joi = require("joi");

module.exports = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Name cannot be empty",
        "string.base": "Name must be a text",
    }),
});
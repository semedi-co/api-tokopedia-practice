const Joi = require("joi")

module.exports= Joi.object({
    store_id: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "store_id can't be empty",
            "string.base" : "store_id must be a text",
            "string.empty": "store_id can't be empty"
        }),
    name: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required": "name can't be empty",
            "string.base": "name must be a text",
            "string.empty": "name can't be a empty"
        })
})
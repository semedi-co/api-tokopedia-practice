const Joi = require("joi")

module.exports= Joi.object({
    name: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required":"name cannot be empty",
            "string.base":"name must be a text",
            "string.empty":"name cannot be empty"
        }),

        username: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required":"username cannot be empty",
            "string.base":"username must be a text",
            "string.empty":"username cannot be empty"
        }),
        password:Joi.string()
            .min(8)
            .max(20)
            .required()
            .trim()
            .messages({
                "any.required":"password cannot be empty",
                "string.base":"password must be a text",
                "string.empty":"password cannot be empty"
            }),
    
})
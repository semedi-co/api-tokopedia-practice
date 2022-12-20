const Joi = require("joi")

module.exports=Joi.object({
    name: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required":"name cannot be empty",
            "string.base":"name must be a text",
            "string.empty":"name cannot be empty"
        }),
    address: Joi.string()
        .required()
        .trim()
        .messages({
            "any.required":"address cannot be empty",
            "string.base":"address must be a text",
            "string.empty":"address cannot be empty"
        }),
  

})

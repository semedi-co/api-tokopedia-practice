const Joi = require("joi")

module.exports= Joi.object({
    
    name:Joi.string()
    .required()
    .trim()
    .messages({
        "any.required": "name can't be a empty",
        "string.base": "name must be text",
        "string.empty": "name can't be a empty"
    }),
    stok: Joi.number()
    .required()
    .integer()
    .messages({
        "any.required": "stok cannot be a empty",
        "number.base" : "stok must a number",
        "number.empty": "stok cannot be a empty"
    }),
    store_front_id: Joi.number()
    .required()
    .integer()
    .messages({
        "any.required": "store_front_id cannot be a empty",
        "number.base" : "store_front_id must a number",
        "number.empty": "store_front_id cannot be a empty"
    }),
    price: Joi.number()
    .required()
    .integer()
    .messages({
        "any.required": "price cannot be a empty",
        "number.base" : "price must a number",
        "number.empty": "price cannot be a empty" 
    }),
    description: Joi.string()
    .required()
    .trim()
    .messages({
        "any.required": "description can't be a empty",
        "string.base": "description must be text",
        "string.empty": "description can't be a empty"
    }),
    sold_total: Joi.number()
    .required()
    .integer()
    .messages({
        "any.required": "sold_total can't be a empty",
        "string.base": "sold_total must be number",
        "string.empty": "sold_total can't be a empty"
    })
})
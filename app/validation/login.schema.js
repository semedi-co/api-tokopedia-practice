const Joi = require("joi")

module.exports = Joi.object({
  email: Joi.string()
  .required()
  .trim()
  .messages({
    "any.required": "email is required",
    "string.empty": "email cannot be empty",
    "string.base": "email must be a text",
  }),
  password: Joi.string()
  .min(8)
  .max(20)
  .required()
  .trim()
  .messages({
    "any.required": "password is required",
    "string.empty": "password cannot be empty",
    "string.base": "password must be a text",
    "string.min": "length password minimal 8 character",
    "string.max": "length password maximum 20 character",
  })
})
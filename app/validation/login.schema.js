const joi = require("joi");

module.exports = joi.object({
  email: joi.string().required().trim().message({
    "any.required": "email cannot be empty",
    "string.base": "email must be a text",
  }),
  password: joi.string().min(8).max(20).required().trim().message({
    "any.required": "Password cannot be empty",
    "string.base": "Password must be a text",
    "string.min": "Length password minimal 8 character",
    "string.max": "Length password minimal 24 character",
  }),
});

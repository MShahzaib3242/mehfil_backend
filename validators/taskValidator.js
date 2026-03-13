const Joi = require("joi");

exports.createTaskSchema = Joi.object({
  title: Joi.string().trim().min(3).required().messages({
    "string.empty": "Title cannot be empty.",
    "string.min": "Title must be at least 3 characters long.",
    "any.required": "Title is required.",
  }),
  completed: Joi.boolean().optional(),
});

exports.updateTaskSchema = Joi.object({
  title: Joi.string().trim().min(3).optional(),
  completed: Joi.boolean().optional(),
});

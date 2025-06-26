const Joi = require("joi");

const bookInputSchema = Joi.object({
    title: Joi.string().min(3).required(),
    author: Joi.string().min(3).required(),
});

module.exports = {
    bookInputSchema
}
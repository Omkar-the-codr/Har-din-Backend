const Joi = require("joi");

exports.signupSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required(),
  password: Joi.string()
    .required(),
});
exports.signinSchema = Joi.object({
  email: Joi.string()
    .min(6)
    .max(60)
    .required(),
  password: Joi.string()
    .required(),
});

exports.acceptCodeSchema = Joi.object({
  email: Joi.string().min(6).max(60).required(),
  providedCode: Joi.number().required(),
});

exports.changePasswordSchema = Joi.object({
  newPassword: Joi.string()
  .required(),
  oldPassword: Joi.string().required()
})

exports.acceptFPCodeSchema = Joi.object({
  email: Joi.string().min(6).max(60).required(),
  providedCode: Joi.number().required(),
  newPassword: Joi.string().required(),
});
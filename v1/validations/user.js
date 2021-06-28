const Joi = require('joi');
const config = require('config');
Joi.ObjectId = () =>
  Joi.string()
    .pattern(/^[0-9a-f]{24}$/)
    .message('Invalid ObjectId');

const validateSchema = (inputs, schema) => {
  try {
    const options = { errors: { wrap: { label: '' } } };
    const { error, value } = schema.validate(inputs, options);
    if (error) throw error.message;
    else return value;
  } catch (err) {
    throw err;
  }
};

const validateArraySchema = (inputsArray, schemaArray) => {
  try {
    const options = { errors: { wrap: { label: '' } } };
    inputsArray.forEach((input, idx) => {
      const { error } = schemaArray[idx].validate(input, options);
      if (error) throw error.message;
      else return false;
    });
  } catch (error) {
    throw error;
  }
};

exports.validateSignUp = (req) => {
  let schema = Joi.object({
    fullname: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    address: Joi.string().required(),
  });
  return validateSchema(req.body, schema);
};

exports.validateLogin = (req) => {
  let schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return validateSchema(req.body, schema);
};

exports.validateChangePassword = (req) => {
  let schema = Joi.object({
    newPassword: Joi.string().required(),
    oldPassword: Joi.string().required(),
  });
  return validateSchema(req.body, schema);
};

exports.validateVerifyOtp = (req) => {
  let schema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().strict().required(),
  });
  return validateSchema(req.body, schema);
};

exports.validateSendOtp = (req) => {
  let schema = Joi.object({
    email: Joi.string().email().required(),
    type: Joi.string().valid('SIGNUP', 'FORGOT').required(),
  });
  return validateSchema(req.body, schema);
};

exports.validateForgetPassword = (req) => {
  let schema = Joi.object({
    email: Joi.string().email().required(),
    // type: Joi.string().valid('SIGNUP', 'FORGOT').required(),
  });
  return validateSchema(req.body, schema);
};

exports.validateResetPassword = (req) => {
  let schema = Joi.object().keys({
    email: Joi.string().email().lowercase().required(),
    newPassword: Joi.string().required(),
  });
  return validateSchema(req.body, schema);
};

exports.validateAddProduct = (req) => {
  let schema = Joi.object().keys({
    title: Joi.string().lowercase().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
  });
  return validateSchema(req.body, schema);
};

exports.validateGetAllProducts = (req) => {
  let schema = Joi.object().keys({
    page: Joi.number().empty(['', null]).default(config.get('PAGINATION.PAGE')),
    sort: Joi.string().empty(['', null]).default(config.get('PAGINATION.SORT')),
    limit: Joi.number().empty(['', null]).default(config.get('PAGINATION.LIMIT')),
    order: Joi.string().empty(['', null]).default('ASC').valid('ASC', 'DSC'),
  });
  return validateSchema(req.query, schema);
};

exports.validateParamsObjectId = (req) => {
  let schema = Joi.object().keys({
    id: Joi.ObjectId().required(),
  });
  return validateSchema(req.params, schema);
};

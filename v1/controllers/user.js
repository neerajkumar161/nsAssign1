const moment = require('moment');
const config = require('config');
const Models = require('../../models');
const utils = require('../../utils');
const Validations = require('../validations');
const status = require('../../constant/statusCodes');
const messages = require('../../constant/messages');
const projection = require('../services/projection').User;

exports.signUp = async (req, res, next) => {
  try {
    Validations.User.validateSignUp(req);
    let user = await Models.User.findOne({ email: req.body.email }).lean();
    if (user) throw messages.USER_ALREADY_EXIST;

    req.body.password = await utils.bcryptPassword(req.body.password);
    await Models.User.create(req.body);

    utils.successResponse(res, status.CREATED, messages.USER_REGISTERED_SUCCESSFULLY, null);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    Validations.User.validateLogin(req);
    let user = await Models.User.findOne({ email: req.body.email }, projection.login).lean();
    if (!user) throw messages.USER_NOT_EXIST;

    const isMatch = await utils.bcryptCompare(req.body.password, user.password);
    if (!isMatch) throw messages.INVALID_CREDENTIALS;

    delete user.password;
    user.token = utils.jwtSign(user);

    utils.successResponse(res, status.OK, messages.USER_LOGGED_IN_SUCCESSFULLY, user);
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    Validations.User.validateVerifyOtp(req);
    console.log(req.body);
    let otpUser = await Models.Otp.find({ email: req.body.email }).sort({ createdAt: -1 }).limit(1).lean();

    if (otpUser.length < 1) throw messages.OTP_EXPIRED;
    if (otpUser[0].otp !== req.body.otp) throw messages.INVALID_OTP;

    await Models.Otp.findOneAndUpdate({ _id: otpUser[0]._id }, { isOtpVerified: true }).lean();
    utils.successResponse(res, status.OK, messages.OTP_VERIFIED_SUCESSFULLY, null);
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    Validations.User.validateForgetPassword(req);
    let user = await Models.User.findOne({ email: req.body.email }).lean();
    if (!user) throw messages.USER_NOT_EXIST;

    const otp = utils.generateOtp();
    const setObj = {
      email: req.body.email,
      otp,
      expiredAt: moment().add(5, 'm'),
    };
    await Models.Otp.create(setObj);
    // utils.emailService.sendForgotPasswordEmail(req.body.email, messages.RESET_PASSWORD_OTP, otp);

    utils.successResponse(res, status.OK, messages.OTP_SENT_TO_YOUR_EMAIL, otp);
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    Validations.User.validateResetPassword(req);
    let user = await Models.User.findOne({ email: req.body.email });
    if (!user) throw messages.USER_NOT_EXIST;

    let otpUser = await Models.Otp.find({ email: req.body.email }).sort({ createdAt: -1 }).limit(1).lean();
    console.log(otpUser);
    if (!otpUser[0].isOtpVerified) throw messages.OTP_NOT_VERIFIED;

    const isMatch = await utils.bcryptCompare(req.body.newPassword, user.password);
    if (isMatch) throw messages.PASSWORD_CANT_BE_SAME;

    const password = await utils.bcryptPassword(req.body.newPassword);
    await user.updateOne({ password });
    utils.successResponse(res, status.OK, messages.PASSWORD_RESET_SUCCESSFULLY, null);
  } catch (err) {
    next(err);
  }
};

// ============= Prodcuts ============== //
exports.addProduct = async (req, res, next) => {
  try {
    Validations.User.validateAddProduct(req);
    if (req.file) req.body.image = config.get('PATHS.IMAGE.PRODUCT.STATIC') + req.file.filename;

    const product = await Models.Product.create(req.body);
    utils.successResponse(res, status.CREATED, messages.PRODUCT_ADDED_SUCCESSFULLY, product);
  } catch (err) {
    next(err);
    if (req.file) {
      utils.deleteFiles([config.get('PATHS.IMAGE.PRODUCT.ACTUAL') + req.file.filename]);
    }
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    req.query = Validations.User.validateGetAllProducts(req);
    const page = req.query.page;
    const sortBy = req.query.sort;
    const ITEM_PER_PAGE = req.query.limit;
    const order = req.query.order == 'ASC' ? 1 : -1;

    const totalItems = await Models.Product.find({}).countDocuments();
    const totalPages = Math.ceil(totalItems / req.query.limit);

    const products = await Models.Product.aggregate([
      { $sort: { [sortBy]: order } },
      { $skip: (page - 1) * ITEM_PER_PAGE },
      { $limit: ITEM_PER_PAGE },
    ]);
    utils.successResponse(res, status.OK, messages.ALL_PRODUCTS_FETCHED, { totalPages, products });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    Validations.User.validateParamsObjectId(req);
    const product = await Models.Product.findOne({ _id: req.params.id }).lean();
    if (!product) throw messages.NO_PRODUCT_FOUND;
    utils.successResponse(res, status.OK, messages.PRODUCT_FETCHED_SUCCESSFULLY, product);
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    Validations.User.validateParamsObjectId(req);
    const product = await Models.Product.findOneAndRemove({ _id: req.params.id }).lean();
    if (!product) throw messages.NO_PRODUCT_FOUND;

    utils.successResponse(res, status.OK, messages.PRODUCT_DELETED_SUCCESSFULLY, null);
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    Validations.User.validateParamsObjectId(req);
    let product = await Models.Product.findOne({ _id: req.params.id }).lean();
    if (!product) throw messages.NO_PRODUCT_FOUND;

    let user = await Models.User.findOne({ _id: req.user._id });
    user.addToCart(product._id);
    utils.successResponse(res, status.OK, messages.ADDED_TO_CART, null);
  } catch (err) {
    next(err);
  }
};

exports.removeFromCart = async (req, res, next) => {
  try {
    Validations.User.validateParamsObjectId(req);
    let product = await Models.Product.findOne({ _id: req.params.id }).lean();
    if (!product) throw messages.NO_PRODUCT_FOUND;

    let user = await Models.User.findOne({ _id: req.user._id });
    user.removeFromCart(product._id);
    utils.successResponse(res, status.OK, messages.REMOVED_FROM_CART, null);
  } catch (err) {
    next(err);
  }
};

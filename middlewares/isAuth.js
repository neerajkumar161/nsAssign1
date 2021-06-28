const httpError = require('http-errors');
const Models = require('../models');
const messages = require('../constant/messages');

const utils = require('../utils');

// Auth Middleware
exports.isAdminValid = async (req, res, next) => {
  try {
    if (req.user && req.user.guestMode) next();
    else if (req.headers.authorization) {
      const decodeData = await utils.jwtVerify(req.headers.authorization);
      const admin = await Models.Admin.findOne({ _id: decodeData._id }).lean();
      if (!admin) throw messages.ADMIN_NOT_EXIST;
      else {
        req.user = admin;
        next();
      }
    } else throw httpError(401, 'Unauthorized');
  } catch (err) {
    next(err);
  }
};

exports.isUserValid = async (req, res, next) => {
  try {
    if (req.user && req.user.guestMode) next();
    // if (req.headers['x-guest-mode'] == 'true') next();
    else if (req.headers.auth) {
      const decodeData = await utils.jwtVerify(req.headers.auth);

      const user = await Models.User.findOne({ _id: decodeData._id });
      if (!user) throw messages.USER_NOT_EXIST;
      else {
        req.user = user;
        next();
      }
    } else throw httpError(401, 'Unauthorized');
  } catch (err) {
    next(err);
  }
};

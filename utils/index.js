const fs = require('fs');
const jwt = require('jsonwebtoken');
const path = require('path');
const config = require('config');
const bcrypt = require('bcryptjs');
const httpError = require('http-errors');

// const Messages = require('../lang');
const messages = require('../constant/messages');

exports.successResponse = (res, status, message, data) => {
  // if (/\s/.test(message)) message = message;
  // else message = Messages[lang][message];
  return res.status(status).send({ status, message, data: data });
};

exports.errorResponse = (res, status, error) => {
  let message;
  // console.log(error);
  if (/\s/.test(error)) message = error;
  // else message = Messages[lang][error];
  else message = message;
  return res.status(status).send({ error: 'Error Occured!', message: error });
};

// Bcrypt Hashing and Compare
exports.bcryptPassword = async (password) => {
  return bcrypt.hashSync(password, 10);
};

exports.bcryptCompare = async (password, hashPw) => {
  return bcrypt.compareSync(password, hashPw);
};

// JasonWebToken
// Try Using Public and Private key
exports.jwtSignRS256 = (payload) => {
  const privateKey = fs.readFileSync('private.key', 'utf-8');
  return jwt.sign({ _id: payload._id.toString() }, privateKey, {
    algorithm: 'RS256',
    expiresIn: config.get('JWT_OPTIONS.EXPIRES_IN'),
  });
};

exports.jwtVerifyRS256 = async (token) => {
  const publicKey = fs.readFileSync('public.key', 'utf-8');
  return jwt.verify(token, publicKey, { algoriths: ['RS256'] }, (err, decoded) => {
    if (err) throw httpError(401, 'Invalid Token');
    return decoded;
  });
};

exports.jwtSign = (payload) => {
  return jwt.sign(
    {
      _id: payload._id.toString(),
    },
    config.get('JWT_OPTIONS.SECRET_KEY'),
    { expiresIn: config.get('JWT_OPTIONS.EXPIRES_IN') }
  );
};

exports.jwtVerify = async (token) => {
  return jwt.verify(token, config.get('JWT_OPTIONS.SECRET_KEY'), (err, decoded) => {
    if (err) throw httpError(401, 'Invalid Token');
    return decoded;
  });
};

exports.generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000);
  // return +Math.floor(100000 + Math.random() * 900000)
  //   .toString()
  //   .substring(0, digits);
};

exports.getMilliseconds = (minutes) => {
  return minutes * 60 * 1000;
};

exports.deleteFiles = async (filePaths) => {
  await filePaths.forEach((eachPath) => {
    console.log('Deleting File  .......', eachPath);
    eachPath = path.join(__dirname, '..', eachPath);
    console.log('Each Path.........', eachPath);
    fs.unlink(eachPath, (err) => {
      if (err) {
        console.log(err);
        throw messages.FILE_UNLINK_ERR;
      }
    });
  });
};

exports.emailService = require('./Email');

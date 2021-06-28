const multer = require('multer');
const path = require('path');
const config = require('config');

const messages = require('../../constant/messages');

// File Filters
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(messages.INVALID_FILE_TYPE, false);
  }
};
const filename = (file) => file.fieldname + '-' + Date.now() + '.' + file.originalname.split('.').pop();

exports.userProfilePic = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../..', config.get('PATHS.IMAGE.USER.ACTUAL')));
    },
    filename: (req, file, cb) => {
      cb(null, filename(file));
    },
  }),
  fileFilter,
});

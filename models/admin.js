const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdminModel = new Schema(
  {
    firstName: { type: String, default: '', trim: true },
    lastName: { type: String, default: '', trim: true },
    city: { type: String, default: '', trim: true },
    state: { type: String, default: '', trim: true },
    country: { type: String, default: '', trim: true },
    role: { type: String, enum: ['ADMIN', 'SUBADMIN'] },
    zip: { type: String, default: '', trim: true },
    permissions: {
      add: {
        type: Boolean,
        default: false,
      },
      edit: {
        type: Boolean,
        default: false,
      },
      delete: {
        type: Boolean,
        default: false,
      },
      cms: {
        type: Boolean,
        default: false,
      },
    },
    street: { type: String, default: '', trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true, default: '' },
    password: { type: String, select: false },
    countryCode: { type: String, trim: true, default: '' },
    location: { type: String, default: 'USA' },
    profilePic: { type: String, default: '' },
    deviceType: { type: String, enum: ['IOS', 'ANDROID', 'WEB'] },
    deviceToken: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('admin', AdminModel);

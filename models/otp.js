const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OtpModel = new Schema(
  {
    otp: { type: Number },
    email: { type: String },
    isOtpVerified: { type: Boolean, default: false },
    expiredAt: { type: Date, default: new Date() },
  },
  { timestamps: true }
);

OtpModel.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
module.exports = mongoose.model('otp', OtpModel);

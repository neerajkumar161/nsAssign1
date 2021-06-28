const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserModel = new Schema(
  {
    fullname: { type: String, default: '', trim: true },
    email: { type: String, lowercase: true, trim: true },
    password: { type: String, default: '' },
    address: { type: String, default: '' },
    profilePic: { type: String, default: '' },
    location: {
      type: { type: String, enum: ['Point', 'Polygon'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },

    cart: [{ productId: { type: Schema.Types.ObjectId, ref: 'product' }, qty: { type: Number }, _id: false }],
    isEmailVerify: { type: Boolean, default: false },
    isPhoneVerify: { type: Boolean, default: false },
    deviceType: { type: String, enum: ['IOS', 'ANDROID', 'WEB'] },
    deviceToken: { type: String, default: '', select: false },
  },
  {
    timestamps: true,
  }
);

UserModel.methods.addToCart = function (productId) {
  let productIdx = this.cart.findIndex((item) => item.productId.toString() == productId.toString());
  let updatedCart = [...this.cart];
  if (productIdx == -1) {
    updatedCart.push({ productId, qty: 1 });
  } else {
    updatedCart[productIdx].qty = updatedCart[productIdx].qty + 1;
  }
  this.cart = updatedCart;
  return this.save();
};

UserModel.methods.removeFromCart = function (productId) {
  let productIdx = this.cart.findIndex((item) => item.productId.toString() == productId.toString());
  let updatedCart = [...this.cart];
  if (productIdx != -1) {
    updatedCart = updatedCart.filter((item) => item.productId.toString() !== productId.toString());
  }
  this.cart = updatedCart;
  return this.save();
};

module.exports = mongoose.model('user', UserModel);

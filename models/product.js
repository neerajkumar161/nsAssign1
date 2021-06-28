const mongoose = require('mongoose');
const Double = require('@mongoosejs/double');

const Schema = mongoose.Schema;

const ProductModel = new Schema(
  {
    title: { type: String },
    description: { type: String },
    price: { type: Number },
    image: { type: String },
    rating: { type: Double },
  },
  { timestamps: true }
);

module.exports = mongoose.model('product', ProductModel);

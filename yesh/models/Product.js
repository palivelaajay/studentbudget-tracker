const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,

  url: {
    type: String,
    required: true,
    unique: true
  },

  image: String,

  currentPrice: Number,
  originalPrice: Number,

  priceHistory: [
    {
      price: Number,
      date: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model("Product", productSchema);
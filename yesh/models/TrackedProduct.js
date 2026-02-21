const mongoose = require("mongoose");

const trackedProductSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  platform: {
    type: String,
    required: true
  },

  budget: {
    type: Number,
    required: true
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },

  url: {
    type: String,
    required: true
  },

  status: {
    type: String,
    default: "active"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("TrackedProduct", trackedProductSchema);
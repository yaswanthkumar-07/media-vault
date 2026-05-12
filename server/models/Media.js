const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },

  genre: {
    type: String,
  },

watched: {
  type: Boolean,
  default: false,
},

  rating: {
    type: Number,
    default: 0,
  },

  year: {
    type: Number,
  },

  image: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Media", mediaSchema);
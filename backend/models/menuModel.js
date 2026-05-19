const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: String,
    bgColor: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Menu", menuSchema);
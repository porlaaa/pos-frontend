const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customerDetails: {
      name: String,
      phone: String,
      guests: Number
    },

    orderStatus: {
      type: String,
      default: "pending"
    },

    items: [
      {
        name: String,
        price: Number,      // ราคาต่อชิ้น
        quantity: Number,
        total: Number       // price * quantity
      }
    ],

    bills: {
      total: Number,
      tax: Number,
      totalWithTax: Number
    },

    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
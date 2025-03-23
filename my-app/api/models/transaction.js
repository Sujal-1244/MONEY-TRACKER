const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  datetime: { type: Date, required: true },
  price: { type: Number, required: true }, // ✅ Ensure price is always stored as a Number
});

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;

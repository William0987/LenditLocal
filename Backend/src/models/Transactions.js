const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    created_at: { type: Date, default: Date.now },
    owner_id: { type: String, required: true }, 
    requester_id: { type: String, required: true }, 
    listing_id: { type: String, required: true }, 
    status: {
      type: String,
      enums: [
        "pending_response",
        "accepted",
        "declined",
        "completed",
        "expired",
      ],
    },
  },
  { collection: "transactions" }
);

const Transaction = mongoose.model("Transaction", TransactionSchema);

module.exports = Transaction;

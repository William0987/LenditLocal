const { v4: uuidv4 } = require("uuid");

const TransactionModel = require("../models/Transactions");

const seedTransactions = async (req, res) => {
  try {
    await TransactionModel.deleteMany();

    await TransactionModel.create([
      {
        transaction_id: uuidv4(),
        listing_id: "64d0f3f75676c304033d8c89",
        owner_id: "owner1",
        requester_id: "requester1",
        type: "pending_response",
      },
      {
        transaction_id: uuidv4(),
        listing_id: "64d0f3f75676c304033d8c90",
        owner_id: "owner1",
        requester_id: "requester1",
        type: "pending_response",
      },
    ]);
    res.json({ status: "ok", msg: "Seeding transactions successful" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "Seeding error" });
  }
};
module.exports = {
  seedTransactions,
};

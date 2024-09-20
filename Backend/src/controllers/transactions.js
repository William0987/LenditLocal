const { v4: uuidv4 } = require("uuid");

const TransactionModel = require("../models/Transactions");

const seedTransactions = async (req, res) => {
  try {
    await TransactionModel.deleteMany();

    await TransactionModel.create([
      {
        _id: "64e2c98f2097aba61989d93c",
        listing_id: "64d0f3f75676c304033d8c89",
        owner_id: "64e2c2fcdce21246ef81b8ed",
        requester_id: "64e2c2ffdce21246ef81b8f4",
        type: "pending_response",
      },
      {
        _id: "64e2c98f2097aba61989d93d",
        listing_id: "64d0f3f75676c304033d8c89",
        owner_id: "64e2c2fcdce21246ef81b8ed",
        requester_id: "64e2c2ffdce21246ef81b8f4",
        type: "pending_response",
      },
      {
        _id: "64e2c98f2097aba61989d93e",
        listing_id: "64d0f3f75676c304033d8c89",
        owner_id: "64e2c2fcdce21246ef81b8ed",
        requester_id: "64e2c2fcdce21246ef81b8ee",
        type: "accepted",
      },
    ]);
    res.json({ status: "ok", msg: "Seeding transactions successful" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ status: "error", msg: "Seeding error" });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const allTransactions = await TransactionModel.find();
    res.json(allTransactions);
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Error getting transactions" });
  }
};

const getTransactionsByOwnerId = async (req, res) => {
  try {
    const transactions = await TransactionModel.find({
      owner_id: req.params.owner_id,
    });

    if (transactions.length === 0) {
      return res
        .status(400)
        .json({ status: "error", error: "Transactions not found" });
    }
    res.json(transactions);
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ status: "error", message: "Cannot get transaction" });
  }
};

const getTransactionsByRequesterId = async (req, res) => {
  try {
    const transactions = await TransactionModel.find({
      requester_id: req.params.requester_id,
    });

    if (transactions.length === 0) {
      return res
        .status(400)
        .json({ status: "error", error: "Transactions not found" });
    }
    res.json(transactions);
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ status: "error", message: "Cannot get transactions" });
  }
};

const createTransaction = async (req, res) => {
  try {
    const createdTransaction = new TransactionModel({
      owner_id: req.body.owner_id,
      requester_id: req.body.requester_id,
      listing_id: req.body.listing_id,
    });
    await createdTransaction.save();
    res.json({
      status: "ok",
      msg: "Transaction saved",
      createdTransaction,
    });
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ status: "error", message: "Cannot create transaction" });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transaction = await TransactionModel.findById(req.params.id);
    if (!transaction) {
      return res
        .status(400)
        .json({ status: "error", error: "Transaction not found" });
    }

    const updatedTransaction = {};
    if ("owner_id" in req.body) updatedTransaction.owner_id = req.body.owner_id;
    if ("requester_id" in req.body)
      updatedTransaction.requester_id = req.body.requester_id;
    if ("listing_id" in req.body)
      updatedTransaction.listing_id = req.body.listing_id;

    await TransactionModel.findByIdAndUpdate(req.params.id, updatedTransaction);

    res.json({ status: "ok", message: "Transaction updated" });
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ status: "error", message: "Cannot update transaction" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    await TransactionModel.findByIdAndDelete(req.params.id);

    res.json({ status: "ok", message: "Transaction deleted" });
  } catch (error) {
    console.log(error.message);
    res.json({ status: "error", message: "Cannot delete transaction" });
  }
};

module.exports = {
  seedTransactions,
  getAllTransactions,
  getTransactionsByOwnerId,
  getTransactionsByRequesterId,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};

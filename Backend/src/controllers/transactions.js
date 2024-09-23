const { v4: uuidv4 } = require("uuid");

const TransactionModel = require("../models/Transactions");

const getAllTransactions = async (req, res) => {
  try {
    const allTransactions = await TransactionModel.find().populate([
      "owner_id",
      "requester_id",
      "listing_id",
    ]);
    res.json(allTransactions);
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ status: "error", msg: "Error getting transactions" });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const transaction = await TransactionModel.findById(req.params.id).populate(
      ["owner_id", "requester_id", "listing_id"]
    );

    if (!transaction) {
      return res
        .status(400)
        .json({ status: "error", error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (error) {
    console.log(error.message);
    res
      .status(400)
      .json({ status: "error", message: "Cannot get transaction" });
  }
};

const getTransactionsByUserId = async (req, res) => {
  try {
    let transactions = [];
    if ("owner_id" in req.body) {
      transactions = await TransactionModel.find({
        owner_id: req.body.owner_id,
      }).populate(["owner_id", "requester_id", "listing_id"]);
    } else if ("requester_id" in req.body) {
      transactions = await TransactionModel.find({
        requester_id: req.body.requester_id,
      }).populate(["owner_id", "requester_id", "listing_id"]);
    }

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

const createTransaction = async (req, res) => {
  try {
    const createdTransaction = new TransactionModel({
      owner_id: req.body.owner_id,
      requester_id: req.body.requester_id,
      listing_id: req.body.listing_id,
      status: req.body.status,
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
    if ("status" in req.body) updatedTransaction.status = req.body.status;

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
  getAllTransactions,
  getTransactionById,
  getTransactionsByUserId,
  createTransaction,
  updateTransaction,
  deleteTransaction,
};

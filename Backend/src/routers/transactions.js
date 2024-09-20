const express = require("express");
const {
  seedTransactions,
  getAllTransactions,
  getTransactionsByOwnerId,
  getTransactionsByRequesterId,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} = require("../controllers/transactions");
const checkValid = require("../middleware/checkValid");
const router = express.Router();

router.get("/transactions/seed", seedTransactions);
router.get("/transactions", getAllTransactions);
router.get("/transactions/:owner_id", getTransactionsByOwnerId);
router.get("/transactions/:requester_id", getTransactionsByRequesterId);
// router.get("/transactions/:listing_id", getTransactionsByOwnerId);
router.put("/transactions", createTransaction);
router.patch("/transactions/:id", updateTransaction);
router.delete("/transactions/:id", deleteTransaction);
module.exports = router;

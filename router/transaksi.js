const express = require("express");
const router = express.Router();

//create transaction
router.post(
  "/transactions",
  [
    body("amount").isNumeric().notEmpty(),
    body("details").isArray().notEmpty(),
    body("details.*.productName").isString().notEmpty(),
    body("details.*.quantity").isInt({ min: 1 }).notEmpty(),
    body("details.*.price").isNumeric().notEmpty(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, details } = req.body;

    const tx = await transactionRepository.startTransaction();

    try {
      const transaction = await transactionRepository.saveTransaction({
        amount,
      });

      for (const detail of details) {
        await transactionRepository.saveTransactionDetail(
          transaction.id,
          detail.productName,
          detail.quantity,
          detail.price
        );
      }

      // Jika semua berjalan lancar, panggil commit
      await transactionRepository.commitTransaction(tx);

      res.json({ message: "Transaction successfully" });
    } catch (error) {
      // Jika ada kesalahan atau kondisi tertentu, panggil rollback
      await transactionRepository.rollbackTransaction(tx);
      console.error("Error:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// Get transaction by ID
router.get("/transactions/:id", async (req, res) => {
  const transactionId = req.params.id;

  try {
    const transaction = await Transaction.getTransactionByID(transactionId);

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get transaction with details by ID
router.get("/transactions/details/:id", async (req, res) => {
  const transactionId = req.params.id;

  try {
    const transaction = await Transaction.getTransactionWithDetailsByID(
      transactionId
    );

    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete transaction by ID
router.delete("/transactions/:id", async (req, res) => {
  const transactionId = req.params.id;

  try {
    await Transaction.deleteTransaction(transactionId);
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

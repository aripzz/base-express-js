const db = require("../utils/db");

class Transaction {
  async startTransaction() {
    return db.tx();
  }

  async createTransaction(transaction) {
    return db.one(
      "INSERT INTO transactions(amount, status) VALUES($1, $2) RETURNING id",
      [transaction.amount, "pending"]
    );
  }

  async createTransactionDetail(transactionId, productName, quantity, price) {
    return db.none(
      "INSERT INTO transaction_details(transaction_id, product_name, quantity, price) VALUES($1, $2, $3, $4)",
      [transactionId, productName, quantity, price]
    );
  }

  async getTransactionByID(transactionId) {
    return db.oneOrNone("SELECT * FROM transactions WHERE id = $1", [
      transactionId,
    ]);
  }

  async getTransactionWithDetailsByID(transactionId) {
    return db.oneOrNone(
      "SELECT transactions.*, transaction_details.* " +
        "FROM transactions " +
        "JOIN transaction_details ON transactions.id = transaction_details.transaction_id " +
        "WHERE transactions.id = $1",
      [transactionId]
    );
  }

  async deleteTransaction(transactionId) {
    return db.none("DELETE FROM transactions WHERE id = $1", [transactionId]);
  }

  async commitTransaction(tx) {
    return tx.commit();
  }

  async rollbackTransaction(tx) {
    return tx.rollback();
  }
}

module.exports = new Transaction();

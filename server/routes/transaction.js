const express = require("express");
const router = express.Router();
const db = require("../db"); // your mysql2 promise pool instance

// Helper: Convert ISO string to MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
function toMysqlDateTime(jsDate) {
  const date = new Date(jsDate);
  if (isNaN(date.getTime())) {
    return null; // Invalid date
  }
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

// POST /api/transactions
router.post("/", async (req, res) => {
  let {
    studentId,
    items,
    totalAmount,
    balanceBefore,
    balanceAfter,
    transactionDate,
  } = req.body;

  if (
    !studentId ||
    !Array.isArray(items) ||
    items.length === 0 ||
    totalAmount == null ||
    balanceBefore == null ||
    balanceAfter == null ||
    !transactionDate
  ) {
    return res.status(400).json({ error: "Missing required transaction fields" });
  }

  // Convert transactionDate to MySQL DATETIME format
  const mysqlDate = toMysqlDateTime(transactionDate);
  if (!mysqlDate) {
    return res.status(400).json({ error: "Invalid transactionDate format" });
  }
  transactionDate = mysqlDate;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // Insert into transactions table
    const [transactionResult] = await connection.execute(
      `INSERT INTO transactions
       (student_id, total_amount, balance_before, balance_after, transaction_date)
       VALUES (?, ?, ?, ?, ?)`,
      [studentId, totalAmount, balanceBefore, balanceAfter, transactionDate]
    );

    const transactionId = transactionResult.insertId;

    // Prepare item values for bulk insert
    const itemValues = items.map(item => [
  transactionId,
  item.productId || null,
  item.productName || "Unknown Product",  // fallback if missing
  item.category || null,
  item.quantity,
  item.price,
]);


    await connection.query(
      `INSERT INTO transaction_items
       (transaction_id, product_id, product_name, category, quantity, price)
       VALUES ?`,
      [itemValues]
    );

    await connection.commit();

    res.status(201).json({ message: "Transaction saved successfully", transactionId });
  } catch (error) {
    await connection.rollback();
    console.error("Error saving transaction:", error);
    res.status(500).json({ error: "Failed to save transaction" });
  } finally {
    connection.release();
  }
});

module.exports = router;

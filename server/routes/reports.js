const express = require("express");
const router = express.Router();
const db = require("../db"); // mysql2 promise-based connection

// Student-wise daily sales report
router.get("/daily/student-wise", async (req, res) => {
  try {
    let { date } = req.query;

    // If no date provided, default to today
    if (!date) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      date = `${yyyy}-${mm}-${dd}`;
    }

    console.log("Generating Student-wise Sales Report for date:", date);

    // Query transactions and join with student_accounts
    const query = `
      SELECT 
        sa.store_number,
        COALESCE(sa.full_name, 'Deleted Student') AS full_name,
        COALESCE(sa.branch, '-') AS branch,
        COALESCE(sa.year, '-') AS year,
        COALESCE(sa.course_type, '-') AS course_type,
        SUM(t.total_amount) AS total_spent,
        COUNT(t.id) AS transactions_count
      FROM transactions t
      LEFT JOIN student_accounts sa ON sa.id = t.student_id
      WHERE t.transaction_date >= ? AND t.transaction_date < DATE_ADD(?, INTERVAL 1 DAY)
      GROUP BY t.student_id
      ORDER BY total_spent DESC
    `;

    const [results] = await db.query(query, [date, date]);

    console.log("Student-wise Sales Report generated successfully:", results.length);
    console.log(results);

    res.json(results);

  } catch (err) {
    console.error("Error fetching student-wise daily sales report:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Item-wise daily sales report
router.get("/daily/item-wise", async (req, res) => {
  try {
    let { date } = req.query;

    // If no date provided, default to today
    if (!date) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      date = `${yyyy}-${mm}-${dd}`;
    }

    console.log("Generating Item-wise Sales Report for date:", date);

    const query = `
      SELECT 
        ti.product_id,
        COALESCE(ii.product_name, 'Deleted Item') AS product_name,
        COALESCE(ii.category, '-') AS category,
        SUM(ti.quantity) AS total_quantity_sold,
        SUM(ti.quantity * ti.price) AS total_sales
      FROM transaction_items ti
      LEFT JOIN inventory_items ii ON ii.id = ti.product_id
      LEFT JOIN transactions t ON t.id = ti.transaction_id
      WHERE DATE(t.transaction_date) = ?
      GROUP BY ti.product_id
      ORDER BY total_sales DESC
    `;

    // Using async/await
    const [results] = await db.query(query, [date]);

    console.log("Item-wise Sales Report generated successfully.");
    console.log(results);

    res.json(results);
  } catch (err) {
    console.error("Error fetching item-wise daily sales report:", err);
    res.status(500).json({ error: "Database error" });
  }
});


// Low Balance Report
router.get("/daily/low-balance", async (req, res) => {
  try {
    let { threshold } = req.query;

    // Default threshold if not provided
    if (!threshold) threshold = 50; // default low balance limit

    console.log(`Generating Low Balance Report for threshold: ${threshold}`);

    const query = `
      SELECT 
        sa.store_number AS store_id,
        sa.full_name,
        sa.branch,
        sa.year,
        sa.course_type,
        t.balance_after AS current_balance
      FROM student_accounts sa
      JOIN (
        SELECT student_id, MAX(id) AS last_transaction_id
        FROM transactions
        GROUP BY student_id
      ) lt ON lt.student_id = sa.id
      JOIN transactions t ON t.id = lt.last_transaction_id
      WHERE t.balance_after < ?
      ORDER BY t.balance_after ASC
    `;

    const [results] = await db.query(query, [threshold]);

    console.log("Low Balance Report generated successfully.");
    console.log(results);

    res.json(results);
  } catch (err) {
    console.error("Error fetching Low Balance Report:", err);
    res.status(500).json({ error: "Database error" });
  }
});


router.get("/monthly/sales-summary", async (req, res) => {
  try {
    let { month, year } = req.query;

    // Default: current month and year
    const today = new Date();
    if (!month) month = today.getMonth() + 1; // JS months start from 0
    if (!year) year = today.getFullYear();

    console.log(`Generating Monthly Sales Summary for ${year}-${month}`);

    const query = `
      SELECT 
        DATE_FORMAT(transaction_date, '%Y-%m') AS month,
        SUM(total_amount) AS total_sales,
        COUNT(id) AS total_transactions
      FROM transactions
      WHERE YEAR(transaction_date) = ? AND MONTH(transaction_date) = ?
      GROUP BY month
      ORDER BY month ASC
    `;

    const [results] = await db.query(query, [year, month]);

    console.log("Monthly Sales Summary generated successfully.");
    console.log(results);

    res.json(results);
  } catch (err) {
    console.error("Error fetching Monthly Sales Summary:", err);
    res.status(500).json({ error: "Database error" });
  }
});


router.get("/monthly/inventory-usage", async (req, res) => {
  try {
    let { month, year } = req.query;

    // Default: current month and year
    const today = new Date();
    if (!month) month = today.getMonth() + 1; // JS months start from 0
    if (!year) year = today.getFullYear();

    console.log(`Generating Inventory Usage Report for ${year}-${month}`);

    const query = `
      SELECT 
        ti.product_id,
        ti.product_name,
        ti.category,
        SUM(ti.quantity) AS total_quantity_sold,
        SUM(ti.quantity * ti.price) AS total_revenue
      FROM transaction_items ti
      JOIN transactions t ON t.id = ti.transaction_id
      WHERE YEAR(t.transaction_date) = ? AND MONTH(t.transaction_date) = ?
      GROUP BY ti.product_id, ti.product_name, ti.category
      ORDER BY total_quantity_sold DESC
    `;

    const [results] = await db.query(query, [year, month]);

    console.log("Inventory Usage Report generated successfully.");
    console.log(results);

    res.json(results);
  } catch (err) {
    console.error("Error fetching Inventory Usage Report:", err);
    res.status(500).json({ error: "Database error" });
  }
});


router.get("/monthly/student-activity", async (req, res) => {
  try {
    let { month, year } = req.query;

    // Default to current month and year if not provided
    const today = new Date();
    if (!month) month = today.getMonth() + 1; // JS months start at 0
    if (!year) year = today.getFullYear();

    console.log(`Generating Student Activity Report for ${year}-${month}`);

    const query = `
      SELECT 
        t.student_id,
        COALESCE(sa.full_name, 'Deleted Student') AS full_name,
        COALESCE(sa.branch, '-') AS branch,
        COALESCE(sa.year, '-') AS year,
        COALESCE(sa.course_type, '-') AS course_type,
        COUNT(t.id) AS total_transactions,
        SUM(t.total_amount) AS total_spent,
        ROUND(SUM(t.total_amount)/COUNT(t.id), 2) AS avg_transaction_value
      FROM transactions t
      LEFT JOIN student_accounts sa ON sa.id = t.student_id
      WHERE YEAR(t.transaction_date) = ? AND MONTH(t.transaction_date) = ?
      GROUP BY t.student_id
      ORDER BY total_spent DESC
    `;

    const [results] = await db.query(query, [year, month]);

    console.log("Monthly Student Activity Report generated successfully.");
    console.log(results);

    res.json(results);
  } catch (err) {
    console.error("Error fetching Monthly Student Activity Report:", err);
    res.status(500).json({ error: "Database error" });
  }
});




module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');
const { sendWelcomeEmail } = require("./emailService");

// Function to generate the next store number
async function generateNextStoreNumber() {
  const [rows] = await db.execute('SELECT MAX(id) as lastId FROM student_accounts');
  const lastId = rows[0].lastId || 0;
  const nextId = lastId + 1;
  return `STU${10000 + nextId}`;
}

router.post('/add-student', async (req, res) => {
  const {
    full_name,
    email,
    dob,
    gender,
    phone_number,
    admission_number,
    branch,
    year,
    course_type,
    transaction_id,
    store_amount 
  } = req.body;

  try {
    // Generate next store number
    const store_number = await generateNextStoreNumber();

    const query = `
      INSERT INTO student_accounts (
        store_number, full_name, email, dob, gender,
        phone_number, admission_number, branch, year,
        course_type, transaction_id,store_amount 
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
    `;

    const values = [
      store_number, full_name, email, dob, gender,
      phone_number, admission_number, branch, year,
      course_type, transaction_id,store_amount
    ];

    await db.execute(query, values);
    await sendWelcomeEmail(email, full_name, store_amount,store_number);

    res.status(201).json({ success: true, store_number });
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.get('/low-balance', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, full_name, store_number, year, store_amount
      FROM student_accounts
      WHERE store_amount < 50
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching low balance students:", err);
    res.status(500).json({ error: "Database error" });
  }
});

router.get('/dashboard-stats', async (req, res) => {
  try {
    const [students] = await db.query(`SELECT COUNT(*) AS total_students FROM student_accounts`);
    const [lowBalance] = await db.query(`SELECT COUNT(*) AS low_balance_students FROM student_accounts WHERE store_amount < 50`);
    const [transactions] = await db.query(`SELECT COUNT(*) AS total_transactions, SUM(total_amount) AS total_spent FROM transactions`);
   
    res.json({
      total_students: students[0].total_students,
      low_balance_students: lowBalance[0].low_balance_students,
      total_transactions: transactions[0].total_transactions,
      total_spent: transactions[0].total_spent || 0,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ error: "Database error while fetching dashboard stats" });
  }
});


// Search student by store number

router.get('/search/:storeNumber', async (req, res) => {
  const storeNumber = req.params.storeNumber;

  try {
    const [rows] = await db.query(
      `
      SELECT 
        id, 
        full_name AS name,
        admission_number,
        email,
        year,
        branch AS department,
        store_amount
      FROM student_accounts
      WHERE store_number = ?
      LIMIT 1
      `,
      [storeNumber]
    );

    if (rows.length > 0) {
      res.status(200).json(rows[0]); 
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ message: 'Database error' });
  }
});


module.exports = router;

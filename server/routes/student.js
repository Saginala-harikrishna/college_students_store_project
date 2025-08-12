const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../db');
const { sendWelcomeEmail } = require("./emailService");

// Function to generate the next store number
async function generateNextStoreNumber() {
  const [rows] = await db.execute('SELECT MAX(id) as lastId FROM student_accounts');
  const lastId = rows[0].lastId || 0;
  const nextId = lastId + 1;
  return `STU${10000 + nextId}`;
}



// Add student and user account
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

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Generate store number
    const store_number = await generateNextStoreNumber();

    // 2. Insert into student_accounts
    const insertStudentQuery = `
      INSERT INTO student_accounts (
        store_number, full_name, email, dob, gender,
        phone_number, admission_number, branch, year,
        course_type, transaction_id, store_amount
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const studentValues = [
      store_number, full_name, email, dob, gender,
      phone_number, admission_number, branch, year,
      course_type, transaction_id, store_amount
    ];
    await connection.execute(insertStudentQuery, studentValues);

    // 3. Create hashed password from store_number
    const hashedPassword = await bcrypt.hash(store_number, 10);

    // 4. Insert into users table
    const insertUserQuery = `
      INSERT INTO users (
        store_id, name, email, password, year_of_study, role
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const userValues = [
      store_number, full_name, email, hashedPassword, year, 'student'
    ];
    await connection.execute(insertUserQuery, userValues);

    // 5. Send welcome email
    await sendWelcomeEmail(email, full_name, store_amount, store_number);

    // 6. Commit transaction
    await connection.commit();

    res.status(201).json({ success: true, store_number });
  } catch (error) {
    await connection.rollback();
    console.error('Error adding student:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  } finally {
    connection.release();
  }
});




router.get("/low-balance", async (req, res) => {
  try {
    

    let { search = "", year = "", branch = "", limit = 10 } = req.query;

    limit = Number(limit) || 10;

    let query = "SELECT * FROM student_accounts WHERE 1=1";
    let params = [];

    // ✅ Search filter (case-insensitive, both name & admission number)
    if (search && search.trim() !== "") {
      query += " AND (LOWER(full_name) LIKE ? OR LOWER(admission_number) LIKE ?)";
      const searchTerm = `%${search.trim().toLowerCase()}%`;
      params.push(searchTerm, searchTerm);
    }

    // ✅ Year filter
    if (year) {
      query += " AND year = ?";
      params.push(Number(year));
    }

    // ✅ Branch filter
    if (branch && branch.trim() !== "") {
      query += " AND LOWER(branch) = ?";
      params.push(branch.trim().toLowerCase());
    }

    // ✅ Limit
    query += " LIMIT ?";
    params.push(limit);


    const [rows] = await db.query(query, params);
    res.json(rows);

  } catch (err) {
    console.error("Route crashed:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});
;




router.get('/dashboard-stats', async (req, res) => {
  try {
    const [students] = await db.query(`SELECT COUNT(*) AS total_students FROM student_accounts`);
    const [lowBalance] = await db.query(`SELECT COUNT(*) AS low_balance_students FROM student_accounts WHERE store_amount < 50`);
    const [transactions] = await db.query(`SELECT COUNT(*) AS total_transactions, SUM(store_amount) AS total_spent FROM student_accounts`);
   
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


router.put('/:id', async (req, res) => {
  const studentId = req.params.id ?? null; // fallback to null
  const { full_name, email, branch, store_amount } = req.body;


  try {
    const updateQuery = `
      UPDATE student_accounts
      SET full_name = ?, email = ?, branch = ?, store_amount = ?
      WHERE id = ?
    `;

    const [updateResult] = await db.execute(updateQuery, [
      full_name ?? null,
      email ?? null,
      branch ?? null,
      store_amount ?? null,
      studentId
    ]);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const [rows] = await db.execute(
      'SELECT * FROM student_accounts WHERE id = ?',
      [studentId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Student not found after update' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


router.delete('/:id', async (req, res) => {
  const studentId = req.params.id;

  try {
    const [result] = await db.execute('DELETE FROM student_accounts WHERE id = ?', [studentId]);

    if (result.affectedRows === 0) {
      // No student found with this ID
      return res.status(404).json({ message: 'Student not found' });
    }

    // Successful deletion
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});





// GET student by email
router.get("/email/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const [rows] = await db.execute(
      "SELECT * FROM student_accounts WHERE email = ?",
      [email]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Student not found" });
    }
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;

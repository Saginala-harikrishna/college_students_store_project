const express = require('express');
const router = express.Router();
const db = require('../db');
const nodemailer = require("nodemailer");

// 📧 Create transporter (you can move this to a separate file)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'va12ms34i@gmail.com', // store in .env
    pass: 'gqph xoja nojk xoio', // app password
  },
});

router.post("/", async (req, res) => {
  let {
    studentId,
    studentEmail,
    items,
    totalAmount,
    balanceBefore,
    balanceAfter,
    transactionDate,
     
  } = req.body;

  // ... existing validations ...

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
   const moment = require('moment-timezone');
const formattedDate = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
// 2025-08-13 19:32:15


    // Save transaction
    const [transactionResult] = await connection.execute(
      `INSERT INTO transactions
       (student_id, total_amount, balance_before, balance_after, transaction_date)
       VALUES (?, ?, ?, ?, ?)`,
      [studentId, totalAmount, balanceBefore, balanceAfter, formattedDate]
    );

    const transactionId = transactionResult.insertId;

    const itemValues = items.map(item => [
      transactionId,
      item.productId || null,
      item.productName || "Unknown Product",
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

    // 📧 Send email after successful transaction
    if (studentEmail) {
      const mailOptions = {
        from:'va12ms34i@gmail.com',
        to: studentEmail,
        subject: "Purchase Confirmation",
        html: `
          <h2>From JNTUA CEA Store</h2>
          <h2>Thank you for your purchase!</h2>
          <p>Your transaction ID: <strong>${transactionId}</strong></p>
          <p>Total Amount: <strong>₹${totalAmount}</strong></p>
          <p>Balance Before: ₹${balanceBefore}</p>
          <p>Balance After: ₹${balanceAfter}</p>
          <h3>Purchased Items:</h3>
          <ul>
            ${items.map(i => `<li>${i.productName} (${i.quantity} × ₹${i.price})</li>`).join("")}
          </ul>
          <p>Date: ${transactionDate}</p>
        `
      };

      await transporter.sendMail(mailOptions);
    }

    res.status(201).json({
      message: "Transaction saved successfully and email sent",
      transactionId
    });

  } catch (error) {
    await connection.rollback();
    console.error("Error saving transaction:", error);
    res.status(500).json({ error: "Failed to save transaction" });
  } finally {
    connection.release();
  }
});



router.get("/today", async (req, res) => {
  try {
   const query = `
      SELECT 
          s.full_name,
          s.store_number,
          t.id AS transaction_id,
          t.transaction_date,
          i.product_name,
          i.category,
          ti.quantity,
          ti.price,
          t.total_amount,
          t.transaction_date
      FROM transactions t
      JOIN student_accounts s 
          ON t.student_id = s.id
      JOIN transaction_items ti
          ON t.id = ti.transaction_id
      JOIN inventory_items i
          ON ti.product_id = i.id
WHERE DATE(t.transaction_date) = CURDATE()
      ORDER BY t.transaction_date desc;
`;

     
    const [rows] = await db.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});


module.exports = router;
const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  console.log("Login Request: ", req.body);

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (rows.length === 0) {
      return res.json({ success: false, message: 'Invalid credentials' });
    }


    const user = rows[0];
    


    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch || user.role !== role) {
      return res.json({ success: false, message: 'Invalid credentials or role' });
    }

    return res.json({ success: true, data: user });

  } catch (err) {
    console.error("Login Error: ", err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;

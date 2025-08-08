const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/inventory - Add new inventory item
router.post('/', async (req, res) => {
  const { product_name, category, quantity, price, description } = req.body;

  const allowedCategories = ['Stationary', 'Food', 'Electronics', 'Services'];
  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  try {
    // Make sure the table exists or has been created in your MySQL database
    const query = `
      INSERT INTO inventory_items
      (product_name, category, quantity, price, description)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      product_name,
      category,
      quantity,
      price,
      description
    ]);

    res.status(200).json({
      message: 'Item added successfully',
      insertedId: result.insertId
    });
  } catch (err) {
    console.error('DB Error while inserting item:', err);
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ error: 'Database table "inventory_items" not found. Please create the table.' });
    }
    res.status(500).json({ error: 'Database error occurred' });
  }
});



router.get('/list', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM inventory_items ORDER BY date_added DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching inventory:', err);
    res.status(500).json({ error: 'Failed to fetch inventory items' });
  }
});



router.put('/edit/:id', async (req, res) => {
  const itemId = req.params.id;
  const { product_name, category, quantity, price, description } = req.body;

  const allowedCategories = ['Stationary', 'Food', 'Electronics', 'Services'];
  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ error: 'Invalid category' });
  }

  try {
    const query = `
      UPDATE inventory_items 
      SET product_name = ?, category = ?, quantity = ?, price = ?, description = ?
      WHERE id = ?
    `;
    const [result] = await db.execute(query, [product_name, category, quantity, price, description, itemId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Item not found for update' });
    }

    res.status(200).json({ message: 'Item updated successfully' });
  } catch (err) {
    console.error('DB Error while updating item:', err);
    res.status(500).json({ error: 'Database error occurred' });
  }
});


module.exports = router;
